import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                if (!req.query.section_id) {
                    res.status(500).json({ message: "Section missing" })
                }
                const routine = await prisma.period.findMany({
                    where: {
                        section_id: parseInt(req.query.section_id),
                        school_id: (refresh_token.school_id)
                    },
                    select: {
                        day: true,
                        start_time: true,
                        end_time: true,
                        room: true,
                        teacher: {
                            where: { deleted_at: null },
                            select: {
                                school_id: true,
                                user: {
                                    select: {
                                        username: true,
                                    }
                                }
                            }
                        },
                        subject: true,
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
