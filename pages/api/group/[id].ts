import prisma from "@/lib/prisma_client";

const section = async (req, res) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);

    switch (method) {
      case 'GET':
        const group = await prisma.group.findUnique({
          where: {
            id: id
          }
          // include: {

          // }
        });
        res.status(200).json(group);
        break;
      case 'PATCH':
        const { title, class_id } = req.body;

        const quries = {
          where: {
            id
          },
          data: {}
        };

        if (title) quries.data['title'] = title;
        if (class_id) quries.data['class_id'] = class_id;

        await prisma.group.update({
          ...quries
        });
        res.status(200).json({ success: 'successfully updated' });
        break;

      case 'DELETE':
        await prisma.group.delete({
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
