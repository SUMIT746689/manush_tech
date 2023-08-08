import bcrypt from 'bcrypt';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import fsp from 'fs/promises';
import axios from 'axios';
import prisma from '@/lib/prisma_client';
import fs from 'fs';

import { fileRename, fileUpload } from '@/utils/upload';

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

    const uploadFolderName = 'studentsPhoto';

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      logo: fileType,
      signature: fileType,
      background_image: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
    if (error) {
      throw new Error('Server Error !')
    }
    const filePathQuery = {}

    if (files?.student_photo?.newFilename) {
      filePathQuery['student_photo_path'] = await fileRename(files,
        uploadFolderName, "student_photo",
        Date.now().toString() + '_' + files?.student_photo?.originalFilename)
    }
    if (files?.father_photo?.newFilename) {
      filePathQuery['father_photo_path'] = await fileRename(files,
        uploadFolderName, "father_photo",
        Date.now().toString() + '_' + files?.father_photo?.originalFilename)
    }
    if (files?.mother_photo?.newFilename) {
      filePathQuery['mother_photo_path'] = await fileRename(files,
        uploadFolderName, "mother_photo",
        Date.now().toString() + '_' + files?.mother_photo?.originalFilename)
    }
    if (files?.guardian_photo?.newFilename) {
      filePathQuery['guardian_photo_path'] = await fileRename(files,
        uploadFolderName, "guardian_photo",
        Date.now().toString() + '_' + files?.guardian_photo?.originalFilename)
    }
    console.log({ filePathQuery });

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
      for (const i in files) {
        fs.unlinkSync(files[i].filepath)
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
          // @ts-ignore
          father_photo: filePathQuery?.father_photo_path,
          mother_name: fields?.mother_name,
          mother_phone: fields?.mother_phone,
          mother_profession: fields?.mother_profession,
          // @ts-ignore
          mother_photo: filePathQuery?.mother_photo_path,

          student_permanent_address: fields?.student_permanent_address,
          previous_school: fields?.previous_school,

          school: {
            connect: { id: parseInt(fields.school_id) }
          },
          user: {
            create: {
              username: fields.username,
              password: hashPassword,
              // @ts-ignore
              user_photo: filePathQuery?.student_photo_path,
              user_role: { connect: { id: student_role.id } },
              role: { connect: { id: student_role.id } },
              school: { connect: { id: parseInt(fields.school_id) } }
            }
          }
        }
      });


      const student = await transaction.student.create({
        data: {
          class_roll_no: fields?.roll_no,
          class_registration_no: fields?.registration_no,
          discount: parseFloat(fields?.discount),
          // @ts-ignore
          student_photo: filePathQuery?.student_photo_path,
          guardian_name: fields?.guardian_name,
          guardian_phone: fields?.guardian_phone,
          guardian_profession: fields?.guardian_profession,
          // @ts-ignore
          guardian_photo: filePathQuery?.guardian_photo_path,
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
