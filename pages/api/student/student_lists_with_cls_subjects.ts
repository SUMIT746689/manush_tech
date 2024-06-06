import prisma from "@/lib/prisma_client";
import { academicYearVerify, authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, refresh_token, dcryptAcademicYear) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const query = {};

                const { school_id } = refresh_token;
                const { academic_year_id } = dcryptAcademicYear;
                const { section_id } = req.query

                const students = await prisma.student.findMany({
                    where: {
                        academic_year_id,
                        section_id: parseInt(section_id),
                        student_info: {
                            user: {
                                deleted_at: null
                            },
                            school_id
                        }
                        // student_info: {
                        //     school_id: parseInt(req.query.school_id)
                        // }
                    },
                    select: {
                        id: true,
                        // student_information_id: true,
                        // section_id: true,
                        // student_photo: true,
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
                        // academic_year_id: true,
                        // class_roll_no: true,
                        // class_registration_no: true,
                        student_info: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                                phone: true,
                                student_id: true
                            }
                        },
                        subjects: true,
                        // StudentClassSubjects: {
                        //     select: {
                        //         id: true,
                        //         subject: true,
                        //         teacher: {
                        //             select: {
                        //                 first_name: true
                        //             }
                        //         }
                        //     }
                        // }

                        // guardian_name: true,
                        // guardian_phone: true,
                        // extra_section_id: true
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

export default authenticate(academicYearVerify(index));
