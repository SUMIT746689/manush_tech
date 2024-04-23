import { formidable } from 'formidable';
import bcrypt from 'bcrypt';
import { readFile, utils } from "xlsx";
import dayjs from 'dayjs';
import { authenticate } from 'middleware/authenticate';
import { generateUsername, registration_no_generate, unique_password_generate } from '@/utils/utilitY-functions';
import axios from 'axios';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

export const config = {
    api: {
        bodyParser: false
    }
};

const gettingFile = (req) => {
    const options: formidable.Options = {};
    // options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            // console.log(files);

            resolve({ fields, files });
        });
    });
};



const handlePost = async (req, res, refresh_token) => {

    try {
        const student_role = await prisma.role.findFirst({
            where: {
                title: 'STUDENT'
            }
        })
        const { fields, files }: any = await gettingFile(req);
        // console.log(files);

        const f = Object.entries(files)[0][1];
        //@ts-ignore
        const workbook = await readFile(f.filepath);

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let allStudents = []
        const range = utils.decode_range(worksheet['!ref']);

        // console.log("total row__", range.e.r);

        const requestedStudentAdmissionCount = range.e.r;

        const schoolPackage = await prisma.subscription.findFirst({
            where: {
                school_id: parseInt(refresh_token?.school_id),
                is_active: true
            },
            select: {
                package: {
                    select: {
                        student_count: true
                    }
                }
            }
        })
        const admittedStudentCount = await prisma.studentInformation.count({
            where: {
                school_id: parseInt(refresh_token?.school_id)
            }
        })

        if (requestedStudentAdmissionCount + admittedStudentCount > schoolPackage?.package?.student_count) {
            return res.status(406).json({ message: 'Your package maximum students capacity has already been filled, please update your package !' });
        }


        for (let row = range.s.r; row <= range.e.r; row++) {

            let student: any = {};

            if (row !== 0) {

                for (let col = range.s.c; col <= range.e.c; col++) {

                    const columnLetter = utils.encode_col(col);

                    const key = worksheet[`${columnLetter}1`].v
                    const value = worksheet[`${columnLetter}${row + 1}`]?.v ?
                        (key == 'section_id' || key == 'academic_year_id' || key == 'class_id') ?
                            Number(worksheet[`${columnLetter}${row + 1}`].v) :
                            worksheet[`${columnLetter}${row + 1}`].v : null
                    if (
                        key == 'first_name' && !value ||
                        // key == 'section_id' && !value ||
                        // key == 'academic_year_id' && !value ||
                        // key == 'password' && !value ||
                        key == 'admission_date' && !value ||
                        key == 'date_of_birth' && !value ||
                        key == 'roll_no' && !value

                    ) {
                        return res.status(404).json({ message: `${row + 1} number row ${key} value missing !!` });
                    } else {
                        let calculatedValue = value;

                        if (key == 'registration_no' && !value) {
                            calculatedValue = registration_no_generate()
                        }
                        else if (key == 'first_name') {
                            const userName = generateUsername(value);
                            student['username'] = userName
                            student['password'] = await bcrypt.hash(
                                userName,
                                Number(process.env.SALTROUNDS)
                            )
                        }
                        else if (key == 'admission_date' || key == 'date_of_birth') {
                            console.log("value__", value);

                            if (dayjs(value).isValid()) {
                                calculatedValue = new Date(value)
                                console.log("calculatedValue___", calculatedValue);
                            } else {
                                return res.status(404).json({ message: `${row + 1} number row ${key} Date invalid !!` });
                            }
                        }

                        student[key] = calculatedValue

                    }
                }
                let query = {};

                if (student?.class_id) {
                    query = {
                        ...query,
                        id: student?.class_id
                    }
                }
                if (student?.class_name) {
                    query = {
                        ...query,
                        name: {
                            equals: student?.class_name,
                            // mode: 'insensitive'
                        }
                    }
                }
                if (!Object.keys(query).length) {
                    return res.status(400).json({ message: `${row + 1} th row, class id or class name missing !` })
                }
                const classValidity = await prisma.class.findFirst({
                    where: {
                        ...query,
                        school_id: parseInt(refresh_token?.school_id)
                    }
                })
                if (!classValidity) {
                    return res.status(400).json({ message: `${row + 1} th row, class is not exist !` })
                }
                else {
                    student.class_id = classValidity.id
                }
                //@ts-ignore
                query = {};

                if (student?.section_id) {
                    query = {
                        ...query,
                        id: student?.section_id
                    }
                }
                if (student?.section_name) {
                    query = {
                        ...query,
                        name: {
                            equals: student?.section_name,
                            // mode: 'insensitive'
                        }
                    }
                }
                if (!Object.keys(query).length) {
                    return res.status(400).json({ message: `${row + 1} th row, section id or section name missing !` })
                }
                const sectionValidity = await prisma.section.findFirst({
                    where: {
                        ...query,
                        class: {
                            school_id: parseInt(refresh_token?.school_id)
                        }
                    }
                })
                if (!sectionValidity) {
                    return res.status(400).json({ message: `${row + 1} th row, section is not exist !` })
                }
                else {
                    student.section_id = sectionValidity.id
                }

                query = {};

                if (student?.academic_year_id) {
                    query = {
                        ...query,
                        id: student?.academic_year_id
                    }
                }
                if (student?.academic_year_name) {
                    query = {
                        ...query,
                        title: {
                            equals: student?.academic_year_title,
                            // mode: 'insensitive'
                        }
                    }
                }
                if (!Object.keys(query).length) {
                    return res.status(400).json({ message: `${row + 1} th row, academic year id or academic year title missing !` })
                }
                const academicYearValidity = await prisma.academicYear.findFirst({
                    where: {
                        ...query,
                        school_id: parseInt(refresh_token?.school_id),
                        deleted_at: null
                    }
                })
                if (!academicYearValidity) {
                    return res.status(400).json({ message: `${row + 1} th row, academic year does not exist !` })
                }
                else {
                    student.academic_year_id = academicYearValidity.id
                }
                console.log("student__", student);

                allStudents.push(student)
            }
        }

        const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
            where: {
                school_id: refresh_token?.school_id,
                is_active: true
            }
        })

        let faildedSmS = [], successSmS = []
        for (const i of allStudents) {
            await prisma.$transaction(async (transaction) => {

                const studentInformation = await transaction.studentInformation.create({
                    // @ts-ignore
                    data: {
                        first_name: i?.first_name,
                        middle_name: i?.middle_name,
                        last_name: i?.last_name,
                        admission_no: i?.admission_no?.toString(),
                        admission_date: i?.admission_date,
                        admission_status: i?.admission_status?.toLowerCase(),
                        date_of_birth: i?.date_of_birth,
                        gender: i?.gender?.toLowerCase(),
                        blood_group: i?.blood_group,
                        religion: i?.religion,
                        phone: i?.phone?.toString(),
                        email: i?.email,
                        national_id: i?.national_id?.toString(),
                        father_name: i?.father_name,
                        father_phone: i?.father_phone?.toString(),
                        father_profession: i?.father_profession,
                        father_photo: '',
                        mother_name: i?.mother_name,
                        mother_phone: i?.mother_phone?.toString(),
                        mother_profession: i?.mother_profession,
                        mother_photo: '',

                        student_permanent_address: i?.student_permanent_address,
                        previous_school: i?.previous_school,

                        school: {
                            connect: { id: parseInt(refresh_token?.school_id) }
                        },
                        user: {
                            create: {
                                username: i?.username,
                                password: i?.password,
                                user_role_id: student_role.id,
                                role_id: student_role.id,
                                school_id: parseInt(refresh_token?.school_id)
                            }
                        }
                    }

                });
                // console.log(i);

                // console.log("studentInformation__", studentInformation);
                // console.log(typeof (i?.academic_year_id), " ", i?.academic_year_id);
                // console.log(typeof (i?.discount), " ", i?.discount);


                const student = await transaction.student.create({
                    //@ts-ignore
                    data: {
                        class_roll_no: i?.roll_no?.toString(),

                        class_registration_no: i?.registration_no?.toString(),
                        student_photo: '',
                        guardian_name: i?.guardian_name,
                        guardian_phone: i?.guardian_phone?.toString(),
                        guardian_profession: i?.guardian_profession,
                        guardian_photo: '',
                        relation_with_guardian: i?.relation_with_guardian,
                        student_present_address: i?.student_present_address,
                        section: {
                            connect: { id: i?.section_id }
                        },
                        academic_year: {
                            connect: { id: i?.academic_year_id }
                        },
                        student_info: {
                            connect: { id: studentInformation.id }

                        }
                    }
                });

                const fees = await transaction.fee.findMany({
                    where: {
                        class_id: i.class_id,
                        academic_year_id: i?.academic_year_id
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
                        payment_method: 'pending'
                    });
                }
                await transaction.studentFee.createMany({
                    data: StudentFeeContainer
                });

                try {
                    const sms_res = await axios.post(`https://${sms_res_gatewayinfo?.details?.sms_gateway}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${i?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${i.first_name}, Your username: ${i.username} and password: ${i.mainPassword}`)}`)
                    if (sms_res.data == 1015) {
                        faildedSmS.push(student.id)
                    }
                    else if (sms_res.data.startsWith('SMS SUBMITTED')) {
                        successSmS.push(student.id)
                    }
                    else {
                        successSmS.push(student.id)
                    }
                } catch (err) {
                    faildedSmS.push(student.id)
                }
            })

        }

        return res.status(200).json({ message: 'All students data inserted', faildedSmS, successSmS });
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
      }
};

export default authenticate(handlePost);