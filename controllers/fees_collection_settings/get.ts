import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { authenticate } from 'middleware/authenticate';


async function get(req, res, refresh_token) {
    try {
        const { school_id } = refresh_token;

        const sss = await prisma.smsSettings.findFirst({
            where: { school_id },
            // include: {
                // academicYear: true
            // }
        })
        res.status(200).json(sss);
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ err: err.message });
    }
}

export default authenticate(get)