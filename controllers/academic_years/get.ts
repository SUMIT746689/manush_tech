import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function get(req, res,refresh_token) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });

    if (!user.school_id) throw new Error('provide valid data');
    
    // @ts-ignore
    const response = await prisma.academicYear.findMany({
      where: { school_id: user.school_id,deleted_at:null }
    });

    if (response) return res.json({ data: response, success: true });
    else throw new Error('Invalid to find school');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)