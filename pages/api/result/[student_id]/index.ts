import prisma from "@/lib/prisma_client";

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
                const singleStudentResult = await prisma.studentResult.findFirst({
                    where: {
                        student_id: student_id,
                        exam_id: exam_id
                    },
                    include: {
                        student: {
                            select: {
                                student_info: {
                                    select: {
                                        first_name: true,
                                        middle_name: true,
                                        last_name: true
                                    }
                                },
                                class_roll_no: true,
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
                        },
                        result_details: {
                            select: {
                                mark_obtained: true,
                                exam_details: {
                                    select: {
                                        subject: {
                                            select: {
                                                name: true
                                            }
                                        },
                                        subject_total: true
                                    }
                                }
                            }
                        },
                        exam: {
                            select: {
                                title: true,
                                section_id: true
                            }
                        }
                    }
                })

                res.status(200).json(singleStudentResult);
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

export default id;
