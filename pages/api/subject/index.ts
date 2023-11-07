import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res,refresh_token) => {
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

        const sections = await prisma.subject.findMany(query);
        res.status(200).json(sections);
        break;
      case 'POST':
        await prisma.subject.createMany({
          data: req.body.data
        });
        res.status(200).json({ message: 'Subject created successfully' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index) ;
