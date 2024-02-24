import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const data = await prisma.role.findMany({
          where: {
            AND: [
              {
                title: {
                  not: 'ASSIST_SUPER_ADMIN',
                }
              },
              {
                title: {
                  not: 'ADMIN',
                }
              },
            ]
          }
        })
        res.status(200).json(data);

        break;
      default:
        res.setHeader('Allow', ['GET']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default index;
