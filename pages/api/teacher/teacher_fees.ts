import prisma from '@/lib/prisma_client';
import { academicYearVerify, authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token, academic_year) => {
  try {
    const { method } = req;

    switch (method) {
      case 'PATCH':
        const { id, deleted_at } = req.body;

        await prisma.teacherSalaryStructure.update({
          where: { id: id },
          // @ts-ignore
          data: { deleted_at: deleted_at }
        });

        res.status(204).json({
          status: 'success'
        });
        break;
      case 'POST':
        //const { school_id } = refresh_token;
        const { percentage_amount, fixed_amount, teacher_id, school_id, section_id, subject_id, class_id, payment_type } = req.body;
        const feesObj = {};
        if (payment_type === 'percentage' && percentage_amount) {
          feesObj['percentage_amount'] = percentage_amount;
        } else if (payment_type === 'flat' && fixed_amount) {
          feesObj['fixed_amount'] = fixed_amount;
        }

        // Ensure all required fields are provided
        if (!teacher_id || !school_id || !section_id || !subject_id || !class_id || !payment_type) {
          throw new Error('Missing required fields');
        }

        // check if teacher have already selected subject

        const existSelectedSubject = await prisma.teacherSalaryStructure.findFirst({
          where: {
            teacher_id: teacher_id,
            subject_id: subject_id,
            deleted_at: null
          }
        });

        if (existSelectedSubject?.deleted_at && existSelectedSubject?.deleted_at === null) {
          throw new Error('This subject is already selected for this teacher');
        }

        // insert data
        const salaryInformation = await prisma.teacherSalaryStructure.create({
          // @ts-ignore
          data: {
            ...feesObj,
            teacher_id: teacher_id,
            school_id: school_id,
            section_id: section_id,
            subject_id: subject_id,
            class_id: class_id,
            payment_type: payment_type
          }
        });

        res.status(200).json({
          status: 'success',
          salaryInfo: salaryInformation
        });

        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        logFile.error(`Method ${method} Not Allowed`);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(academicYearVerify(index));
