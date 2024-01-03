import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
    try {

        const { method } = req;
        const { id, role, school_id } = refresh_token;

        switch (method) {
            case 'GET':
                console.log({ role, id })
                // if (role.title !== "ADMIN") console.log("true...........");
                // if (role.title !== "TEACHER") console.log("te...........");

                if (role.title !== "ADMIN" && role.title !== "TEACHER") throw new Error("unauthorized user")

                const { exam_term_id, teacher_id } = req.query;
                const where = { deleted_at: null };

                if (role.title === "TEACHER") where["user_id"] = id;
                else if (role.title === "ADMIN") where["user_id"] = parseInt(teacher_id);
                // { academic_year_id: parseInt(academic_year) }
                const resTeacherSyllabus = await prisma.teacher.findFirst({
                    where,
                    select: {
                        first_name: role.title !== "TEACHER" ? true : false,
                        seatPlans: {
                            where: { exam_details: { exam: { exam_term_id: parseInt(exam_term_id) } } },
                            include: {
                                room: {
                                    select: { name: true }
                                },
                                exam_details: {
                                    select: {
                                        exam: {
                                            select: {
                                                title: true,
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
                                        subject: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                },
                            }
                        }
                    }
                });
                return res.status(200).json(resTeacherSyllabus);

            // break;

            default:
                res.setHeader('Allow', ['GET']);
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
