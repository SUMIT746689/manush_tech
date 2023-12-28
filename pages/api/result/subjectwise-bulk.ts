import prisma from '@/lib/prisma_client';
import { formidable } from 'formidable';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { readFile, utils } from "xlsx";

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

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {

            case 'POST':
                /*
                input
                ------
                exam_id
                exam_details_id
                subject_id
                academic_year_id
                */

                const { fields, files }: any = await gettingFile(req);

                const exam_id = parseInt(fields.exam_id);
                const exam_details_id = parseInt(fields.exam_details_id)
                const academic_year_id = parseInt(fields.academic_year_id)


                const f = Object.entries(files)[0][1];
                //@ts-ignore
                const workbook = await readFile(f.filepath);

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const prevInserted = []
                const range = utils.decode_range(worksheet['!ref']);

                // console.log("total row__", range.e.r);

                // const requestedStudentAdmissionCount = range.e.r;

                const sectionStudentResult = await prisma.studentResult.findMany({
                    where: {
                        exam_id,
                    }
                })

                const allGrad = await prisma.gradingSystem.findMany({
                    where: {
                        school_id: refresh_token.school_id,
                        academic_year_id: academic_year_id,
                    },
                    orderBy: {
                        point: 'desc'
                    }
                })

                const exam_details = await prisma.examDetails.findFirst({
                    where: {
                        id: exam_details_id,
                        exam_id,
                    }
                })


                for (let row = range.s.r; row <= range.e.r; row++) {

                    let student: any = {};

                    if (row !== 0) {

                        for (let col = range.s.c; col <= range.e.c; col++) {

                            const columnLetter = utils.encode_col(col);

                            const key = worksheet[`${columnLetter}1`].v
                            const value = worksheet[`${columnLetter}${row + 1}`]?.v ? worksheet[`${columnLetter}${row + 1}`].v : null

                            if (key == 'class_registration_no' && !value || key == 'mark_obtained' && !value) {
                                return res.status(404).json({ message: `${row + 1} number row ${key} value missing !!` });
                            }

                            student[key] = (key == 'class_registration_no') ? value.toString() : value


                        }

                        const mark_obtained = Number(((parseFloat(student.mark_obtained) / exam_details.subject_total) * 100).toFixed(2));


                        console.log("uniqueStudentResult____", sectionStudentResult);

                        const targetGrad = allGrad.find(i => i.lower_mark <= mark_obtained && i.upper_mark >= mark_obtained)

                        if (!targetGrad) {
                            throw new Error('Grade not found !')
                        }

                        const singleStudent = await prisma.student.findFirst({
                            where: {
                                class_registration_no: student?.class_registration_no
                            },
                            select: {
                                id: true
                            }
                        })

                        const resultHistory = sectionStudentResult.find(ic => ic.student_id == singleStudent.id)

                        if (resultHistory) {

                            const isExist = await prisma.studentResultDetails.findFirst({
                                where: {
                                    exam_details_id,
                                    student_result_id: resultHistory.id
                                }
                            })
                            if (isExist) {
                                prevInserted.push({ class_registration_no: student?.class_registration_no })
                            }
                            else {
                                const allObtainedNumber = await prisma.studentResultDetails.findMany({
                                    where: {

                                        student_result_id: resultHistory.id
                                    },
                                    select: {
                                        mark_obtained: true,
                                        grade: {
                                            select: {
                                                point: true
                                            }
                                        },
                                    }
                                })

                                await prisma.studentResultDetails.create({
                                    data: {
                                        student_result_id: resultHistory.id,
                                        exam_details_id,
                                        mark_obtained,
                                        grade_id: targetGrad.id
                                    }
                                })

                                let totalObtainedNumber = 0, totalObtainPoint = 0, size = allObtainedNumber.length;

                                for (let i = 0; i < size; i++) {
                                    console.log(allObtainedNumber[i]);

                                    totalObtainedNumber += allObtainedNumber[i].mark_obtained;
                                    totalObtainPoint += allObtainedNumber[i].grade.point;
                                    if (i == size - 1) {
                                        totalObtainPoint = (totalObtainPoint + targetGrad.point) / (i + 2)
                                    }
                                }
                                const averageGrad = allGrad.find(i => totalObtainPoint >= i.point)
                                // console.log("totalObtainedNumber__", totalObtainedNumber);

                                await prisma.studentResult.update({
                                    where: {
                                        id: resultHistory.id
                                    },
                                    data: {
                                        total_marks_obtained: totalObtainedNumber + mark_obtained,
                                        calculated_point: totalObtainPoint,
                                        calculated_grade: averageGrad.grade

                                    }
                                })
                            }

                        }
                        else {

                            await prisma.studentResultDetails.create({
                                data: {
                                    exam_details: {
                                        connect: {
                                            id: exam_details_id
                                        }
                                    },
                                    mark_obtained: student.mark_obtained,
                                    grade: {
                                        connect: {
                                            id: targetGrad.id
                                        }
                                    },
                                    result: {
                                        create: {
                                            student_id: singleStudent.id,
                                            exam_id,
                                            total_marks_obtained: mark_obtained,
                                            calculated_point: targetGrad.point,
                                            calculated_grade: targetGrad.grade
                                        }
                                    },

                                }
                            })
                        }

                    }
                }

                res.status(200).json({ success: true, message: `${prevInserted.length ? 'Some result result inserted !' : 'Student result details inserted!'}`, prevInserted })
                break;

            default:
                res.setHeader('Allow', ['POST'])
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);
