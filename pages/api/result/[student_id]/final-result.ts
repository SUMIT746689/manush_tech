import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

const id = async (req, res) => {
    try {
        const { method } = req;

        const student_id = parseInt(req.query.student_id)
        const exam_id = parseInt(req.query.exam_id)

        if (!student_id && !exam_id) {
            return res.status(400).json({ message: 'valid id required' });
        }
        switch (method) {
            case 'GET':
                /*
                req.query
                ------------
                "student_id": 1
                "section_id":1
                
                */
                // const { examList } = req.body
                const { student_id, section_id } = req.query
                if (!section_id || !student_id) {
                    throw new Error('section_id or student_id missing !');
                }
                let termWiseTotalMark = [];
                const examList = await prisma.exam.findMany({
                    where: {
                        section_id: parseInt(section_id),
                        final_percent: {
                            not: null
                        }
                    },

                })
                // console.log(examList);

                for (const exam of examList) {

                    const data = await prisma.exam.findUnique({
                        where: {
                            id: exam.id
                        },
                        include: {
                            exam_details: {
                                select: {
                                    subject: {
                                        select: {
                                            id: true,
                                            name: true,
                                            
                                        }
                                    },
                                    subject_total:true
                                }
                            },
                            student_results: {
                                where: {
                                    exam_id: exam.id,
                                    student_id: parseInt(student_id)
                                },
                                select: {
                                    result_details: {
                                        include: {
                                            exam_details: {
                                                select: {
                                                    subject: true,
                                                    subject_total: true
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    })
                    //  return res.status(200).json(data);

                    let allSubjectCalculatedMark = []
                    let totalMark = 0
                    for (const studetGivenExam of data.exam_details) {
                         console.log(studetGivenExam);
                        
                        const flag = data.student_results[0].result_details.find(i => i.exam_details.subject.id == studetGivenExam.subject.id);
                        let singleSubjectCalculetedMark;
                        if (flag) {
                            // @ts-ignore
                            singleSubjectCalculetedMark = (flag.mark_obtained * parseFloat(exam?.final_percent)) / 100;
                        } else {
                            singleSubjectCalculetedMark = 0
                        }
                        allSubjectCalculatedMark.push({
                            subject_id: studetGivenExam.subject.id,
                            subject_name: studetGivenExam.subject.name,
                             subject_total:studetGivenExam.subject_total,
                            singleSubjectCalculetedMark: singleSubjectCalculetedMark
                        })
                        totalMark += singleSubjectCalculetedMark;
                    }
                    termWiseTotalMark.push({
                        exam_id: exam?.id, title: exam?.title, calculatedTotalMark: totalMark, result: allSubjectCalculatedMark
                    })
                }
                const student = await prisma.student.findUnique({
                    where: {
                        id: parseInt(student_id)
                    },
                    select: {
                        class_roll_no: true,
                        class_registration_no: true,
                        student_info: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                                father_name: true,
                                mother_name: true

                            }
                        },
                        academic_year: {
                            select: {
                                title: true,
                                school: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        section: {
                            select: {
                                name: true,
                                class: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })

                res.status(200).json({ student: student, termWiseTotalMark: termWiseTotalMark });
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

export default authenticate(id) ;
