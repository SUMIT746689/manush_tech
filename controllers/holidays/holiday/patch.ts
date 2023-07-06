import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function patch(req, res) {
  try {
    const { id } = req.query;
    const { title, date } = req.body;

    if (title && date) {
      if (!req.cookies.refresh_token)
        throw new Error('refresh token not founds');

      const refresh_token: any = refresh_token_varify(
        req.cookies.refresh_token
      );

      if (!refresh_token && !refresh_token.school_id) throw new Error('invalid user');

      if( !title || !date) throw new Error('Provide notings to update ');
      const response = await prisma.holiday.updateMany({
        where: {
          AND: [
            {id:parseInt(id)},
            {school_id: refresh_token.school_id}
          ]
        },
        data: {
          title,
          date,
        }
      });
      if (response) return res.json({ success: true });
      else throw new Error('Invalid to create school');
    } else throw new Error('provide valid data');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
