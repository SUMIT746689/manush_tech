import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';

const post = async (req, res, refresh_token) => {
  try {
    const { title, description, amount, reference, type, resource_id, resource_type } = req.body;
    await prisma.voucher.create({
      data: {
        title, description, amount, reference,
        type, resource_id, resource_type,
        school_id: refresh_token.school_id
      }
    })
    res.status(200).json({ message: 'New voucher created !' });
  } catch (err) {
    console.log({ err });
    res.status(404).json({ err: err.message });
  }
};
export default authenticate(post)


