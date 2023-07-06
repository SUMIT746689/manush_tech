import { Details } from '@mui/icons-material';
import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function post(req, res, refresh_token) {
  try {
    const { title,details } = req.body;

    if (!refresh_token.school_id) throw new Error("invalid user")
    if (!title || !details) throw new Error("provide valid data")

    const response = await prisma.smsGateway.create({
      data: {
        title: title,
        details: details,
        is_active: false,
        school_id: Number(refresh_token.school_id)
      }
    })

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)