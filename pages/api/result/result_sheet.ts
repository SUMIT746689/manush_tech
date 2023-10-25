import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const FinalResultAll = async (req, res, refresh_token) => {
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
                        title: true,
                        final_percent: true,
                    }

                })
                const examsLenght = exams.length;
                if (!examsLenght) throw new Error('No exam found !!')

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
                                exam: {
                                    select: {
                                        final_percent: true,
                                    }
                                },
                                result_details: {
                                    include: {
                                        grade: {
                                            select: {
                                                id: true,
                                                grade: true,
                                                point: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                const temp = student_result_list.map(i => {
                    let total_counted_mark = 0
                    let total_counted_point = 0

                    const result = i.results.map(j => {
                        let termTotalCountedMark = 0;
                        let termTotalCountedPoint = 0;

                        for (const k of j.result_details) {
                            termTotalCountedPoint += (k.grade.point * j.exam.final_percent) / 100;
                            termTotalCountedMark += (k.mark_obtained * j.exam.final_percent) / 100;
                        }

                        total_counted_mark += termTotalCountedMark
                        total_counted_point += termTotalCountedPoint

                        j['termTotalCountedMark'] = termTotalCountedMark
                        j['termTotalCountedPoint'] = termTotalCountedPoint
                         delete j['result_details']
                        return j
                    })
                    i['total_counted_mark'] = total_counted_mark
                    i['total_counted_point'] = total_counted_point/examsLenght
                    i['results'] = result
                    return i
                })

                res.status(200).json({ examList: exams, student_result_list: temp });
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
