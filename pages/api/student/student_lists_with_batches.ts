import prisma from "@/lib/prisma_client";
import { academicYearVerify, authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, refresh_token, dcryptAcademicYear) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { school_id } = refresh_token;
                const { academic_year_id } = dcryptAcademicYear;
                const { section_ids } = req.query;
                const parseSectionIds = section_ids.split(',').map((section) => {
                    const parseSection = parseInt(section);
                    if (!Number.isInteger(parseSection)) throw new Error('invalid section')
                    return parseSection
                })

                const students = await prisma.student.findMany({
                    where: {
                        academic_year_id,
                        section_id: { in: parseSectionIds },
                        student_info: {
                            user: {
                                deleted_at: null
                            },
                            school_id
                        }
                    },
                    select: {
                        id: true,
                        student_info: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                                phone: true,
                                student_id: true
                            }
                        },
                        batches: true,
                    },
                    orderBy: { id: "desc" }
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
