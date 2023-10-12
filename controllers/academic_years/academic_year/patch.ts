import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function patch(req, res) {
  try {
    const { id } = req.query;
    const { title } = req.body;

    if (!title) throw new Error('provide valid data');
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

      const refresh_token: any = refresh_token_varify(
        req.cookies.refresh_token
      );

      if (!refresh_token) throw new Error('invalid user');

      // @ts-ignore
      const response = await prisma.academicYear.update({
        where: {
          id : parseInt(id)
        },
        data: {
          title
        }
      });
      if (response) return res.json({ success: true });
      else throw new Error('Invalid to create school');
    
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
