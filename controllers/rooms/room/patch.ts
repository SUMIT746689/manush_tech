import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req, res,refresh_token) {
  try {
    
    const { id } = req.query;
    const { name } = req.body;

    if (!name && !refresh_token.school_id)
      throw new Error('provide valid data');
    const response = await prisma.room.updateMany({
      where: {
        AND: [{ id: Number(id) }, { school_id: refresh_token.school_id }]
      },
      data: {
        name
      }
    });

    if (response) return res.json({ success: true });
    else throw new Error('Invalid to update room');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
