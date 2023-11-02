import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const Day = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { school_id } = refresh_token;
                const { day, teacher_id } = req.query;
                const where = {
                    school_id: parseInt(school_id),
                    day
                };
                if (teacher_id) where['teacher_id'] = parseInt(teacher_id);

                const schedule = await prisma.period.findMany({
                    where:{
                        section_id :1,
                        
                    },
                    include: {
                        room: true,
                        teacher: {
                            select: {
                                id: true,
                                first_name: true
                            }
                        },
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
                res.status(200).json(schedule);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
}

export default authenticate(Day)