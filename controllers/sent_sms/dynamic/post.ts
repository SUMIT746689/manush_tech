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
    if(!fields.contact_column) throw new Error("required fields missing")
    if (!file_upload?.originalFilename) throw new Error("file not found")

    const allMatchesArray = findMatches(fields.body);

    res.setHeader('Content-Type', 'application/json')
    const datas = fs.createReadStream(file_upload.filepath);
    const sent_sms = [];
    datas.on("data", (buffer) => {

      // @ts-ignore
      const uint8 = new Uint8Array(buffer)
      const workbook = XLSX.read(uint8, { type: 'array' })
      /* DO SOMETHING WITH workbook HERE */
      const firstSheetName = workbook.SheetNames[0]
      /* Get worksheet */
      const worksheet = workbook.Sheets[firstSheetName]
      const excelArrayDatas = XLSX.utils.sheet_to_json(worksheet, { raw: true })

      excelArrayDatas.forEach((value, index) => {
        let body = fields.body;
        let contacts = value[fields.contact_column];

        for (const element of allMatchesArray) {
          body = body.replaceAll(`#${element}#`, value[element])
        }
        console.log({ contacts })
        // console.log({ body });
        sent_sms.push({
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
        })
      })
      res.status(404)
    });

    datas.on("end", async () => {
      await prisma.$transaction([
        prisma.tbl_queued_sms.createMany({
          data: sent_sms
        }),
        prisma.tbl_sent_sms.createMany({
          data: sent_sms
        })
      ]);
      res.end();
    });
    datas.on("error", () => {
      res.status(500).res.end();
    })

    // const a = XLSX.readFile(file_upload.filepath)
    // const {Sheets} = a;
    // console.log({a});

    // const file = read.readFile('./test.xlsx')

    // let data = []

    // const sheets = file.SheetNames

    // for (let i = 0; i < sheets.length; i++) {
    //   const temp = reader.utils.sheet_to_json(
    //     file.Sheets[file.SheetNames[i]])
    //   temp.forEach((res) => {
    //     data.push(res)
    //   })
    // }

    // Printing data 
    // console.log(data)
    // // console.log({req:req});
    // // const uploadFolder = path.join(__dirname,"AllFiles","sent_sms");
    // const uploadFolder = path.join(__dirname,"AllFiles");
    // console.log({uploadFolder})
    // const form = new formidable.IncomingForm();
    // form.uploadDir = uploadFolder;
    // form.parse(req, async (err, fields, files) => {
    //   //  console.log({files});
    // });
    // form.on("file",(data,value)=>{
    //   const {_writeStream} = value ;
    //   // console.log({_writeStream});

    //   // const buffer = new Buf
    //   })
    // // const datas = await req.formData();
    // // const file = datas.get("file_upload");
    // // const bytes = await file.arrayBuffer();
    // // const buffer = Buffer.from(bytes);
    // // const buffer = Buffer.from(req._readableState.buffer)
    // // console.log({buffer})
    // // console.log({body: req.body})
    // return res.status(404).end();




    // await prisma.$transaction([
    //   prisma.tbl_queued_sms.create({
    //     data: {
    //       sms_shoot_id,
    //       user_id: parseInt(user_id),
    //       school_id,
    //       school_name,
    //       sender_id,
    //       sms_type: 'masking',
    //       sms_text,
    //       // // sender_id: 1,
    //       // // sender_name: "",
    //       submission_time: new Date(Date.now()),
    //       contacts,
    //       pushed_via: '',
    //       // // status: status,
    //       // // route_id: 1,
    //       // // coverage_id: 1,
    //       // // charges_per_sms: 0.25,
    //       total_count: 1,
    //       // // is_black_list: 2,
    //       //fail_count: 3,
    //       //priority: 4
    //     }
    //   }),
    //   prisma.tbl_sent_sms.create({
    //     data: {
    //       sms_shoot_id,
    //       user_id: parseInt(user_id),
    //       school_id,
    //       school_name,
    //       sender_id,
    //       sms_type: 'masking',
    //       sms_text,
    //       // // sender_id: 1,
    //       // // sender_name: "",
    //       submission_time: new Date(submission_time),
    //       contacts,
    //       pushed_via: '',
    //       // // status: status,
    //       // // route_id: 1,
    //       // // coverage_id: 1,
    //       // // charges_per_sms: 0.25,
    //       total_count: 1,
    //       // // is_black_list: 2,
    //       //fail_count: 3,
    //       //priority: 4
    //     }
    //   }),
    // ])
    //   .then(res => { console.log("tbl_queue_sms", res) })
    //   .catch(err => { console.log("tbl_queue_sms", err) });

  } catch (err) {
    console.log({ err: err.message })
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)