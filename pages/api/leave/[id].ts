import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { id } = req.query;

        switch (method) {
            case 'PATCH':
                const { from_date, to_date, status, remarks, Leave_type } = req.body;
                
                const prev = await prisma.leave.findFirst({
                    where: {
                        id: Number(id),
                        OR: [
                            {
                                status: 'approved'
                            },
                            {
                                status: 'declined'
                            }
                        ]
                    }
                })
                if (prev) throw new Error('Leave Already approved or declined');

                const data = {
                    approved_by_id: refresh_token.id,
                    status,
                }
                if (from_date) data['from_date'] = new Date(from_date)
                if (to_date) data['to_date'] = new Date(to_date)
                if (remarks) data['remarks'] = remarks
                if (Leave_type) data['Leave_type'] = Leave_type

                await prisma.leave.update({
                    where: {
                        id: Number(id)
                    },
                    data
                })

                res.status(200).json({ message: 'Leave application  updated!' })
                break;
            default:
                res.setHeader('Allow', ['PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(id);
