import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function get(req, res) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    if (refresh_token.school_id) {
      const response = await prisma.holiday.findMany({
        where: { school_id: refresh_token.school_id }
      });

      if (response) return res.json({ data: response, success: true });
      else throw new Error('Invalid to find school');
    }
    else if (refresh_token.role.title == 'SUPER_ADMIN') {
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
      
      if (response) return res.json({ data: response, success: true });
      else throw new Error('Invalid to find school');
    }
    else {
      throw new Error('provide valid data');
    }
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
