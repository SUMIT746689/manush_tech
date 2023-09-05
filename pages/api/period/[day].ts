import prisma from "@/lib/prisma_client";

const Day = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':

                const schedule = await prisma.period.findMany({
                    where: {
                        school_id: parseInt(req.query.school_id),
                        day: req.query.day
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

export default Day