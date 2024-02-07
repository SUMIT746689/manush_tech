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
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsUnicode, verifyNumeric } from 'utilities_api/verify';
import { handleConvBanNum } from 'utilities_api/convertBanFormatNumber';
import { handleNumberOfSmsParts } from 'utilities_api/handleNoOfSmsParts';


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

    if (!fields.contact_column) throw new Error("contact field is missing")
    if (!file_upload?.originalFilename) throw new Error("file not found")
    // if (!fields.sms_gateway_id) throw new Error('sms gateway filed is missing')

    // response from sms gateway response
    const smsGatewayRes = await prisma.smsGateway.findFirst({
      where: {
        school_id: school_id,
        // id: fields.sms_gateway_id 
      }
    })
    // if(smsGatewayRes.)
    console.log({ smsGatewayRes })
    const { id: smsGatewayId, details } = smsGatewayRes;
    const { sender_id, is_masking } = <any>details ?? {};

    const allMatchesArray = findMatches(fields.body);

    res.setHeader('Content-Type', 'application/json')
    const datas = fs.createReadStream(file_upload.filepath, { highWaterMark: (128 * 100) });
    let buffer_part = 0;
    const bufferList = [];
    datas.on("data", (buffer) => {
      // console.log({ buffer });
      bufferList.push(buffer)
      buffer_part += 1;
      res.status(404)
    });

    datas.on("end", async () => {

      const totalBuffer = Buffer.concat(bufferList);
      // console.log({ totalBuffer })

      const uint8 = new Uint8Array(totalBuffer)
      const workbook = XLSX.read(uint8, { type: "array" })
      /* DO SOMETHING WITH workbook HERE */
      const firstSheetName = workbook.SheetNames[0]
      /* Get worksheet */
      const worksheet = workbook.Sheets[firstSheetName];
      const excelArrayDatas = XLSX.utils.sheet_to_json(worksheet, { raw: true })

      if (excelArrayDatas.length > 30000) return res.status(404).json({ error: "large file, maximum support 30,000 row" })


      const resSentSms = [];
      let total_sms_count = 0;
      excelArrayDatas.forEach((value, index) => {
        let body = fields.body;
        let contacts = value[fields.contact_column];

        const isNumeric = verifyNumeric(contacts);
        if (!isNumeric) return;
        const { number, err } = handleConvBanNum(String(contacts));
        if (err) return;

        for (const element of allMatchesArray) {
          body = body.replaceAll(`#${element}#`, value[element])
        }

        const isUnicode = verifyIsUnicode(body || '');
        const number_of_sms_parts = handleNumberOfSmsParts({ isUnicode, textLength: body.length })
        total_sms_count += number_of_sms_parts;
        resSentSms.push({
          sms_shoot_id: String(new Date().getTime()) + String(id) + String(index),
          user_id: parseInt(id),
          school_id,
          school_name: school.name,
          sender_id: smsGatewayId,
          sender_name: sender_id,
          sms_type: isUnicode ? 'unicode' : 'text',
          sms_text: body,
          submission_time: new Date(Date.now()),
          contacts: number,
          pushed_via: 'gui-file-upload',
          total_count: 1,
          number_of_sms_parts
        });
      })

      if (resSentSms.length === 0) {
        logFile.error("contact numbers is not valid");
        return res.status(404).json({ error: "contact numbers is not valid" })
      }

      let error: string | null;
      // await prisma.$transaction([
      await prisma.tbl_queued_sms.createMany({
        data: resSentSms
      })
        .then(async () => await prisma.school.update({ where: { id: school_id }, data: { masking_sms_count: { decrement: is_masking ? total_sms_count : 0 }, non_masking_sms_count: { decrement: is_masking ? 0 : total_sms_count } } }))
        .catch(err => { error = err.message })

      if (error) {
        logFile.error(error);
        return res.status(404).json({ error: error })
      }

      res.status(200).end();
    });

    datas.on("error", () => {
      res.status(500).res.end();
    })

  } catch (err) {
    logFile.error(err.message)
    console.log({ err: err.message })
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)