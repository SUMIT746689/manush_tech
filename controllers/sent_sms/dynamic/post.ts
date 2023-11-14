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
import { getSheetHeaders } from '@/utils/sheet';
import { findMatches } from '@/utils/findMatches';


async function post(req, res, refresh_token) {
  try {

    const uploadFolderName = 'sent_sms';

    const fileType = ['text/csv', 'application/vnd.ms-excel'];
    // const fileType = ['pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const filterFiles = {
      // file_upload: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
    const { file_upload } = files;
  
    if (!file_upload?.originalFilename) throw new Error("file not found")
  
    const allMatchesArray = findMatches(fields.body);
    // console.log(result);
    // return res.status(400).json(result);
    

    res.setHeader('Content-Type', 'application/json')
    const datas = fs.createReadStream(file_upload.filepath);
    datas.on("data", (buffer) => {
      // const a = XLSX.readFile(file_upload.filepath)
      // const {Sheets} = a;
      // console.log({a});
      var workbook = XLSX.read(buffer, { type: "buffer" });
      // const {Workbook} = workbook;
      const { Sheets } = workbook;
      const { Sheet1 } = Sheets;
      // console.log(JSON.stringify(Sheet1));
      const headers = getSheetHeaders(Sheet1);
      console.log({ headers });

      
      
      // let a = 0;
      // for (const property in Sheet1) {
      //   // console.log(`${property}: ${Sheet1[property]}`);
      //   if (a > 10) continue;
      //   a += 1;
      //   console.log(Sheet1[property]);

      // }

      res.status(404).write(JSON.stringify(Sheet1));
      // console.log({ data })
    })
    // console.log("hello....");
    datas.on("end", () => {
      console.log({});
      res.end();
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