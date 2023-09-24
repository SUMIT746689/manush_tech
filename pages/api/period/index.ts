import prisma from "@/lib/prisma_client";
import post from "controllers/period/post";


const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const periods = await prisma.period.findMany({
                    where: {
                        school_id: {
                            equals: req.body.school_id
                        }
                    }
                })
                res.status(200).json(periods?.map(period => {
                    return {
                        id: period.id,
                        room_id: period.room_id,
                        day: period.day,
                        start_time: new Date(Date.parse(period.start_time + "+0000")),
                        end_time: new Date(Date.parse(period.end_time + "+0000")),
                        school_id: period.school_id,
                    }
                }));
                break;

            case 'POST':
                post(req, res)
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

export default index