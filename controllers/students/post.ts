import bcrypt from 'bcrypt';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import fsp from 'fs/promises';
import axios from 'axios';
import prisma from '@/lib/prisma_client';
import fs from 'fs';

import { fileUpload } from '@/utils/upload';

const postHandle = async (req, res, authenticate_user) => {
  try {
    if (!authenticate_user?.school_id) throw new Error('permission denied');

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: {
        AND: [
          { school_id: parseInt(authenticate_user.school_id) },
          { is_active: true }
        ]
      },
      include: { package: true }
    });

    const studentCount = await prisma.student.count({
      where: {
        student_info: { school_id: parseInt(authenticate_user.school_id) }
      }
    });

    if (studentCount >= subscription.package.student_count) throw new Error('Your package maximum students capacity has already been filled, please update your package');

    try {
      await fsp.readdir(path.join(process.cwd() + '/public', '/files'));
    } catch (error) {
      await fsp.mkdir(path.join(process.cwd() + '/public', '/files'));
    }

    const uploadFolderName = "files";
    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      logo: fileType,
      signature: fileType,
      background_image: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });


    const student_photo_name = files?.student_photo?.newFilename;
    const father_photo_name = files?.father_photo?.newFilename;
    const mother_photo_name = files?.mother_photo?.newFilename;
    const guardian_photo_name = files?.guardian_photo?.newFilename;
    if (
      !fields.first_name ||
      !fields.class_id ||
      !fields.section_id ||
      !fields.password ||
      !fields.admission_date ||
      !fields.date_of_birth ||
      !fields.roll_no ||
      !fields.registration_no ||
      !fields.school_id ||
      !fields.academic_year_id ||
      !fields.phone
    ) {
      const pwd = path.join(process.cwd(), "public", "/files");

      const fileList = {}
      if (student_photo_name) fileList['student_photo_filePath'] = path.join(pwd, student_photo_name)
      if (father_photo_name) fileList['father_photo_filePath'] = path.join(pwd, father_photo_name)
      if (mother_photo_name) fileList['mother_photo_filePath'] = path.join(pwd, mother_photo_name)
      if (guardian_photo_name) fileList['guardian_photo_filePath'] = path.join(pwd, guardian_photo_name)
      for (const i in fileList) {
        if (fs.existsSync(fileList[i])) {
          fs.unlinkSync(fileList[i])
        }
      }
      throw new Error('Required field value missing !!')
    }

    const hashPassword = await bcrypt.hash(
      fields?.password,
      Number(process.env.SALTROUNDS)
    );


    await prisma.$transaction(async (transaction) => {

      const student_role = await transaction.role.findFirst({
        where: {
          title: 'STUDENT'
        }
      })
      const studentInformation = await transaction.studentInformation.create({
        // @ts-ignore
        data: {
          first_name: fields?.first_name,
          middle_name: fields?.middle_name,
          last_name: fields?.last_name,
          admission_no: fields?.admission_no,
          admission_date: new Date(fields?.admission_date),
          admission_status: fields?.admission_status,
          date_of_birth: new Date(fields?.date_of_birth),
          gender: fields?.gender,
          blood_group: fields?.blood_group,
          religion: fields?.religion,
          phone: fields?.phone,
          email: fields?.email,
          national_id: fields?.national_id,

          father_name: fields?.father_name,
          father_phone: fields?.father_phone,
          father_profession: fields?.father_profession,
          father_photo: father_photo_name,
          // @ts-ignore
          mother_name: fields?.mother_name,
          mother_phone: fields?.mother_phone,
          mother_profession: fields?.mother_profession,
          mother_photo: mother_photo_name,

          student_permanent_address: fields?.student_permanent_address,
          previous_school: fields?.previous_school,

          school: {
            connect: { id: parseInt(fields.school_id) }
          },
          user: {
            create: {
              username: fields.username,
              password: hashPassword,
              user_photo: student_photo_name,
              user_role: { connect: { id: student_role.id } },
              role: { connect: { id: student_role.id } },
              school: { connect: { id: parseInt(fields.school_id) } }
            }
          }
        }
      });

      // await prisma.studentStatus.create({
      //     data: {
      //         section_id: parseInt(fields?.section_id),
      //         student_id: student?.id,
      //         session_id: parseInt(fields?.session_id),
      //     }
      // })

      // console.log(fields?.section_id)

      const student = await transaction.student.create({
        data: {
          // student_info: studentInformation,
          // student_information_id: studentInformation.id,
          class_roll_no: fields?.roll_no,
          // academic_year_id: 1,
          class_registration_no: fields?.registration_no,
          discount: parseFloat(fields?.discount),
          student_photo: student_photo_name,
          guardian_name: fields?.guardian_name,
          guardian_phone: fields?.guardian_phone,
          guardian_profession: fields?.guardian_profession,
          guardian_photo: guardian_photo_name,
          relation_with_guardian: fields?.relation_with_guardian,
          student_present_address: fields?.student_present_address,
          section: {
            connect: { id: parseInt(fields?.section_id) }
          },
          academic_year: {
            connect: { id: parseInt(fields?.academic_year_id) }
          },
          student_info: {
            connect: { id: studentInformation.id }
          }
        }
      });



      const fees = await transaction.fee.findMany({
        where: {
          class_id: parseInt(fields.class_id),
          academic_year_id: parseInt(fields?.academic_year_id)
        },
        select: {
          id: true
        }
      });

      let StudentFeeContainer = [];
      for (let i of fees) {
        StudentFeeContainer.push({
          student_id: student?.id,
          fee_id: i.id,
          collected_amount: 0,
          payment_method: 'pending',
        });
      }
      console.log("StudentFeeContainer__", StudentFeeContainer);

      await transaction.studentFee.createMany({
        data: StudentFeeContainer
      });
      //   host: '880sms.com',
      //   port: 3000,
      //   path: `/smsapi?api_key=(APIKEY)&type=text&contacts=(NUMBER)&senderid=(Approved Sender ID)&msg=(Message Content)`,
      //   method: 'POST',
      //   headers: {
      //     // headers such as "Cookie" can be extracted from req object and sent to /test
      //   }
      // }, (response) => {
      //   var data = '';
      //   response.setEncoding('utf8');
      //   response.on('data', (chunk) => {
      //     data += chunk;
      //   });
      //   response.on('end', () => {
      //     res.end('check result: ' + data);
      //   });
      // });
      // request.end();

    })

    const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
      where: {
        school_id: authenticate_user?.school_id,
        is_active: true
      }
    })

    try {
      const sms_res = await axios.post(`https://${sms_res_gatewayinfo?.title}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${fields?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${fields.first_name}, Your username: ${fields.username} and password: ${fields.password}`)}`)
      if (sms_res.data == 1015) {
        return res.status(200).json({ success: 'student created successfully but sms sending failed' });
      }
      else if (sms_res.data.startsWith('SMS SUBMITTED')) {
        return res.status(200).json({ success: 'student created successfully' });
      }
      else {
        return res.status(200).json({ success: 'student created successfully' });
      }

    } catch (err) {
      res.status(200).json({ success: 'student created successfully but sms sending failed' });
    }

    // res.status(200).json({ success: 'student created successfully but sms sending failed' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

export default authenticate(postHandle);
