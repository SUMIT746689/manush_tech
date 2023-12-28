import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { status } = req.query;
                const admin = await prisma.user.findFirst({
                    where: {
                        id: refresh_token.id,
                        school_id: refresh_token.school_id,
                        role: {
                            title: 'ADMIN'
                        }
                    },
                })

                if (admin) {
                    const statusQuery = {}
                    if (status) statusQuery['status'] = status
                    const data = await prisma.leave.findMany({
                        where: {
                            user: {
                                school_id: refresh_token.school_id
                            },
                            ...statusQuery
                        },
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    role: {
                                        select: {
                                            title: true
                                        }
                                    }
                                }
                            }
                        }
                    })
                    res.status(200).json(data);
                }
                else {
                    const data = await prisma.leave.findMany({
                        where: {
                            user: {
                                id: refresh_token.id,
                                school_id: refresh_token.school_id,
                            }
                        }
                    })
                    res.status(200).json(data);
                }
                break;
            case 'POST':
                const { from_date, to_date, description, Leave_type } = req.body;
                const isAdmin = await prisma.user.findFirst({
                    where: {
                        id: refresh_token.id,
                        role: {
                            OR: [
                                {
                                    title: 'SUPER_ADMIN'
                                },
                                {
                                    title: 'ADMIN'
                                }
                            ]
                        }

                    }
                })
                if (isAdmin) throw new Error('Invalid user !')

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
                        Leave_type: Leave_type,
                        status: 'pending'
                    }
                })
                res.status(200).json({ message: 'Leave application submitted !' })
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                logFile.error(`Method ${method} Not Allowed`);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);

