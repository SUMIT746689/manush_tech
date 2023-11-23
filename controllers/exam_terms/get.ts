import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

// @ts-ignore
async function get(req, res, refresh_token) {
  try {

    const { school_id } = refresh_token;

    if (!school_id) throw new Error('invalid user');

    const response = await prisma.examTerm.findMany({
      where: {
        school_id,
        deleted_at: null
      }
    });

    if (response) return res.json({ success: true, data: response });
    else throw new Error('Invalid to create school');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)