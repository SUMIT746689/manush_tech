import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


async function get(req, res, refresh_token) {
    try {
        if(!refresh_token.school_id) throw new Error('unauthorized user')
        const requestList = await prisma.studentAdmissionForm.findFirst({
            where: {
                school_id: refresh_token.school_id
            }
        });
        res.status(200).json(requestList);
    } catch (error) {
        logFile.error(error.message)
        console.log(error);
        res.status(404).json({ error: error.message });
    }
}

export default authenticate(get)