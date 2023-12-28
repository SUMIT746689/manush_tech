import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res, token) => {
    try {
        const { method } = req;
        console.log(method);


        switch (method) {
            case 'PUT':
                const { user_id, permission_id } = req.body;
                if (!user_id || !permission_id) throw new Error('user_id Or permission_id missing !')
                const req_user_permission_list = await prisma.user.findFirst({
                    where: {
                        id: user_id,
                    },
                    select: {
                        role: {
                            select: {
                                permissions: true
                            }
                        }
                    }

                })
                if (req_user_permission_list?.role) {
                    const temp = req_user_permission_list?.role?.permissions?.find(i => i.id == permission_id);
                    if (temp) {
                        const totalPermissions = [];
                        for (const i of req_user_permission_list?.role?.permissions) {
                            if (i.id !== permission_id) {
                                totalPermissions.push({
                                    id: i.id
                                })
                            }
                        }
                        await prisma.user.update({
                            where: {
                                id: user_id,
                            },
                            data: {
                                role_id: null,
                                permissions: {
                                    connect: totalPermissions,
                                    disconnect: [{ id: permission_id }]
                                }
                            }
                        })
                    }

                } else {
                    await prisma.user.update({
                        where: {
                            id: user_id,
                        },
                        data: {
                            permissions: {
                                disconnect: [{ id: permission_id }]
                            }
                        }
                    })
                }
                return res.json({ message: "permission detached" })

            default:
                res.setHeader('Allow', ['PUT']);
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