import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const { method } = req;
        console.log("req body__", req.body);

        switch (method) {
            case 'GET':
                if (!req.query.section_id || !req.query.school_id) {
                    res.status(500).json({ message: "section_id or school_id missing" })
                }
                const routine = await prisma.period.findMany({
                    where: {
                        section_id: parseInt(req.query.section_id),
                        school_id: parseInt(req.query.school_id)
                    },
                    select: {
                        day: true,
                        start_time: true,
                        end_time: true,
                        room: true,
                        teacher: {
                            select: {
                                school_id: true,
                                user: {
                                    select: {
                                        username: true,
                                    }
                                }
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

export default index;
