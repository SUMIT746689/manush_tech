
import bcrypt from 'bcrypt';
import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';
import formidable from 'formidable';
import prisma from '@/lib/prisma_client';
import { fileDelete, fileUpload } from '@/utils/upload';

export const config = {
    api: {
        bodyParser: false
    }
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
                    const uploadFolderName = "files";
                    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
                    const filterFiles = {
                        logo: fileType,
                        signature: fileType,
                        background_image: fileType,
                    }

                    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

                    console.log(files, fields);


                    const student_photo_name = files?.student_photo?.newFilename;
                    const father_photo_name = files?.father_photo?.newFilename;
                    const mother_photo_name = files?.mother_photo?.newFilename;
                    const guardian_photo_name = files?.guardian_photo?.newFilename;
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
                        for (const i in files) {
                            fs.unlinkSync(files[i].filepath)
                        }
                        throw new Error('Required field value missing !!')
                    }


                  


                    const hashPassword = fields?.password && fields?.password != '' ? await bcrypt.hash(
                        fields?.password,
                        Number(process.env.SALTROUNDS)
                    ) : null;

                    await prisma.$transaction(async (transaction) => {


                        const userUpdateQuery = {
                            username: fields.username
                        }
                        if (hashPassword) {
                            userUpdateQuery['password'] = hashPassword
                        }
                        if (student_photo_name) {
                            userUpdateQuery['user_photo'] = student_photo_name
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
                                        father_photo: father_photo_name,
                                        // @ts-ignore
                                        mother_name: fields?.mother_name,
                                        mother_phone: fields?.mother_phone,
                                        mother_profession: fields?.mother_profession,
                                        mother_photo: mother_photo_name,

                                        student_permanent_address: fields?.student_permanent_address,
                                        previous_school: fields?.previous_school,

                                        user: {
                                            update: userUpdateQuery
                                        }
                                    }
                                }
                            }
                        });
                        const studentPast = await transaction.student.findFirst({
                            where: {
                                id: student_id
                            },
                            select: {
                                student_photo: true,
                                guardian_photo: true,
                                student_info: {
                                    select: {
                                        father_photo: true,
                                        mother_photo: true,
                                    }
                                }
                            }
                        })
    
                        if (student_photo_name) {
                            fileDelete([`${process.env.FILESFOLDER}`, "files", studentPast?.student_photo])
                        }
                        if (father_photo_name) {
                            fileDelete([`${process.env.FILESFOLDER}`, "files", studentPast?.student_info?.father_photo])
                        }
                        if (mother_photo_name) {
                            fileDelete([`${process.env.FILESFOLDER}`, "files", studentPast?.student_info?.mother_photo])
                        }
                        if (guardian_photo_name) {
                            fileDelete([`${process.env.FILESFOLDER}`, "files", studentPast?.guardian_photo])
                        }

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