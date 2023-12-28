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
            school_id: refresh_token.school_id
          }
        };
        const resAddMarkingCat = await prisma.addtionalMarkingCategories.findMany(query);
        res.status(200).json(resAddMarkingCat);
        break;
      case 'POST':
        const { school_id } = refresh_token;
        if (!school_id) throw new Error("permission denied")
        const { title } = req.body;
        console.log({ title })
        if (!title) throw new Error("required field missing")

        await prisma.addtionalMarkingCategories.createMany({
          data: {
            title,
            school_id
          }
        });
        res.status(200).json({ message: 'Addtional marking catagory created successfully' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index);
