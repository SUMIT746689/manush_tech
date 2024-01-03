import prisma from "@/lib/prisma_client";
import { authenticate } from 'middleware/authenticate';
import { logFile } from "utilities_api/handleLogFile";

const id = async (req, res, refresh_token) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);

    switch (method) {
      case 'GET':
        const group = await prisma.group.findUnique({
          where: {
            id: id,
            class: {
              school_id: refresh_token?.school_id
            }
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
        res.status(200).json({ success: 'Group Successfully updated' });
        break;

      case 'DELETE':
        await prisma.group.delete({
          where: {
            id: id,
            class: {
              school_id: refresh_token?.school_id
            }
          }
        });
        res.status(200).json({ success: 'Group deleted successfully!' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(id);
