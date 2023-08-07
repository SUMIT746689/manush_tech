import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


async function post(req, res, refresh_token) {
  try {
    const { name, body } = req.body;

    if (!name || !body) throw new Error("provide valid data")

    const response = await prisma.emailTemplate.create({
      data: {
        name: name,
        body: body,
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