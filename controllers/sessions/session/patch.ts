import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function post(req, res) {
  try {
    const { id } = req.query;
    const { title } = req.body;
    console.log({ title });

    if (title) {
      // @ts-ignore
      const response = await prisma.session.update({
        where: {
          id: Number(id),
        },
        data: {
          title
        }
      });

      if (response) return res.json({ success: true });
      else throw new Error('Invalid to update room');
    } else throw new Error('provide valid data');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
