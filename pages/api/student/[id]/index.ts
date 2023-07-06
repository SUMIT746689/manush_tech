import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';

export const config = {
    api: {
      bodyParser: false
    }
  };

const prisma = new PrismaClient()

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

    //  console.log("entered!!!!!!",req.body);
    
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        
        // console.log("ddddddddddddd___",err,fields, files);
        
        if (err) reject(err);
        if (
          !fields.first_name ||
          !fields.section_id ||
          !fields.academic_year_id ||
          !fields.username ||
          !fields.admission_date ||
          !fields.date_of_birth ||
          !fields.roll_no ||
          !fields.registration_no ||
          !fields.phone ||
          !fields.school_id
        ) {
          reject({ message: 'field value missing !!' });
        }
        resolve({ fields, files });
      });
    });
  };
const id = async (req, res) => {
    try {
        const { method } = req;
        const student_id = parseInt(req.query.id)
        if (!student_id) {
            return res.status(400).json({ message: 'valid id required' })

        }
        switch (method) {
            case 'GET':
                const user = await prisma.student.findUnique({
                    where: {
                        id: student_id
                    },
                    include: {
                        section: {
                            include: {
                                class_teacher: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                username: true,
                                            }

                                        }
                                    }
                                },
                                class: true,
                            }
                        }
                    }
                })
                res.status(200).json(user);
                break;

            case 'PATCH':
                try {

                    try {
                        await fs.readdir(path.join(process.cwd() + '/public', '/files'));
                    } catch (error) {
                        await fs.mkdir(path.join(process.cwd() + '/public', '/files'));
                    }
                    const { fields, files }: any = await saveImage(req, true);
                    // console.log("student_id__", student_id);
                    if (
                        !fields.first_name ||
                        !fields.section_id ||
                        !fields.admission_date ||
                        !fields.date_of_birth ||
                        !fields.roll_no ||
                        !fields.registration_no ||
                        !fields.school_id ||
                        !fields.academic_year_id ||
                        !fields.phone
                    ) {
                        throw new Error('field value missing !!')
                    }
                    if (fields.phone.length !== 11) {
                        throw new Error('phone number must be 11 character !!');
                    }

                    const student_photo_path = files.student_photo?.newFilename;
                    const father_photo_Path = files.father_photo?.newFilename;
                    const mother_photo_path = files.mother_photo?.newFilename;
                    const guardian_photo_path = files.guardian_photo?.newFilename;

                    const hashPassword = fields?.password && fields?.password != '' ? await bcrypt.hash(
                        fields?.password,
                        Number(process.env.SALTROUNDS)
                    ) : null;

                    await prisma.$transaction(async (transaction) => {


                        const userUpdateQuery = {
                            username: fields.username,
                        }
                        if (hashPassword) {
                            userUpdateQuery['password'] = hashPassword
                        }

                        const student = await transaction.student.update({
                            where: {
                                id: student_id
                            },
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
                                    // connect: { id: studentInformation.id }
                                    update: {
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

                                        user: {
                                            update: userUpdateQuery
                                        }
                                    }
                                }
                            }
                        });

                    })

                    res.status(200).json({ success: 'student updated successfully but sms sending failed' });
                } catch (error) {
                    console.log(error);
                    res.status(404).json({ error: error.message });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
}

export default id