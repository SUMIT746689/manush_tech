import prisma from '@/lib/prisma_client';
import { Prisma } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { createCampaign, getUsers, sentSms } from '../postContent/postContent';
import { formidable } from 'formidable';
import path from 'path';
import { fileUpload } from '@/utils/upload';
import fs from "fs";
import {read} from "xlsx";
import * as XLSX from 'xlsx/xlsx.mjs';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

async function post(req, res, refresh_token) {
  try {

    const uploadFolderName = 'sent_sms';

    const fileType = ['text/csv', 'application/vnd.ms-excel'];
    // const fileType = ['pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const filterFiles = {
      // file_upload: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
    console.log("files, fields__", files, fields);
    const { file_upload } = files;
    if(!file_upload?.originalFilename) throw new Error("file not found")
    // fields
    // let bufferData = [];
    res.setHeader('Content-Type', 'application/json')
    const datas = fs.createReadStream(file_upload.filepath);
    datas.on("data", (buffer) => { 
      // const a = XLSX.readFile(file_upload.filepath)
      // const {Sheets} = a;
      // console.log({a});
      var workbook = XLSX.read(buffer, {type:"buffer"});
      // const {Workbook} = workbook;
      const {Sheets} = workbook;
      const { Sheet1} = Sheets;
      // console.log(JSON.stringify(Sheet1));
      res.status(404).write(JSON.stringify(Sheet1));
      // console.log({ data })
     })
    // console.log("hello....");
    datas.on("end",()=>{
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













    // const { sms_gateway_id, campaign_name, recipient_type, role_id, class_id, section_id, name: individual_user_id, body: custom_body, sms_template_id } = req.body;
    // const { school_id, id } = refresh_token;

    // if (!sms_gateway_id || !recipient_type) throw new Error("required valid datas")

    // const data = {
    //   sms_gateway_id,
    //   school: { connect: { id: refresh_token.school_id } }
    // }

    // // response from sms gateway response
    // const smsGatewayRes = prisma.smsGateway.findFirst({ where: { school_id: school_id } })

    // // school information
    // const schoolInfoRes = prisma.school.findFirst({ where: { id: school_id }, select: { name: true } })

    // // school information
    // const userRes = prisma.user.findFirst({ where: { id: parseInt(id) }, select: { username: true } })

    // const resQueries = await Promise.all([smsGatewayRes, schoolInfoRes, userRes])

    // const { details }: any = resQueries[0];
    // const { sender_id, sms_api_key: api_key } = details ?? {};
    // if (!sender_id && !api_key) throw new Error("sender_id or api_key missing");

    // const date = Date.now();
    // const sms_shoot_id = String(id) + "_" + String(date)
    // const { name: school_name } = resQueries[1];
    // const { username } = resQueries[2];

    // const sentSmsData = {
    //   sms_shoot_id,
    //   school_id,
    //   school_name,
    //   user_id: id,
    //   user_name: username,
    //   sender_id,
    //   // sender_name: username,
    //   pushed_via: "gui",
    //   sms_type: "masking",
    //   sms_text: custom_body,
    //   submission_time: new Date(),
    //   sms_gateway_status: "pending",
    //   // campaign_id,
    //   // campaign_name,
    // }

    // switch (recipient_type) {
    //   case "GROUP":
    //     if (!role_id) throw new Error("permission denied");

    //     const roles = await prisma.role.findMany({ where: { id: { in: role_id } }, select: { title: true, id: true } })

    //     // const roleArray = [];
    //     // get users persmissions
    //     // const user = await prisma.user.findFirst({ where: { id: refresh_token.id }, select: { role: { select: { permissions: { select: { value: true } } } }, permissions: { select: { value: true } } } })
    //     //get permissions
    //     // const permissions = user.role?.permissions ? user.role.permissions : user.permissions;

    //     // check user have that permission or not
    //     // const some = permissions.some(permission => permission.value === `create_${ role?.title?.toLowerCase() || '' } `)

    //     // if (!some) throw new Error("permissions denied");

    //     if (!Array.isArray(roles) || roles.length <= 0) throw new Error("Invalid role");

    //     const contactsArr = [];
    //     for (const role of roles) {

    //       let singleGroupUsers = null;

    //       //get users for sending sms 
    //       singleGroupUsers = await getUsers({ where: { school_id: Number(school_id), NOT: { phone: null } }, role })
    //       if (!singleGroupUsers || singleGroupUsers.length === 0) continue;
    //       const contacts_ = singleGroupUsers.map(user => user.phone);
    //       contactsArr.push(...contacts_);
    //     };

    //     const contacts = contactsArr.join(',');

    //     sentSmsData["contacts"] = contacts;
    //     sentSmsData["total_count"] = contactsArr.length;

    //     break;

    //   case "CLASS":

    //     const sections = section_id.join(", ");

    //     const resUsers: [{ phone: string }] | [] = await prisma.$queryRaw`
    //       SELECT student_informations.phone as phone FROM students
    //       JOIN student_informations ON student_informations.id = students.student_information_id
    //       JOIN sections ON students.section_id = sections.id
    //       WHERE class_id = ${class_id} AND school_id = ${refresh_token.school_id} AND phone IS NOT null
    //       ${(Array.isArray(section_id) && section_id.length > 0) ? Prisma.sql`AND section_id IN (${sections})` : Prisma.empty}
    //     `
    //     if (resUsers.length === 0) throw new Error("No contacts found")

    //     sentSmsData["contacts"] = resUsers.map(resUser => resUser.phone).join(',');
    //     sentSmsData["total_count"] = resUsers.length;

    //     break;

    //   case "INDIVIDUAL":

    //     const role = await prisma.role.findFirstOrThrow({ where: { id: req.body.role_id } });
    //     const resIndividualUsers = await getUsers({ where: { school_id: Number(refresh_token.school_id), NOT: { phone: null }, user: { id: { in: individual_user_id } } }, role })

    //     if (resIndividualUsers.length === 0) throw new Error("No contacts founds")

    //     sentSmsData["contacts"] = resIndividualUsers.map(resUser => resUser.phone).join(',');
    //     sentSmsData["total_count"] = resIndividualUsers.length;

    //     break;

    //   default:
    //     throw new Error("invalid recipient type ");
    // }

    // // insert sent sms in sentsms table   
    // await createCampaign({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id: refresh_token.school_id, custom_body });

    // // users sending sms handle 
    // sentSms(sentSmsData);

    // // throw new Error("invalid recipient type ")
    // return res.json({ message: 'success' });

  } catch (err) {
    console.log({ err: err.message })
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)