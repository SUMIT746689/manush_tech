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

                if (type) {
                    AND.push({
                        voucher_type: type
                    })
                }


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

                const data = await prisma.transaction.findMany({
                    where: {
                        AND
                    }
                })
                res.status(200).json(data)
                break;

            default:
                res.setHeader('Allow', ['GET']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });

    }

}

export default authenticate(index) 