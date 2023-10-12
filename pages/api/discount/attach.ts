import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'PUT':
                const { discount_id, student_id } = req.body;
                if (!discount_id || !student_id) throw new Error('fee_id Or student_id missing !')

                await prisma.student.update({
                    where: {
                        id: Number(student_id),
                    },
                    data: {
                        discount: {
                            connect: { id: Number(discount_id) }
                        }
                    }
                })


                return res.json({ message: "permission attached" })

            default:
                // res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }

}

export default authenticate(index) 