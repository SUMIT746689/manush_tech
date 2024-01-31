import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function get(req, res, refresh_token) {
    try {
        const { school_id } = refresh_token;

        if (!school_id) throw new Error('unauthorized user')

        const findAcademic = await prisma.academicYear.findFirstOrThrow({
            where: { AND: [{ school_id }, { curr_active: true }] },
            orderBy: {
                id: 'desc'
            }
        });
        res.status(200).json({ success: true, data: findAcademic })
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(get);