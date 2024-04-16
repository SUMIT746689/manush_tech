import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function get(req, res, refresh_token) {
  try {
    const { role, admin_panel_id, school_id } = refresh_token;
    const { for_all } = req.query;

    if (for_all === 'true') {
      if (role?.title !== "ASSIST_SUPER_ADMIN") throw new Error("permission denied");

      const response = await prisma.voiceGateway.findMany({
        where: {
          school: {
            admin_panel_id
          }
        },
        select: {
          id: true,
          details: true,
          school_id: true,
          school: {
            select: {
              name: true
            }
          }
        }
      });
      return res.json({ data: response, success: true });
    }

    const where = { school_id: school_id };
    const response = await prisma.voiceGateway.findMany({ where });

    return res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)