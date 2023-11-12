import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        req.query
        let query = {
          where: {
            school_id: refresh_token.school_id
          }
        };
        const resAddMarks = await prisma.examAddtionalMark.findMany({
          where: { exam_id: req.query.exam_id ? parseInt(req.query.exam_id) : undefined }
        });
        res.status(200).json(resAddMarks);
        break;
      case 'POST':
        const { school_id } = refresh_token;
        if (!school_id) throw new Error("permission denied")
        console.log({ body: req.body })
        const { exam_id, addtional_mark_id } = req.body;
        console.log({ total_mark, exam_id })
        if (!exam_id || !total_mark || !addtional_mark_id) throw new Error("required field missing")
        const datas =
          await prisma.examAddtionalMark.createMany({
            data: {
              addtional_mark_id,
              total_mark,
              exam_id,
            }
          });
        res.status(200).json({ message: 'Addtional marking catagory created successfully' });
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

export default authenticate(index);
