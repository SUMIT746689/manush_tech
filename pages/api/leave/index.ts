import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const data = await prisma.leave.findMany({
                    where: {
                        user_id: refresh_token.id
                    }
                })
                res.status(200).json(data);
                break;
            case 'POST':
                const { from_date, to_date, description } = req.body;
                await prisma.leave.create({
                    data: {
                        user: {
                            connect: {
                                id: refresh_token.id
                            }
                        },
                        from_date,
                        to_date,
                        description,
                        status: 'pending'
                    }
                })
                res.status(200).json({ message: 'Leave application submitted !' })
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

