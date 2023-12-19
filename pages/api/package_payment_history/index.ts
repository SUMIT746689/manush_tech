import prisma from '@/lib/prisma_client';
import dayjs from 'dayjs';

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { from_date, to_date, school_id } = req.query;

                const query = {}
                if (school_id) query['school_id'] = Number(school_id)
                const data = await prisma.package_transaction.findMany({
                    where: {
                        created_at: {
                            gte: new Date(new Date(from_date).setUTCHours(0, 0, 0, 0)),
                            lte: new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                        },
                        ...query
                    },
                    include: {
                        school: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                })

                res.status(200).json(data)
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

