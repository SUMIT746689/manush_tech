import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';
import dayjs from 'dayjs';
import superadminCheck from 'middleware/superadminCheck';

const index = async (req, res, refresh_token) => {
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
            case 'POST':

                if (!req.body.collected_amount || !req.body.school_id) {
                    throw new Error('student or collected amount missing !!')
                }
                await prisma.$transaction(async (trans) => {

                    const subscription = await trans.subscription.findFirstOrThrow({
                        where: {
                            school_id: Number(req.body.school_id)
                        },
                        include: {
                            package: true
                        }
                    })

                    await trans.package_transaction.create({
                        data: {
                            package_id: subscription.package_id,
                            paymentID: `${refresh_token.name}-${Date.now()}`,
                            amount: Number(req.body.collected_amount),
                            paymentExecuteTime: new Date(),
                            pay_via: 'Cash',
                            trxID: `user_id=${refresh_token.id}`,
                            merchantInvoiceNumber: '',
                            customerMsisdn: '',
                            school_id: Number(req.body.school_id)
                        }
                    });

                    const end = new Date(subscription.end_date)
                    end.setDate(end.getDate() + subscription.package.duration);

                    await trans.subscription.update({
                        where: {
                            id: subscription.id
                        },
                        data: {
                            end_date: end,
                            Subscription_history: {
                                create: {
                                    edited_at: new Date(),
                                    edited_by: refresh_token.id
                                }
                            }
                        }
                    })

                    
                })
                res.status(200).json({ message:'manual Package payment created successfully !' })

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

export default authenticate(superadminCheck(index));

