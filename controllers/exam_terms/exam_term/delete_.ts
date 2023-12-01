import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function delete_(req, res, refresh_token) {
    try {
        const { school_id, role } = refresh_token;
        if (!school_id) throw new Error('invalid user');

        if (role?.title !== 'ADMIN') throw new Error('unauthorized users');

        // user verify end
        const { id } = req.query;

        const response = await prisma.examTerm.update({
            where: {
                id: parseInt(id),
                // school_id
            },
            data: {
                deleted_at: new Date(Date.now())
            }
        });

        if (response) return res.json({ success: true });
        else throw new Error('Invalid to update room');
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(delete_);