import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const sections_result = await prisma.studentResult.findMany({
                    where: {
                        exam_id: parseInt(req.query.exam_id),
                        exam: {
                            section_id: parseInt(req.query.section_id)
                        }
                    },
                    orderBy: {
                        total_marks_obtained: 'desc'
                    },
                    include: {
                        student: {
                            select: {
                                class_roll_no: true,
                                id: true,
                                student_photo: true,
                                class_registration_no: true,
                                section: {
                                    select: {
                                        name: true,
                                        class: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                },
                                student_info: {
                                    select: {
                                        id: true,
                                        first_name: true,
                                        middle_name: true,
                                        last_name: true,
                                        father_name: true,
                                        mother_name: true,
                                        date_of_birth: true,
                                        admission_date: true,
                                        gender: true,
                                    }
                                },
                                group: {
                                    select: {
                                        id: true,
                                        title: true
                                    }
                                }
                            }
                        },

                        result_details: {
                            select: {
                                mark_obtained: true,
                                grade: {
                                    select: {
                                        point: true,
                                        grade: true
                                    }
                                },
                                exam_details: {
                                    select: {
                                        subject: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        },
                                        subject_total: true
                                    }
                                }
                            }
                        },

                    }

                })
                const subject_list = await prisma.exam.findUnique({
                    where: {
                        id: parseInt(req.query.exam_id)
                    },
                    select: {
                        exam_details: {
                            select: {
                                id: true,
                                subject: true,
                                subject_total: true
                            }
                        }
                    }
                })

                const highestMark = await prisma.studentResultDetails.groupBy({
                    by: ['exam_details_id'],
                    where: {
                        result: {
                            exam_id: parseInt(req.query.exam_id)
                        }
                    },
                    _max: {
                        mark_obtained: true,
                    },

                })

                res.status(200).json({ sections_result, subject_list, highestMark });
                break;

            case 'POST':
                /*
                input
                ------
                student_id
                exam_id
                exam_details_id
                mark_obtained
                subject_total
                academic_year_id
                */
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
                const mark_obtained = Number(((parseFloat(req.body.mark_obtained) / subject_total) * 100).toFixed(2));


                console.log("uniqueStudentResult____", uniqueStudentResult);

                const targetGrad = allGrad.find(i => i.lower_mark <= mark_obtained && i.upper_mark >= mark_obtained)

                if (!targetGrad) {
                    throw new Error('Grade not found !')
                }

                if (uniqueStudentResult) {

                    const isExist = await prisma.studentResultDetails.findFirst({
                        where: {
                            exam_details_id,
                            student_result_id: uniqueStudentResult.id
                        }
                    })
                    if (isExist) {
                        throw new Error('Result already inserted !!')
                    }
                    const allObtainedNumber = await prisma.studentResultDetails.findMany({
                        where: {

                            student_result_id: uniqueStudentResult.id
                        },
                        select: {
                            mark_obtained: true,
                            grade: {
                                select: {
                                    point: true
                                }
                            },
                            // exam_details: {
                            //     select: {
                            //         subject_total: true
                            //     }
                            // }
                        }
                    })

                    await prisma.studentResultDetails.create({
                        data: {
                            student_result_id: uniqueStudentResult.id,
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
                            id: uniqueStudentResult.id
                        },
                        data: {
                            total_marks_obtained: totalObtainedNumber + mark_obtained,
                            calculated_point: totalObtainPoint,
                            calculated_grade: averageGrad.grade

                        }
                    })

                }
                else {
                    // const averageGrad = allGrad.find(i => i.lower_mark <= mark_obtained && i.upper_mark >= mark_obtained)
                    console.log("targetGrad__", targetGrad);

                    await prisma.studentResultDetails.create({
                        data: {
                            exam_details: {
                                connect: {
                                    id: parseInt(req.body.exam_details_id)
                                }
                            },
                            mark_obtained: parseFloat(req.body.mark_obtained),
                            grade: {
                                connect: {
                                    id: targetGrad.id
                                }
                            },
                            result: {
                                create: {
                                    student_id,
                                    exam_id,
                                    total_marks_obtained: mark_obtained,
                                    calculated_point: targetGrad.point,
                                    calculated_grade: targetGrad.grade
                                }
                            },

                        }
                    })
                }

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
