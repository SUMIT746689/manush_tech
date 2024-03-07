import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function getHandler(req, res, authenticate_user) {
  try {
    const { role, admin_panel_id } = authenticate_user

    if (role?.title !== 'ASSIST_SUPER_ADMIN') throw new Error('Your role have no permissions');

    const schools = await prisma.school.findMany({
      where: {
        admin_panel_id,
      },
      select: {
        id: true,
        name: true
      }
    });
    res.status(200).json(schools);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(getHandler);
