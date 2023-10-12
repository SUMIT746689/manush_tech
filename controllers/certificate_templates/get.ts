import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function get(req, res, refresh_token) {
  try {
    const { user_type } = req.query;

    const where = {
      school_id: Number(refresh_token.school_id)
    }
    if (user_type) where["user_type"] = user_type;
    
    const response = await prisma.certificateTemplate.findMany({
      where
    })

    res.json({ data: response, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)