import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;
    const { lower_mark, upper_mark, point, grade, academic_year_id } = req.body;
    switch (method) {
      case 'GET':
        const { } = req.query;
        const data = await prisma.gradingSystem.findMany({
          where: {
            school_id: refresh_token.school_id,
            academic_year_id: Number(req.query.academic_year_id)
          },
          orderBy: {
            point: 'desc'
          }
        });
        // console.log("grade__", data);

        res.status(200).json(data);
        break;
      case 'POST':

        await prisma.gradingSystem.create({
          data: {
            lower_mark,
            upper_mark,
            point,
            grade,
            school_id: refresh_token.school_id,
            academic_year_id
          }
        })
        res.status(200).json({ message: 'Grad created succesfully' });
        break;
      case 'PATCH':
        const grade_id = Number(req.query.grade_id);
        const flag = await prisma.gradingSystem.findFirst({
          where: {
            id: grade_id,
            school_id: refresh_token.school_id,

          }
        })
        if (!flag || flag && flag.id !== grade_id) {
          throw new Error('Bad request !')
        }

        await prisma.gradingSystem.update({
          where: {
            id: grade_id,
          },
          data: {
            lower_mark,
            upper_mark,
            point,
            grade,
            academic_year_id
          }
        })
        res.status(200).json({ message: 'Grade updated succesfully' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index);