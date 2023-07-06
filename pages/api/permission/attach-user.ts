import { PrismaClient } from "@prisma/client"
import { authenticate } from "middleware/authenticate";


const prisma = new PrismaClient()

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'PUT':
                const { user_id, role_id, permission_id } = req.body;
                if (!user_id) throw new Error('user_id required !');

                if (role_id) {
                    const req_role_permission_list = await prisma.user.findFirst({
                        where: {
                            id: user_id,
                        },
                        select: {
                            permissions: true
                        }

                    })
                    await prisma.user.update({
                        where: {
                            id: user_id,
                        },
                        data: {
                            role_id: role_id,
                            permissions: {
                                disconnect: req_role_permission_list.permissions.map(i => { return { id: i.id } })
                            }
                        }
                    })
                }

                else {
                    if (!permission_id) throw new Error('permission_id required !')
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
                        console.log({ temp });

                        if (!temp) {
                            const totalPermissions = req_user_permission_list?.role?.permissions.map(i => {
                                return {
                                    id: i.id
                                }
                            });
                            totalPermissions.push({ id: permission_id })
                            await prisma.user.update({
                                where: {
                                    id: user_id,
                                },
                                data: {
                                    role_id: null,
                                    permissions: {
                                        connect: totalPermissions
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
                                    connect: [{ id: permission_id }]
                                }
                            }
                        })
                    }
                }


                return res.json({ message: "permission attached" })
            // return res.json({ req_user_permission_list })

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