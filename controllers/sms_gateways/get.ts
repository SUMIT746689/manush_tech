import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function get(req, res, refresh_token) {
  try {
   
    const { is_active } = req.query;

    const where = { school_id: Number(refresh_token.school_id) };

    if (is_active) where["is_active"] = is_active === "true" ? true : false;
    
    const response = await prisma.smsGateway.findMany({ where })

    return res.json({ data: response, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)