import { PrismaClient } from "@prisma/client"
import { authenticate } from "middleware/authenticate";

const prisma = new PrismaClient()

const Id = async (req, res,refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'DELETE':

                await prisma.onlineAdmission.delete({
                    where: {
                        id: Number(req.query.id)
                    }
                })
                res.status(200).json({ message: 'Admission request also deleted !'});
                break;
            default:
                res.setHeader('Allow', ['DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
}

export default authenticate(Id) 