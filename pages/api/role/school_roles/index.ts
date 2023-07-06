import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const data = await prisma.role.findMany({
          where: {
            title: {
              not: 'SUPER_ADMIN',
            }
          }
        })
        res.status(200).json({data,success: true});

        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default index;
