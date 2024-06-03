import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function get(req, res, refresh_token) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');


    const response = await prisma.subscription.findMany({
      where: {
        is_active: true
      },
      select: {
        school: {
          select: {
            name: true
          }
        },
        end_date: true
      }
    })

    res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)