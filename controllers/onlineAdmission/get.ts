import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


async function get(req, res, refresh_token) {
    try {

        const requestList = await prisma.onlineAdmission.findMany({
            where: {
                school_id: refresh_token.school_id
            }
        });
        res.status(200).json(requestList);
    } catch (error) {
        logFile.error(error.message)
        console.log(error);
        res.status(404).json({ Error: error.message });
    }
}

export default authenticate(get)