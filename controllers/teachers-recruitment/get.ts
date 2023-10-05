import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


async function get(req, res, refresh_token) {
    try {

        const requestList = await prisma.teacherRecruitment.findMany({
            where: {
                school_id: refresh_token.school_id
            }
        });
        res.status(200).json(requestList);
    } catch (error) {
        console.log(error);

        res.status(404).json({ Error: error.message });
    }
}

export default authenticate(get)