import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        let query = {
          where: {
            class: {
              school_id: refresh_token.school_id
            }
          }
        };
        if (req.query.class_id)
          query.where['class_id'] = parseInt(req.query.class_id);

        const subjects = await prisma.subject.findMany(query);
        res.status(200).json(subjects);
        break;
      case 'POST':
        await prisma.subject.createMany({
          data: req.body.data
        });
        res.status(200).json({ message: 'Subject created successfully' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index);
