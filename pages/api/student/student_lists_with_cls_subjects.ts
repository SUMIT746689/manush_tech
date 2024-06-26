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
                const { class_id, section_ids } = req.query;

                if (!class_id) throw new Error('class field not founds');

                const parseClassId = parseInt(class_id);
                if (!Number.isInteger(parseClassId)) throw new Error('invalid class');

                const parseSectionIds = section_ids && section_ids.split(',').map((section) => {
                    const parseSection = parseInt(section);
                    if (!Number.isInteger(parseSection)) throw new Error('invalid batch')
                    return parseSection
                })
                const batches = {}
                if (section_ids) batches['some'] = { id: { in: parseSectionIds } };

                const students = await prisma.student.findMany({
                    where: {
                        academic_year_id,
                        class_id: parseClassId,
                        batches,
                        student_info: {
                            user: {
                                deleted_at: null
                            },
                            school_id
                        },
                        is_separate: false
                    },
                    select: {
                        id: true,
                        batches: { select: { id: true, name: true } },
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
