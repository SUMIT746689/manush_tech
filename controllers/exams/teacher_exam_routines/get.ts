import prisma from "@/lib/prisma_client";
import { academicYearVerify } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const get = async (req, res, refresh_token, academic_year) => {
    try {
        const { id, role, school_id } = refresh_token;
        const { id: academic_year_id } = academic_year;
        const { exam_term_id, teacher_id } = req.query;
        console.log({ role, id });
        // if (role.title !== "ADMIN") console.log("true...........");
        // if (role.title !== "TEACHER") console.log("te...........");

        if (role.title !== "ADMIN" && role.title !== "TEACHER") throw new Error("unauthorized user")

        const where = {deleted_at: null};

        if (role.title === "TEACHER") where["user_id"] = id;
        else if (role.title === "ADMIN") where["user_id"] = parseInt(teacher_id);
        // { academic_year_id: parseInt(academic_year) }
        const resTeacherSyllabus = await prisma.teacher.findFirst({
            where,
            select: {
                first_name: role.title !== "TEACHER" ? true : false,
                seatPlans: {
                    where: { exam_details: { exam: { exam_term_id: parseInt(exam_term_id), academic_year_id } } },
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
    } catch (err) {
        logFile.error(err.message)
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export default academicYearVerify(get);