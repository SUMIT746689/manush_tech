import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const FinalResultAll = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                /*
                req.query
                ------------
                section_id, academic_year_id

                
                */
                // const { examList } = req.body


                if (!req.query.section_id || !req.query.academic_year_id) {
                    throw new Error('section_id or academic_year_id missing !');
                }

                const section_id = Number(req.query.section_id);
                const academic_year_id = Number(req.query.academic_year_id)

                const exams = await prisma.exam.findMany({
                    where: {
                        section_id,
                        academic_year_id,
                        final_percent: {
                            not: null
                        }
                    },
                    select: {
                        id: true,
                        exam_details: {
                            select: {
                                subject_total: true,
                                subject: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }

                })
                const examList = exams.map(i => ({ exam_id: i.id }))

                const student_result_list = await prisma.student.findMany({
                    where: {
                        section_id,
                        academic_year_id,
                    },
                    select: {
                        id: true,
                        student_info: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            }
                        },
                        class_roll_no: true,
                        class_registration_no: true,
                        results: {
                            where: {
                                OR: examList
                            },
                            include: {
                                result_details: {
                                    include: {
                                        grade: {
                                            select: {
                                                id: true,
                                                grade: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                res.status(200).json({ examList: exams, student_result_list });
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
