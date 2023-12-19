import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


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
        console.log(error);

        res.status(404).json({ error: error.message });
    }
}

export default authenticate(get)