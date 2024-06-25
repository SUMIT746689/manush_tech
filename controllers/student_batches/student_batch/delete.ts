import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function delete_std_batch(req, res, refresh_token) {
    try {
        const { id, section_id } = req.query;
        const { school_id } = refresh_token;
        
        if (!section_id) throw new Error('subject is required')

        const parseId = parseInt(id);
        const parseSectionId = parseInt(section_id)

        if (!Number.isInteger(parseId)) throw new Error('invalid subjcet id');
        if (!Number.isInteger(parseSectionId)) throw new Error('invalid subject id');

        await prisma.student.update({
            where: { id: parseId, student_info: { school_id } },
            data: {
                batches: {
                    disconnect: { id: parseSectionId }
                }
            }
        });
        res.status(200).json({ message: 'deleted successfully' });


    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}
export default authenticate(adminCheck(delete_std_batch)) 