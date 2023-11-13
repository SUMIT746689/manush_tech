import prisma from "@/lib/prisma_client";
import { unique_tracking_number } from "@/utils/utilitY-functions";


const handleTransaction = ({ data, account, voucher, refresh_token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (trans) => {
        const temp = await trans.studentFee.create({
          data
        });
        const tr = await trans.transaction.create({
          data: {
            amount: data.collected_amount,
            account_id: account.id,
            payment_method_id: account?.payment_method[0]?.id,
            voucher_id: voucher.id,
            transID: data.transID,
            school_id: refresh_token.school_id,
            created_at: temp.created_at,
            payment_method: account?.payment_method[0]?.title,
            account_name: account.title,
            acccount_number: account.account_number,
            voucher_type: voucher.type,
            voucher_name: voucher.title,
            voucher_amount: voucher.amount,
            tracking_number: unique_tracking_number('st-')
          }
        })
        console.log({ tr });

        const transaction_amount = data.collected_amount

        await trans.accounts.update({
          where: {
            id: account.id
          },
          data: {
            balance: account.balance + transaction_amount
          }
        })
        resolve({ tracking_number: tr.tracking_number, created_at: temp.created_at, })
      })

    } catch (err) {
      reject(new Error(`${err.message}`))
    }
  })
}
export const post = async (req, res, refresh_token) => {
  try {
    const { student_id, fee_id,
      account_id,
      payment_method_id,
      collected_by_user,
      transID }: any = req.body;
    const collected_amount = parseFloat(req.body.collected_amount);

    if (!student_id || !fee_id || !collected_amount) throw new Error('provide valid informations');
    const voucher = await prisma.voucher.findFirstOrThrow({
      where: {
        resource_type: 'fee',
        resource_id: fee_id
      }
    })
    const account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: Number(account_id)
      },
      include: {
        payment_method: {
          where: {
            id: Number(payment_method_id)
          }
        }
      }
    })
    const fee = await prisma.fee.findFirst({
      where: { id: fee_id }
    });


    const AllDiscount = await prisma.student.findFirst({
      where: {
        id: student_id,
      },
      select: {
        discount: true
      }
    })
    console.log("AllDiscount__", AllDiscount);

    const discount = AllDiscount?.discount?.filter(i => i.fee_id == fee_id);
    console.log("discount1__", discount);

    const totalDiscount = discount.reduce((a, c) => {
      if (c.type == 'percent') return a + (c.amt * fee.amount) / 100
      else return a + c.amt
    }, 0)
    console.log(fee.amount, "totalDiscount___", totalDiscount);

    const feeAmount = fee.amount - totalDiscount;

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

    const data = {
      student_id,
      fee_id,
      collected_amount,
      account_id,
      payment_method_id,
      payment_method: account?.payment_method[0]?.title,
      transID,
      collected_by: Number(collected_by_user)
    }

    const totalPaidAmount = isAlreadyAvaliable._sum.collected_amount ? isAlreadyAvaliable._sum.collected_amount : 0;

    const last_date = new Date(fee.last_date)

    const last_trnsation_date = isAlreadyAvaliable._max.created_at ? new Date(isAlreadyAvaliable._max.created_at) : new Date();

    const late_fee = fee.late_fee ? fee.late_fee : 0;

    // console.log(totalPaidAmount, '     ', collected_amount, '     ', feeAmount);

    if (last_trnsation_date > last_date) {

      if (totalPaidAmount >= feeAmount + late_fee) throw new Error('Already Paid in Late');

      else if (totalPaidAmount < feeAmount + late_fee) {
        if (collected_amount + totalPaidAmount > feeAmount + late_fee) throw new Error(`Only pay ${feeAmount + late_fee - totalPaidAmount} !`)
        else {
          const tr = await handleTransaction({ data, account, voucher, refresh_token })
          res.status(200).json({
            success: true,
            // @ts-ignore
            tracking_number: tr?.tracking_number,
             // @ts-ignore
            created_at: tr?.created_at
          })
        }

      }
    }
    else {
      if (totalPaidAmount === feeAmount) throw new Error('Already Paid !')
      else if (totalPaidAmount + collected_amount > feeAmount) throw new Error(`you paid ${totalPaidAmount},now pay ${feeAmount - totalPaidAmount} amount !`)
      else {
        const tr = await handleTransaction({ data, account, voucher, refresh_token })
        res.status(200).json({
          success: true,
          // @ts-ignore
          tracking_number: tr?.tracking_number,
           // @ts-ignore
          created_at: tr?.created_at
        });
      }
    }

  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
