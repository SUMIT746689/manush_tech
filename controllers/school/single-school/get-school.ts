import prisma from "@/lib/prisma_client";

export default async function getSchool(req, res,refresh_token) {
  try {
    const id = parseInt(req.query.id);

    if (!id) res.status(400).json({ message: 'valid id required' });

    const school = await prisma.school.findUnique({
      where: {
        id: id
      }
    });
    if(!school) res.status(404).json({error: 'school not found'});
    res.status(200).json(school);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
