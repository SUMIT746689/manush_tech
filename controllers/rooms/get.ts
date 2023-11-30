import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

// @ts-ignore
export default async function get(req, res,refresh_token) {
  try {
    

    const response = await prisma.room.findMany({
      where: {
        school_id: refresh_token.school_id,
         deleted_at: null,
      }
    });

    if (response) return res.json({ success: true, rooms: response });
    else throw new Error('Invalid to create school');

    // } else throw new Error('provide valid data');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
