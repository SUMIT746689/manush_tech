
import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const index = async (req, res) => {
  try {
    const { method } = req;
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

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

export default index;
