import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function patch(req, res, refresh_token) {
  try {
    const { id } = req.query;
    const { title, date } = req.body;

    if (!title || !date) throw new Error('Provide notings to update ');
    await prisma.holiday.updateMany({
      where: {
        AND: [
          { id: parseInt(id) },
          { school_id: refresh_token.school_id }
        ]
      },
      data: {
        title,
        date,
      }
    });
    res.status(200).json({ success: true });


  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
export default authenticate(adminCheck(patch)) 