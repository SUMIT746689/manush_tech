import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';


const prisma = new PrismaClient();

export const get = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) throw new Error('provide student_id');

    const student_fee = await prisma.studentFee.findMany({
      where: { student_id: Number(id) },
      include: {
        fee: true
      }
    });

    const all_fees = await prisma.student.findFirst({
      where: { id: Number(id) },
      select: {
        class_registration_no: true,
        class_roll_no: true,
        discount: true,
        student_info: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
          }
        },
        section: {
          select: {
            class: {
              select: {
                fees: true
              }
            }
          }
        }
      }
    });


    const fees = all_fees.section.class.fees.map((fee) => {
      const findStudentFee: any = student_fee.filter(pay_fee => pay_fee.fee.id === fee.id);

      // const isAlreadyAvaliable = await prisma.studentFee.aggregate({
      //   where: {
      //     student_id,
      //     fee_id,
      //   },
      //   _sum: {
      //     collected_amount: true,

      //   },

      // })


      // console.log("fee", fee);

      const findStudentFeeSize = findStudentFee.length
      if (findStudentFeeSize) {
        const paidAmount = findStudentFee.reduce((a, c) => a + c.collected_amount, 0)
        // console.log("paidAmount__", paidAmount);
        const last_date = dayjs(fee.last_date).valueOf()
        const last_trnsation_date = dayjs(findStudentFee[findStudentFeeSize - 1].created_at).valueOf()
        const late_fee = fee.late_fee ? fee.late_fee : 0;


        if (last_trnsation_date > last_date && fee.amount == paidAmount) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'Fine unpaid',paidAmount })
        }
        else if (last_trnsation_date > last_date && paidAmount >= fee.amount + late_fee) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid late',paidAmount })
        }

        else if (last_date >= last_trnsation_date && fee.amount == paidAmount) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid' })
        }
        else {
          return ({
            ...fee,
            last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at,
            paidAmount: paidAmount,
            status: 'partial paid'
          })
        }

      }
      else return ({ ...fee, status: 'unpaid' })
    })
    const data = {
      ...all_fees.student_info,
      class_registration_no: all_fees.class_registration_no,
      class_roll_no: all_fees.class_roll_no,
      discount: all_fees.discount,
      fees
    };
    console.log({ data });


    res.status(200).json({ data, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
