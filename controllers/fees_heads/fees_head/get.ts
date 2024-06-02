import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


// @ts-ignore
const get = async (req, res, refresh_token) => {
    try {
        const { school_id } = refresh_token;
        const { title, frequency } = req.body;
        const { id, get_fees_month } = req.query
        const parseId = parseInt(id);

        if (!Number.isInteger(parseId)) throw new Error('invalid fees head id')

        const resp = await prisma.fee.findMany({
            where: { fees_head_id: parseId },
            select: {
                fees_month: true,
            }
        });
        const monthList = [...new Set(resp.map(val => val.fees_month))];
        res.status(200).json(monthList);
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
};

export default authenticate(get);
