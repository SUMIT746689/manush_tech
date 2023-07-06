import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const get = async (req, res) => {
  try {
    const { student_id, fee_id }: any = req.body;

    if (!student_id) throw new Error('provide student_id');

    const student_fee = await prisma.studentFee.findMany({
      where: { student_id },
      include: {
        student: {
          select: {
            section: {
              include: {
                class: true
              }
            },
            student_info: {
              select: {
                first_name: true,
                middle_name: true,
                last_name: true
              }
            }
          }
        },
        fee: true
      }
    });

    res.status(200).json({ data: student_fee, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
