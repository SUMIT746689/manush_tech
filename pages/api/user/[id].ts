import { PrismaClient } from '@prisma/client';
import { patch } from 'controllers/users/user/patch';

const prisma = new PrismaClient();

const id = async (req, res) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);
    switch (method) {
      case 'GET':
        if (!id) {
          res.status(400).json({ message: 'valid id required' });
          break;
        }
        const user = await prisma.user.findUnique({
          where: {
            id: id
          },
          select: {
            id: true,
            username: true,
            role: {
              include: {
                permissions: true
              }
            },
            role_id: true,
            school_id: true,
            permissions: true
          }
        });
        if (!user.permissions.length && user.role_id) {
          user['permissions'] = user.role.permissions;
          delete user['role']['permissions'];
        }
        res.status(200).json(user);
        break;

      case 'PATCH':
        patch(req, res);
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

export default id;
