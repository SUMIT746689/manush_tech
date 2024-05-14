import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


const get = async (req, res, refresh_token) => {
  try {
    const { school_id } = refresh_token;
    const res_fees_heads = await prisma.feesHaed.findMany({ where: { school_id }, orderBy: { id: "desc" } })

    res.status(200).json(res_fees_heads);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(get);
