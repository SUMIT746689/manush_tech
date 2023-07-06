import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const exam_id = async (req, res) => {
    try {
        const { method } = req;
        const exam_id = parseInt(req.query.exam_id)
        switch (method) {
            case 'GET':
                if (!exam_id) {
                    res.status(400).json({ message: 'valid id required' })
                    break;
                }
                const user = await prisma.exam.findUnique({
                    where: {
                        id: exam_id
                    },
                    include: {
                        // @ts-ignore
                        class: {
                            select: {
                                name: true
                            }
                        },
                        academic_year: {
                            select: {
                                title: true
                            }
                        },
                        exam_details: {
                            select: {
                                subject: true
                            }
                        }
                    }
                })
                res.status(200).json(user);
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

export default exam_id