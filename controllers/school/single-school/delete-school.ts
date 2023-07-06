import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function deleteSchool(req, res,refresh_token) {
  try {
    const id = parseInt(req.query.id);

    if (!id) return res.status(404).json({ message: 'valid id required' });

    const school = await prisma.school.delete({
      where: {
        id: id
      }
    });
    if (!school)
      return res.status(404).json({ error: 'falied to delete school' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
