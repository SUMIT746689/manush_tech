import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req, res) {
  try {
    const { title, date } = req.body;

    if (title && date) {
      if (!req.cookies.refresh_token)
        throw new Error('refresh token not founds');

      const refresh_token: any = refresh_token_varify(
        req.cookies.refresh_token
      );

      if (!refresh_token) throw new Error('invalid user');
      console.log({ refresh_token });

      const user = await prisma.user.findFirst({
        where: { id: refresh_token.id }
      });

      const response = await prisma.holiday.create({
        data: {
          title,
          date,
          school_id: user.school_id
        }
      });
      if (response) return res.json({ success: true });
      else throw new Error('Invalid to create school');
    } else throw new Error('provide valid data');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
