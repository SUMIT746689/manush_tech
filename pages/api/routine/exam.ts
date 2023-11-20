import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { section_id, academic_year_id, exam_id } = req.query
                if (!section_id || !academic_year_id) {
                    res.status(500).json({ message: "section_id or academic_year_id missing" })
                }
                const routine = await prisma.exam.findFirst({
                    where: {
                        id: Number(exam_id),
                        section_id: Number(section_id),
                        school_id: (refresh_token?.school_id),
                        academic_year_id: Number(academic_year_id)
                    },
                    include: {
                        exam_details: {
                            include: {
                                subject: true,
                                exam_room: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                            }
                        }
                    }

                })
                res.status(200).json(routine);
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
