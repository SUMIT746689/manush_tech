import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'PATCH':
                const { id } = req.query;
                const { title, description, amount, reference, type, resource_id, resource_type } = req.body;

                const data = {};
                if (title) data['title'] = title
                if (description) data['description'] = description
                if (amount) data['amount'] = amount
                if (reference) data['reference'] = reference
                if (type) data['type'] = type
                if (resource_id) data['resource_id'] = resource_id
                if (resource_type) data['resource_type'] = resource_type

                const isvalid = await prisma.voucher.findFirst({
                    where: {
                        id: parseInt(id),
                        school_id: refresh_token.school_id
                    }
                })
                if (!isvalid) throw new Error('Bad request !')

                await prisma.voucher.update({
                    where: { id: parseInt(id) },
                    data
                });

                res.status(200).json({ message: 'Voucher edited successfully' });
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
