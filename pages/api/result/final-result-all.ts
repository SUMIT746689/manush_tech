import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

const FinalResultAll = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                /*
                req.query
                ------------
                "student_id": 1,

                req.body
                -----------
                student_id_list:[]
                
                */
                // const { examList } = req.body
                const { section_id, academic_year_id } = req.query
                const { student_id_list } = req.body
                if (!section_id || !student_id_list) {
                    throw new Error('section_id or student_id_list missing !');
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

                const valid = await prisma.student.findMany({
                    where: {
                        id: {
                            in: student_id_list
                        },
                        section_id: parseInt(section_id),
                        academic_year_id: parseInt(academic_year_id),
                    },
                    select: {
                        id: true
                    }
                })
                if (valid.length !== student_id_list.length) {
                    throw Error('Provide valid parameter')
                }
                const allFinalResult = []
                for (const singleStudent of student_id_list) {

                    const student = await prisma.student.findUnique({
                        where: {
                            id: singleStudent,

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
                    // if(!student){
                    //     throw new Error('')
                    // }

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
                                                name: true
                                            }
                                        },
                                        subject_total:true
                                    }
                                },
                                student_results: {
                                    where: {
                                        exam_id: exam.id,
                                        student_id: singleStudent
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
                        // console.log( data.student_results );

                        let allSubjectCalculatedMark = []
                        let totalMark = 0
                        for (const studetGivenExam of data.exam_details) {


                            const flag = data.student_results[0]?.result_details.find(i => i.exam_details.subject.id == studetGivenExam.subject.id);
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

                    allFinalResult.push({ student: student, termWiseTotalMark: termWiseTotalMark })
                }
                res.status(200).json(allFinalResult);
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

export default authenticate(FinalResultAll);
