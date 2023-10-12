import prisma from "@/lib/prisma_client";

const id = async (req, res) => {
    try {
        const { method } = req;
        const id = parseInt(req.query.id)
        if (!id) {
            return res.status(400).json({ message: 'valid id required' })

        }
        switch (method) {
            case 'GET':
                const user = await prisma.section.findUnique({
                    where: {
                        id: id
                    },
                    // include: {
                     
                    // }
                })
                res.status(200).json(user);
                break;
            case 'DELETE':
                await prisma.section.delete({
                    where: {
                        id: id
                    }
                })
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

export default id