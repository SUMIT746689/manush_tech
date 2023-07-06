import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const section = async (req, res) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);

    switch (method) {
      case 'GET':
        const user = await prisma.section.findUnique({
          where: {
            id: id
          }
          // include: {

          // }
        });
        res.status(200).json(user);
        break;
      case 'PATCH':
        const { name, class_id, class_teacher_id, group_ids } = req.body;

        const quries = {
          where: {
            id
          },
          data: {}
        };

        if (name) quries.data['name'] = name;
        if (class_id) quries.data['class_id'] = class_id;
        if (class_teacher_id)
          quries.data['class_teacher_id'] = class_teacher_id;
        if (group_ids) {
          quries.data['groups'] = { connect: group_ids.map((id) => ({ id })) }
        } else {
          // quries['groups'] = { connect: { id: group_id } };
          // quries.data['group_id'] = null;
        }
        await prisma.section.update({
          ...quries
        });
        res.status(200).json({ success: 'successfully updated' });
        break;

      case 'DELETE':
        await prisma.section.delete({
          where: {
            id: id
          }
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default section;
