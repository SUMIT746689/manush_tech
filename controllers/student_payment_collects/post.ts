import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export const post = async (req, res, refresh_token) => {
  try {
    const { student_id, fee_id, payment_method, collected_by_user,transID }: any = req.body;
    const collected_amount = parseFloat(req.body.collected_amount);

    if (!student_id || !fee_id || !collected_amount)
      throw new Error('provide valid informations');

    const fee = await prisma.fee.findFirst({
      where: { id: fee_id }
    });
    const isAlreadyAvaliable = await prisma.studentFee.aggregate({
      where: {
        student_id,
        fee_id,
      },
      _sum: {
        collected_amount: true,
      },
      _max: {
        created_at: true
      }
    })
    //  return res.send(isAlreadyAvaliable)
    const voucher = await prisma.voucher.findFirst({
      where: {
        resource_type: 'fee',
        resource_id: fee_id
      }
    })
    const data = {
      student_id,
      fee_id,
      collected_amount,
      payment_method,
      transID,
      collected_by: parseInt(collected_by_user)
    }

    const totalPaidAmount = isAlreadyAvaliable._sum.collected_amount ? isAlreadyAvaliable._sum.collected_amount : 0;

    const last_date = new Date(fee.last_date)

    const last_trnsation_date = isAlreadyAvaliable._max.created_at ? new Date(isAlreadyAvaliable._max.created_at) : new Date();

    const late_fee = fee.late_fee ? fee.late_fee : 0;

    if (last_trnsation_date > last_date) {

      if (totalPaidAmount === fee.amount + late_fee) throw new Error('Already Paid in Late');

      else if (totalPaidAmount < fee.amount + late_fee) {
        if (collected_amount + totalPaidAmount > fee.amount + late_fee) throw new Error(`Only pay ${fee.amount + late_fee - totalPaidAmount} !`)
        else {
          const temp = await prisma.studentFee.create({
            data
          });
          await prisma.transaction.create({
            data: {
              amount: data.collected_amount,
              payment_method: data.payment_method,
              voucher_id: voucher.id,
              transID,
              school_id: refresh_token.school_id,
              created_at: temp.created_at
            }
          })
          res.status(200).json({
            success: true
          })
        }

      }
    }
    else {
      if (totalPaidAmount === fee.amount) throw new Error('Already Paid !')
      else if (totalPaidAmount + collected_amount > fee.amount) throw new Error(`you paid ${totalPaidAmount},now pay ${fee.amount - totalPaidAmount} amount !`)
      else {
        const temp = await prisma.studentFee.create({
          data
        });
        await prisma.transaction.create({
          data: {
            amount: data.collected_amount,
            payment_method: data.payment_method,
            voucher_id: voucher.id,
            school_id: refresh_token.school_id,
            transID,
            created_at: temp.created_at
          }
        })
        res.status(200).json({
          success: true
        });
      }
    }

  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
