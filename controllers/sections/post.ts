import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


// @ts-ignore
const post = async (req, res, refresh_token) => {

  let { name, class_id, std_entry_time, std_exit_time } = req.body;

  let query = {
    name,
    class_id
  };

  if(std_entry_time) query["std_entry_time"] = new Date(std_entry_time)
  if(std_exit_time) query["std_exit_time"] = new Date(std_exit_time)

  const class_ = await prisma.class.findUnique({
    where: {

      id: parseInt(req.body.class_id),
      // school_id: parseInt(refresh_token.school_id)
    }
  });
  if (class_ && class_.has_section == false) {
    const section_id = await prisma.section.findFirst({
      where: {
        class_id: class_.id
      }
    });
    
    delete query.class_id;

    await prisma.section.update({
      where: {
        id: section_id.id
      },
      data: query
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
