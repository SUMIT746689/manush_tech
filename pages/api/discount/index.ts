import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { academic_year_id } = req.query;


        switch (method) {
            case 'GET':
                const discount = await prisma.discount.findMany({
                    where: {
                        fee: {
                            school_id: refresh_token.school_id,
                            academic_year_id: Number(academic_year_id)
                        },
                    }
                })
                res.status(200).json(discount)
                break;
            case 'POST':
                const { fee_id, type, amt } = req.body;
                await prisma.discount.create({
                    data: {
                        fee: {
                            connect: {
                                id: Number(fee_id)
                            }
                        },
                        type: type,
                        amt: Number(amt),
                    }
                })
                res.status(200).json({ message: 'Discount created successful !!' })
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
