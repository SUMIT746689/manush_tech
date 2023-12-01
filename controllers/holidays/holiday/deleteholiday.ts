import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function deleteholiday(req, res, refresh_token) {
    try {
        const { id } = req.query;
        
        await prisma.holiday.delete({
            where: {
                id: Number(id),
                // school_id: refresh_token.school_id
            },

        });
        res.status(200).json({ message: 'Holiday deleted successfully' });


    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}
export default authenticate(adminCheck(deleteholiday)) 