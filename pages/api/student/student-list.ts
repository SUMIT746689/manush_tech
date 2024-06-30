import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const query = {}

                const students = await prisma.student.findMany({
                    where: {
                        academic_year: {
                            id: parseInt(req.query.academic_year_id)
                        },
                        batches: {
                            some: {
                                id: parseInt(req.query.section_id)
                            }
                        },
                        student_info: {
                            user: {
                                is: {
                                    deleted_at: null
                                }
                            },
                            school_id: refresh_token.school_id
                        }
                        // student_info: {
                        //     school_id: parseInt(req.query.school_id)
                        // }
                    },
                    select: {
                        id: true,
                        student_information_id: true,
                        // section_id: true,
                        student_photo: true,
                        class_id:true,
                        class: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        batches: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        // section: {
                        //     select: {
                        //         id: true,
                        //         name: true,
                        //         class: {
                        //             select: {
                        //                 id: true,
                        //                 name: true
                        //             }
                        //         }
                        //     }
                        // },
                        academic_year_id: true,
                        class_roll_no: true,
                        class_registration_no: true,
                        student_info: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                                phone: true,
                            }
                        },
                        guardian_name: true,
                        guardian_phone: true,
                        extra_section_id: true
                    }
                })
                res.status(200).json(students)
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
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
