import { formidable } from 'formidable';
import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { readFile, utils } from "xlsx";

export const config = {
    api: {
        bodyParser: false
    }
};
const prisma = new PrismaClient();

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
                student_id
                exam_id
                exam_details_id
                mark_obtained
                academic_year_id
                */

                // const { fields, files }: any = await gettingFile(req);

                // const exam_id = parseInt(fields.exam_id);
                // const exam_details_id = parseInt(fields.exam_details_id)
                // const academic_year_id = parseInt(fields.academic_year_id)
                // const section_id = parseInt(fields.section_id)


                // const f = Object.entries(files)[0][1];
                // //@ts-ignore
                // const workbook = await readFile(f.filepath);
        
                // const sheetName = workbook.SheetNames[0];
                // const worksheet = workbook.Sheets[sheetName];
        
                // let allStudents = []
                // const range = utils.decode_range(worksheet['!ref']);
        
                // // console.log("total row__", range.e.r);
        
                // const requestedStudentAdmissionCount = range.e.r;
        
                // const schoolPackage = await prisma.subscription.findFirst({
                //     where: {
                //         school_id: parseInt(refresh_token?.school_id),
                //         is_active: true
                //     },
                //     select: {
                //         package: {
                //             select: {
                //                 student_count: true
                //             }
                //         }
                //     }
                // })
                // const admittedStudentCount = await prisma.studentInformation.count({
                //     where: {
                //         school_id: parseInt(refresh_token?.school_id)
                //     }
                // })
        
                // if (requestedStudentAdmissionCount + admittedStudentCount > schoolPackage?.package?.student_count) {
                //     return res.status(406).json({ message: 'Your package maximum students capacity has already been filled, please update your package !' });
                // }

                // const uniqueStudentResult = await prisma.studentResult.findFirst({
                //     where: {
                //         exam_id,
            
                //     }
                // })
                // const allGrad = await prisma.gradingSystem.findMany({
                //     where: {
                //         school_id: refresh_token.school_id,
                //         academic_year_id: academic_year_id,
                //     },
                //     orderBy: {
                //         point: 'desc'
                //     }
                // })
                // const mark_obtained = Number(((parseFloat(req.body.mark_obtained) / subject_total) * 100).toFixed(2));


                // console.log("uniqueStudentResult____", uniqueStudentResult);

                // const targetGrad = allGrad.find(i => i.lower_mark <= mark_obtained && i.upper_mark >= mark_obtained)

                // if (!targetGrad) {
                //     throw new Error('Grade not found !')
                // }

                // if (uniqueStudentResult) {

                //     const isExist = await prisma.studentResultDetails.findFirst({
                //         where: {
                //             exam_details_id,
                //             student_result_id: uniqueStudentResult.id
                //         }
                //     })
                //     if (isExist) {
                //         throw new Error('Result already inserted !!')
                //     }
                //     const allObtainedNumber = await prisma.studentResultDetails.findMany({
                //         where: {

                //             student_result_id: uniqueStudentResult.id
                //         },
                //         select: {
                //             mark_obtained: true,
                //             grade: {
                //                 select: {
                //                     point: true
                //                 }
                //             },
                //         }
                //     })

                //     await prisma.studentResultDetails.create({
                //         data: {
                //             student_result_id: uniqueStudentResult.id,
                //             exam_details_id,
                //             mark_obtained,
                //             grade_id: targetGrad.id
                //         }
                //     })

                //     let totalObtainedNumber = 0, totalObtainPoint = 0, size = allObtainedNumber.length;
                //     for (let i = 0; i < size; i++) {
                //         console.log(allObtainedNumber[i]);

                //         totalObtainedNumber += allObtainedNumber[i].mark_obtained;
                //         totalObtainPoint += allObtainedNumber[i].grade.point;
                //         if (i == size - 1) {
                //             totalObtainPoint = (totalObtainPoint + targetGrad.point) / (i + 2)
                //         }
                //     }
                //     const averageGrad = allGrad.find(i => totalObtainPoint >= i.point)
                //     // console.log("totalObtainedNumber__", totalObtainedNumber);

                //     await prisma.studentResult.update({
                //         where: {
                //             id: uniqueStudentResult.id
                //         },
                //         data: {
                //             total_marks_obtained: totalObtainedNumber + mark_obtained,
                //             calculated_point: totalObtainPoint,
                //             calculated_grade: averageGrad.grade

                //         }
                //     })

                // }
                // else {

                //     await prisma.studentResultDetails.create({
                //         data: {
                //             exam_details: {
                //                 connect: {
                //                     id: parseInt(req.body.exam_details_id)
                //                 }
                //             },
                //             mark_obtained: parseFloat(req.body.mark_obtained),
                //             grade: {
                //                 connect: {
                //                     id: targetGrad.id
                //                 }
                //             },
                //             result: {
                //                 create: {
                //                     student_id,
                //                     exam_id,
                //                     total_marks_obtained: mark_obtained,
                //                     calculated_point: targetGrad.point,
                //                     calculated_grade: targetGrad.grade
                //                 }
                //             },

                //         }
                //     })
                // }

                res.status(200).json({ success: true, message: "Student result details inserted!" })
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);
