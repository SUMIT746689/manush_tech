import prisma from '@/lib/prisma_client';

export default async function post(req, res,refresh_token) {
  try {
    const { name } = req.body;

    if (!name && !refresh_token.school_id) throw new Error('provide valid data');
    const response = await prisma.room.create({
      data: {
        name,
        school_id: refresh_token.school_id
      }
    });

    if (response) return res.json({ success: true });
    else throw new Error('Invalid to create room');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
