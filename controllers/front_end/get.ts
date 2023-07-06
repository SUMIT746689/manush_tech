import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function get(req, res) {
  try {
    console.log({ req: req.headers.host });

    // console.log({protocol: req.headers["x-forwarded-proto"]});
    const findSchool = await prisma.school.findFirstOrThrow({
      where: { domain: { equals: req.headers.host } },
      include: { websiteui: true }
    });
    const ui = await prisma.websiteUi.findFirst({
      where: { school_id: findSchool.id }
    });
    res.status(200).json(ui);
  } catch (error) {
    res.status(404).json({ Error: error.message });
  }
}

