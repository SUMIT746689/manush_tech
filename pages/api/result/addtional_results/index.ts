import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            // case 'GET':

            // const class_id = parseInt(req.body.class_id);
            // const section_id = parseInt(req.body.section_id);
            // const exam_id_ = parseInt(req.body.exam_id);

            // const res = await prisma.exam.findMany({
            //     where: {exam}
            // })
            // res.status(200)

            //     const sections_result = await prisma.studentResult.findMany({
            //         where: {
            //             exam_id: parseInt(req.query.exam_id),
            //             exam: {
            //                 section_id: parseInt(req.query.section_id)
            //             }
            //         },
            //         orderBy: {
            //             total_marks_obtained: 'desc'
            //         },
            //         include: {
            //             student: {
            //                 select: {
            //                     class_roll_no: true,
            //                     id: true,
            //                     student_photo: true,
            //                     class_registration_no: true,
            //                     section: {
            //                         select: {
            //                             name: true,
            //                             class: {
            //                                 select: {
            //                                     id: true,
            //                                     name: true
            //                                 }
            //                             }
            //                         }
            //                     },
            //                     student_info: {
            //                         select: {
            //                             id: true,
            //                             first_name: true,
            //                             middle_name: true,
            //                             last_name: true,
            //                             father_name: true,
            //                             mother_name: true,
            //                             date_of_birth: true,
            //                             admission_date: true,
            //                             gender: true,
            //                         }
            //                     },
            //                     group: {
            //                         select: {
            //                             id: true,
            //                             title: true
            //                         }
            //                     }
            //                 }
            //             },

            //             result_details: {
            //                 select: {
            //                     mark_obtained: true,
            //                     grade: {
            //                         select: {
            //                             point: true,
            //                             grade: true
            //                         }
            //                     },
            //                     exam_details: {
            //                         select: {
            //                             subject: {
            //                                 select: {
            //                                     id: true,
            //                                     name: true
            //                                 }
            //                             },
            //                             subject_total: true
            //                         }
            //                     }
            //                 }
            //             },

            //         }

            //     })
            //     const subject_list = await prisma.exam.findUnique({
            //         where: {
            //             id: parseInt(req.query.exam_id)
            //         },
            //         select: {
            //             exam_details: {
            //                 select: {
            //                     id: true,
            //                     subject: true,
            //                     subject_total: true
            //                 }
            //             }
            //         }
            //     })

            //     const highestMark = await prisma.studentResultDetails.groupBy({
            //         by: ['exam_details_id'],
            //         where: {
            //             result: {
            //                 exam_id: parseInt(req.query.exam_id)
            //             }
            //         },
            //         _max: {
            //             mark_obtained: true,
            //         },

            //     })

            //     res.status(200).json({ sections_result, subject_list, highestMark });

            // break;

            case 'POST':
        
                const exam_id = parseInt(req.body.exam_id);
                const student_id = parseInt(req.body.student_id)
                const subject_total = parseFloat(req.body.subject_total)
                const exam_details_id = parseInt(req.body.exam_details_id)
                const academic_year_id = parseInt(req.body.academic_year_id)

                const uniqueStudentResult = await prisma.studentResult.findFirst({
                    where: {
                        student_id,
                        exam_id
                    }
                });

                if (!uniqueStudentResult) {
                    await prisma.studentAddtionalResultDetails.create({
                        data: {
                            exaxmAddtionalMark: {
                                connect: {
                                    id: parseInt(req.body.exam_details_id)
                                }
                            },
                            mark_obtained: parseFloat(req.body.mark_obtained),
                            studentResult: {
                                create: {
                                    student_id,
                                    exam_id,
                                    total_marks_obtained: parseInt(req.body.mark_obtained),
                                    calculated_point: 0,
                                    calculated_grade: ""
                                }
                            },

                        }
                    });

                    return res.status(200).json({ success: true, message: "Student result details inserted!" })
                }



                const isExist = await prisma.studentAddtionalResultDetails.findFirst({
                    where: {
                        exam_addtional_mark_id: exam_details_id,
                        student_result_id: uniqueStudentResult.id
                    }
                })
                // if (isExist) {
                //     throw new Error('Result already inserted !!')
                // }

                const allObtainedNumber = await prisma.studentResult.findFirst({
                    where: {
                        id: uniqueStudentResult.id
                    },
                    select: {
                        total_marks_obtained: true,
                        result_details: true
                        // exam_details: {
                        //     select: {
                        //         subject_total: true
                        //     }
                        // }
                    }
                });
                const allGrades = await prisma.gradingSystem.findMany({
                    where: {
                        school_id: refresh_token.school_id,
                        academic_year_id: academic_year_id,
                    },
                    orderBy: {
                        point: 'desc'
                    }
                })

                const totalObtainMark = allObtainedNumber.total_marks_obtained + parseInt(req.body.mark_obtained);

                const avgMark = totalObtainMark / (allObtainedNumber.result_details.length || 1);
                const targetGrade = allGrades.find(i => i.lower_mark <= avgMark && i.upper_mark >= avgMark)

                if (isExist) throw new Error('Result already inserted !!');

                await prisma.studentAddtionalResultDetails.create({
                    data: {
                        student_result_id: uniqueStudentResult.id,
                        exam_addtional_mark_id: exam_details_id,
                        mark_obtained: parseInt(req.body.mark_obtained),
                        // grade_id: targetGrad.id,
                    }
                })

                await prisma.studentResult.update({
                    where: {
                        id: uniqueStudentResult.id
                    },
                    data: {
                        total_marks_obtained: totalObtainMark,
                        calculated_point: targetGrade.point,
                        calculated_grade: targetGrade.grade
                    }
                })

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
