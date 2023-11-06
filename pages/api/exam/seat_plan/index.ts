import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { exam_id, exam_details_id, room_id, class_roll_from, class_roll_to, student_count, class_id, section_id } = req.body;

        switch (method) {
            case 'GET':
                if (!req.query.academic_year_id || !req.query.section_id || !req.query.exam_details_id) throw new Error('Academic year or section or subject missing !')

                const seatPlan = await prisma.examDetails.findFirst({
                    where: {
                        id: Number(req.query.exam_details_id),
                        exam: {
                            school_id: refresh_token.school_id,
                            academic_year_id: Number(req.query.academic_year_id),
                            section_id: Number(req.query.section_id)
                        }
                    },
                    select: {
                        seatPlan: {
                            include: {
                                room: true,
                                exam_details: {
                                    include: {
                                        exam: {
                                            include: {
                                                section: true
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                })

                res.status(200).json(seatPlan)

                break;
            case 'POST':

                await prisma.examDetails.findFirstOrThrow({
                    where: {
                        id: exam_details_id,
                        exam: {
                            id: exam_id,
                            academic_year_id: req.body.academic_year_id,
                            school_id: refresh_token.school_id,
                            section: {
                                id: section_id
                            }
                        },
                    },
                    select: {
                        id: true
                    }
                })
                await prisma.room.findFirstOrThrow({ where: { id: room_id, school_id: refresh_token.school_id } })

                await prisma.seatPlan.create({
                    data: {
                        exam_details: {
                            connect: {
                                id: exam_details_id,
                            },
                        },
                        class_roll_from,
                        class_roll_to,
                        student_count,
                        room: {
                            connect: { id: room_id }
                        }
                    }
                })

                res.status(200).json({ success: true, message: "Seat Plan created!" })
                break;

            case 'PATCH':

                await prisma.seatPlan.findFirstOrThrow({
                    where: {
                        exam_details: {
                            id: exam_details_id,
                            exam: {
                                id: exam_id,
                                section: {
                                    id: section_id,
                                    class_id: class_id
                                },
                                school_id: refresh_token.school_id,
                                academic_year_id: req.body.academic_year_id,
                            },

                        }
                    }
                })
                await prisma.seatPlan.update({
                    where: {
                        exam_details_id_room_id: {
                            exam_details_id: Number(exam_details_id),
                            room_id: Number(room_id),
                        }
                    },
                    data: {
                        class_roll_from,
                        class_roll_to,
                        student_count,
                    }
                })
                res.status(200).json({ success: true, message: 'SeatPlan updated !!' })

                break;
            case 'DELETE':

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
