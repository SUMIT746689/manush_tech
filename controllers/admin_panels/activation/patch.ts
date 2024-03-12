import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const patch = async (req, res, refresh_token) => {
    try {
        const { is_active } = req.body;
        const { id } = req.query;
        const { role } = refresh_token;

        if (role?.title !== 'SUPER_ADMIN') throw new Error("user permission denied")
        if (typeof is_active !== 'boolean') throw new Error('provide valid required fields');

        const deactive_user = await prisma.user.findFirst({
            where: { id: parseInt(id), user_role: { title: "ASSIST_SUPER_ADMIN" } },
            select: {
                user_role: true
            }
        });

        if (!deactive_user) throw new Error("selected user not founds");

        await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                adminPanel: {
                    update: {
                        is_active
                    }
                }
            }
        });
        res.status(200).json({ message: 'User Status updated Successfully' });

    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
};

export default authenticate(patch)