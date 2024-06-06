import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function deleteholiday(req, res, refresh_token) {
    try {
        const { id, subject_id } = req.query;
        const { school_id } = refresh_token;
        const parseId = parseInt(id);
        const parseSubjectId = parseInt(subject_id)
        if (!subject_id) throw new Error('subject is required')
        if (!Number.isInteger(parseId)) throw new Error('invalid subjcet id');
        if (!Number.isInteger(parseSubjectId)) throw new Error('invalid subject id');

        await prisma.student.update({
            where: { id: parseId, student_info: { school_id } },
            data: {
                subjects: {
                    disconnect: { id: parseSubjectId }
                }
            }
        });
        res.status(200).json({ message: 'deleted successfully' });


    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}
export default authenticate(adminCheck(deleteholiday)) 