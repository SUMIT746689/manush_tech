import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {
    if (!refresh_token.school_id) throw new Error("permission denied");
    const { is_active } = req.query;
    const where = { school_id: Number(refresh_token.school_id) };
    if (is_active) where["is_active"] = is_active === "true" ? true : false;
    console.log({where})
    const response = await prisma.smsGateway.findMany({ where })

    return res.json({ data: response, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)