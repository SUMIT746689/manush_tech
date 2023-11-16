import prisma from '@/lib/prisma_client';
import { Prisma } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { createCampaign, getUsers, sentSms } from '../postContent/postContent';
import { formidable } from 'formidable';
import path from 'path';
import { fileUpload } from '@/utils/upload';
import fs from "fs";
import { read } from "xlsx";
import * as XLSX from 'xlsx/xlsx.mjs';
import { getSheetBodies, getSheetHeaders } from '@/utils/sheet';
import { findMatches } from '@/utils/findMatches';


async function post(req, res, refresh_token) {
  try {

    const { id, school_id } = refresh_token;
    console.log({ id });
    const school = await prisma.school.findFirst({ where: { id: school_id }, select: { name: true } })
    const uploadFolderName = 'sent_sms';

    const fileType = ['text/csv', 'application/vnd.ms-excel'];
    // const fileType = ['pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const filterFiles = {
      // file_upload: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
    const { file_upload } = files;
    console.log({ fields })
    if (!fields.contact_column) throw new Error("required fields missing")
    if (!file_upload?.originalFilename) throw new Error("file not found")

    const allMatchesArray = findMatches(fields.body);

    res.setHeader('Content-Type', 'application/json')
    const datas = fs.createReadStream(file_upload.filepath, { highWaterMark: (128 * 100) });
    let buffer_part = 0;
    const bufferList = [];
    datas.on("data", (buffer) => {
      console.log({ buffer });
      bufferList.push(buffer)
      buffer_part += 1;
      res.status(404)
    });

    datas.on("end", async () => {

      const totalBuffer = Buffer.concat(bufferList);
      console.log({ totalBuffer })

      const uint8 = new Uint8Array(totalBuffer)
      const workbook = XLSX.read(uint8, { type: "array" })
      /* DO SOMETHING WITH workbook HERE */
      const firstSheetName = workbook.SheetNames[0]
      /* Get worksheet */
      const worksheet = workbook.Sheets[firstSheetName]
      const excelArrayDatas = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      
      if(excelArrayDatas.length >30000) return res.status(404).json({error:"large file, maximum support 30,000 row"})
      // console.log({excelArrayDatas})

      const resSentSms = excelArrayDatas.map((value, index) => {
        let body = fields.body;
        let contacts = value[fields.contact_column];

        for (const element of allMatchesArray) {
          body = body.replaceAll(`#${element}#`, value[element])
        }
        console.log({ contacts })
        // console.log({ body });
        return {
          sms_shoot_id: String(new Date().getTime()) + String(id) + String(index),
          user_id: parseInt(id),
          school_id,
          school_name: school.name,
          sender_id: String(id),
          sms_type: 'masking',
          sms_text: body,
          submission_time: new Date(Date.now()),
          contacts: String(contacts),
          pushed_via: '',
          total_count: 1,
        }
      })

      await prisma.$transaction([
        prisma.tbl_queued_sms.createMany({
          data: resSentSms
        }),
        prisma.tbl_sent_sms.createMany({
          data: resSentSms
        })
      ])
        .then(res => { console.log("tbl_queue_sms", res) })
        .catch(err => { console.log("tbl_queue_sms", err) });

      console.log({ buffer_part })
      res.status(200).end();
    });
    datas.on("error", () => {
      res.status(500).res.end();
    })

  } catch (err) {
    console.log({ err: err.message })
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)