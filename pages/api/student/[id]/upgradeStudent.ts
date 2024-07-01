import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

const id = async (req, res) => {
    try {
        const { method } = req;
        const student_information_id = parseInt(req.query.id)
        if (!student_information_id) {
            return res.status(400).json({ message: 'valid student_information_id required' })

        }
        switch (method) {
            case 'POST':
                const { academic_year_id, class_registration_no, class_roll_no, section_id } = req.body;

                const reqValidityCheck = await prisma.student.findFirst({
                    where: {
                        student_information_id,
                        academic_year_id
                    }
                })
                if (reqValidityCheck) throw Error('This student already admitted in the requested year')

                await prisma.student.create({
                    data: {
                        class_registration_no,
                        academic_year_id,
                        class_roll_no,
                        batches:{
                            connect:{
                                id: section_id
                            }
                        },
                        // section_id,
                        student_information_id
                    }
                })
                res.status(200).json({ message: 'student upgrated!' })

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
}

export default id