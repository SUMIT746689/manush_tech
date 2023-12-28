import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import dayjs from 'dayjs';
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { type, fromDate, toDate } = req.query;

                const AND: any = [
                    {
                        school_id: refresh_token.school_id,
                    }
                ]

                if (fromDate) {
                    AND.push({
                        created_at: {
                            gte: new Date(new Date(fromDate).setUTCHours(0, 0, 0, 0)),
                        }
                    })
                }
                if (toDate) {
                    AND.push({
                        created_at: {
                            lte: new Date(new Date(toDate).setUTCHours(23, 59, 59, 999))
                        }
                    })
                }
                console.log(AND);

                const data = await prisma.transaction.groupBy({
                    by: ['voucher_type'],
                    where: {
                        AND
                    },
                    _sum: {
                        amount: true
                    }
                })
                const total_deposit = data.filter(i => i.voucher_type === 'credit').reduce((p, c) => p + c._sum.amount, 0);
                const total_expense = data.filter(i => i.voucher_type === 'debit').reduce((p, c) => p + c._sum.amount, 0);

                const totalbalance = await prisma.accounts.aggregate({
                    where: {
                        school_id: refresh_token.school_id,
                    },
                    _sum: {
                        balance: true
                    }
                })
                res.status(200).json({ total_deposit, total_expense, total_profit: total_deposit - total_expense, totalbalance: totalbalance._sum.balance })
                break;

            default:
                res.setHeader('Allow', ['GET']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message);
        res.status(500).json({ message: err.message });

    }

}

export default authenticate(index) 