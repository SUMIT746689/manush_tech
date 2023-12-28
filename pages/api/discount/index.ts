import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const academic_year_id = Number(req.query.academic_year_id);
        const { class_id } = req.query
        switch (method) {
            case 'GET':
                const query = {}
                if (class_id) {
                    query['class_id'] = Number(class_id)
                }
                const discount = await prisma.discount.findMany({
                    where: {
                        fee: {
                            school_id: refresh_token.school_id,
                            academic_year_id: academic_year_id,
                            ...query
                        },
                    },
                    include: {
                        fee: {
                            select: {
                                class: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                title: true
                            }
                        },

                    }
                })
                res.status(200).json(discount)
                break;
            case 'POST':
                const { fee_id, type, amt, title } = req.body;

                const temp = await prisma.fee.findFirst({
                    where: {
                        id: fee_id,
                        academic_year_id: academic_year_id,
                        school_id: refresh_token?.school_id
                    }
                })

                if (!temp) throw new Error('Bad request !')

                await prisma.discount.create({
                    data: {
                        title,
                        fee: {
                            connect: {
                                id: Number(fee_id)
                            }
                        },
                        type,
                        amt: Number(amt),
                    }
                })
                res.status(200).json({ message: 'Discount created successful !!' })
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

export default authenticate(index);
