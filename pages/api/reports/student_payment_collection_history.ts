import prisma from '@/lib/prisma_client';
import dayjs from 'dayjs';

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { from_date, to_date, payment_method, collected_by, account_id } = req.query;
                const query = {};
                if (payment_method) {
                    query['payment_method'] = payment_method
                }
                if (account_id) {
                    query['account_id'] = Number(account_id)
                }
                if (collected_by) {
                    query['collected_by'] = collected_by
                }

                const data = await prisma.studentFee.findMany({
                    where: {
                        created_at: {
                            gte: new Date(new Date(from_date).setUTCHours(0, 0, 0, 0)),
                            lte: new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                        },
                        ...query

                    },
                    include: {
                        collected_by_user: {
                            select: {
                                id: true,
                                username: true,
                            }
                        },
                        student: {
                            select: {
                                id: true,
                                class_roll_no: true,
                                class_registration_no: true,
                                discount: true,
                                student_info: {
                                    select: {
                                        first_name: true,
                                        middle_name: true,
                                        last_name: true
                                    }
                                },
                                section: {
                                    select: {
                                        class: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                },

                            }
                        },
                        fee: {
                            select: {
                                id: true,
                                title: true,
                                last_date: true,
                                late_fee: true,
                                amount: true,
                            }
                        },
                        transaction: {
                            select: {
                                tracking_number: true
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

