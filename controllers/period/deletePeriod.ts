import prisma from '@/lib/prisma_client';

async function deletePeriod(req, res, refresh_token) {
    try {

        const id = Number(req.query.day);

        await prisma.period.delete({
            where: {
                id: id,
                // school_id: refresh_token?.school_id
            },
        })
        res.status(200).json({ message: 'Period deleted successfully' })
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}
export default (deletePeriod) 