import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const id = parseInt(req.query.id)
        if (!id) {
            return res.status(400).json({ message: 'valid id required' })

        }
        switch (method) {
            case 'DELETE':
                await prisma.user.findFirstOrThrow({
                    where: {
                        school_id: refresh_token?.school_id,
                        role: {
                            id: refresh_token?.role?.id,
                            title: 'ADMIN'
                        }
                    }
                })
                await prisma.department.update({
                    where: {
                        id: id,
                    },
                    data: {
                        deleted_at: new Date()
                    }
                })
                res.status(200).json({message:'Department deleted successfully !!'});
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

export default authenticate(id) 