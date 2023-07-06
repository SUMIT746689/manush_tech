import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

const index = async (req, res) => {
  try {
    const { method } = req;

    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });
    const { id } = req.query;

    switch (method) {
      case 'GET':
        const { with_students } = req.query;

        const query = {};
        query['where'] = { id: parseInt(id), school_id: user.school_id };

        if (with_students === 'true') {
          query['select'] = {
            sections: {
              select: {
                students: true
              }
            }
          };
        } else {
          query['include'] = {
            sections: true
          };
        }
        const data = await prisma.class.findFirst({
          ...query
        });
        res.status(200).json(data);
        break;

      case 'PATCH':
        const { name, code } = req.body;

        const quries = {
          where: { id: parseInt(id) },
          data: {}
        };

        if (name) quries.data['name'] = name;
        if (code) quries.data['code'] = code;

        await prisma.class.update({
          ...quries
        });
        res.status(200).json({ success: 'update successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default index;
