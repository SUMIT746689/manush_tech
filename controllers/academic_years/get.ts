import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function get(req, res, refresh_token) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });

    if (!user.school_id) throw new Error('provide valid data');

    // @ts-ignore
    const response = await prisma.academicYear.findMany({
      where: { school_id: user.school_id, deleted_at: null }
    });

    if (!response) throw new Error('Invalid to find school');
    res.json({ data: response, success: true });
  
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)