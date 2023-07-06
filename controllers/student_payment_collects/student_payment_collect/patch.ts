import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const patch = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('Id is not provided');
    const { student_id, fee_id }: any = req.body;

    if (!student_id && !fee_id) throw new Error('provide valid informations');

    const student_fee = await prisma.studentFee.update({
      where: { id: Number(id) },
      data: {
        student_id: student_id,
        fee_id: fee_id
      }
    });

    res.status(200).json({ user: student_fee, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
