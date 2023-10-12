import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const get = async (req: any, res: any, authenticate_user) => {
  try {
    const response = await prisma.requestPackage.findMany({
      include: { school: true, package: true }
    });

    if (!response) throw new Error('failed to update');
    res.status(200).json(response);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};

export default authenticate(get);
