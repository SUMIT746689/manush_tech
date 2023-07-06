import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import axios from 'axios';

const prisma = new PrismaClient();

const saveImage = (req, saveLocally) => {
  const options: formidable.Options = {};

  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), '/public/files');
    //@ts-ignore
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + '_' + path.originalFilename;
    };
  }
  // options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      if (
        !fields.first_name ||
        !fields.section_id ||
        !fields.academic_year_id ||
        !fields.username ||
        !fields.password ||
        !fields.admission_date ||
        !fields.date_of_birth ||
        !fields.roll_no ||
        !fields.registration_no ||
        !fields.school_id
      ) {
        reject({ message: 'field value missing !!' });
      }
      resolve({ fields, files });
    });
  });
};

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
    console.log({ studentCount }, subscription.package)
    if (studentCount >= subscription.package.student_count) throw new Error('Your package maximum students capacity has already been filled, please update your package');

    // if (subscription)
    try {
      await fs.readdir(path.join(process.cwd() + '/public', '/files'));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd() + '/public', '/files'));
    }

    const { fields, files }: any = await saveImage(req, true);

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
      return res.status(404).json({ message: 'field value missing !!' });
    }
    if (fields.phone.length !== 11) {
      res.status(404).json({ message: 'phone number must be 11 character !!' });
    }

    const student_photo_path = files.student_photo?.newFilename;
    const father_photo_Path = files.father_photo?.newFilename;
    const mother_photo_path = files.mother_photo?.newFilename;
    const guardian_photo_path = files.guardian_photo?.newFilename;

    const hashPassword = await bcrypt.hash(
      fields?.password,
      Number(process.env.SALTROUNDS)
    );

    const student_role = await prisma.role.findFirst({
      where: {
        title: 'STUDENT'
      }
    })
    await prisma.$transaction(async (transaction) => {
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
          father_photo: father_photo_Path,
          // @ts-ignore
          mother_name: fields?.mother_name,
          mother_phone: fields?.mother_phone,
          mother_profession: fields?.mother_profession,
          mother_photo: mother_photo_path,

          student_permanent_address: fields?.student_permanent_address,
          previous_school: fields?.previous_school,

          school: {
            connect: { id: parseInt(fields.school_id) }
          },
          user: {
            create: {
              username: fields.username,
              password: hashPassword,
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
          student_photo: student_photo_path,
          guardian_name: fields?.guardian_name,
          guardian_phone: fields?.guardian_phone,
          guardian_profession: fields?.guardian_profession,
          guardian_photo: guardian_photo_path,
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
    // const sms_res = await axios.post(`https://880sms.com/smsapi?api_key=${process.env.API_KEY}&type=text&contacts=${fields?.phone}&senderid=${process.env.SENDER_ID}&msg=${encodeURIComponent(`Dear ${fields.first_name}, Your username: ${fields.username} and password: ${fields.password}`)}`)
    // // const sms_res = await axios.post(`https://880sms.com/smsapi?api_key=${process.env.API_KEY}&type=text&contacts=${fields?.phone}&senderid=${process.env.SENDER_ID}&msg=${encodeURIComponent(fields?.phone)}`)

    // if (sms_res.data == 1015) {
    //   res.status(200).json({ success: 'student created successfully but sms sending failed' });
    // }
    // else if (sms_res.data.startsWith('SMS SUBMITTED')) {
    //   res.status(200).json({ success: 'student created successfully' });
    // }
    // else {
    //   res.status(200).json({ success: 'student created successfully but sms sending failed' });
    // }
    res.status(200).json({ success: 'student created successfully but sms sending failed' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

export default authenticate(postHandle);
