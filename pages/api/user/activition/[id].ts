import { PrismaClient } from '@prisma/client';
import { patch } from 'controllers/users/activation/patch';

const prisma = new PrismaClient();

const id = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {  
      case 'PATCH':
        patch(req, res);
        break;
      default:
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default id;
