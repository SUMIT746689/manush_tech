import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();
// @ts-ignore
const post = async (req, res, refresh_token) => {
  let query = {
    name: req.body.name,
    class_id: req.body.class_id
  };

  const isSection = await prisma.class.findUnique({
    where: {
      id: parseInt(req.body.class_id)
    }
  });
  if (isSection && isSection.has_section == false) {
    const section_id = await prisma.section.findFirst({
      where: {
        class_id: isSection.id
      }
    });
    await prisma.section.update({
      where: {
        id: section_id.id
      },
      data: {
        name: req.body.name
      }
    });
    await prisma.class.update({
      where: {
        id: parseInt(req.body.class_id)
      },
      data: {
        has_section: true
      }
    });
    return res.status(200).json({ success: 'section rename successfully' });
  } else {
    if (req.body.class_teacher_id) {
      // @ts-ignore
      query = { ...query, class_teacher_id: req.body.class_teacher_id };
    }
    if (req.body.group_ids) {
      query = {
        ...query,
        //@ts-ignore
        groups: { connect: req.body.group_ids.map((id) => ({ id })) }
      };
    }

    await prisma.section.create({
      data: query
    });
    res.status(200).json({ success: 'section created successfully' });
  }
};

export default authenticate(post);
