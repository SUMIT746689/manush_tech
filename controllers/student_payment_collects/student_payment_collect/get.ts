import prisma from '@/lib/prisma_client';
import dayjs from 'dayjs';
import { logFile } from 'utilities_api/handleLogFile';

export const get = async (req, res) => {
  try {
    const { id, fromDate, toDate, academic_year_id } = req.query;
   

    if (!id) throw new Error('provide student_id');

    const dateFilter = {}, query = {}
    if (fromDate) dateFilter['gte'] = new Date(new Date(fromDate).setUTCHours(0, 0, 0, 0))
    if (toDate) dateFilter['lte'] = new Date(new Date(toDate).setUTCHours(23, 59, 59, 999))

    if (fromDate || toDate) query['created_at'] = dateFilter

  

    const student_fee = await prisma.studentFee.findMany({
      where: {
        student_id: Number(id),
        ...query
      },
      include: {
        fee: true,
        collected_by_user: {
          select: {
            username: true
          }
        },
        
      }
    });

    const all_fees = await prisma.student.findFirst({
      where: { id: Number(id) },
      select: {
        class_registration_no: true,
        class_roll_no: true,
        discount: true,
        waiver_fees: true,
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
                fees: {
                  where: {
                    academic_year_id: Number(academic_year_id)
                  }
                }
              }
            }
          }
        }
      }
    });

    // console.log("all_fees__", all_fees);

    const waiver_fee = all_fees?.waiver_fees?.length > 0 ? all_fees?.waiver_fees?.map(i => i.id) : [];

    const fees = all_fees.section.class.fees?.filter(i => !waiver_fee.includes(i.id))?.map((fee) => {
      console.log(fee);

      const findStudentFee: any = student_fee.filter(pay_fee => pay_fee.fee.id === fee.id);
      const late_fee = fee.late_fee ? fee.late_fee : 0;
      // console.log("fee", fee);
      // console.log("findStudentFee__", findStudentFee);

      const findStudentFeeSize = findStudentFee.length
      if (findStudentFeeSize) {
        // console.log("findStudentFee__",findStudentFee);

        const discount = all_fees?.discount?.filter(i => i.fee_id == fee.id);
        // console.log("discount1__", discount);

        const totalDiscount = discount.reduce((a, c) => {
          if (c.type == 'percent') return a + (c.amt * fee.amount) / 100
          else return a + c.amt
        }, 0)
        const feeAmount = fee.amount - totalDiscount
        fee['amount'] = feeAmount
        const paidAmount = findStudentFee.reduce((a, c) => a + c.collected_amount, 0)

        const last_date = new Date(fee.last_date)
        const last_trnsation_date = new Date(findStudentFee[findStudentFeeSize - 1].created_at)



        if (last_trnsation_date > last_date && paidAmount >= feeAmount + late_fee) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid late', paidAmount, collected_by_user: findStudentFee[findStudentFeeSize - 1]?.collected_by_user?.username })
        }
        else if (last_trnsation_date > last_date && feeAmount == paidAmount && late_fee > 0) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'fine unpaid', paidAmount, collected_by_user: findStudentFee[findStudentFeeSize - 1]?.collected_by_user?.username })
        }
        else if (last_date >= last_trnsation_date && feeAmount == paidAmount) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid', collected_by_user: findStudentFee[findStudentFeeSize - 1]?.collected_by_user?.username })
        }
        else if (paidAmount > 0) {
          return ({
            ...fee,
            last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at,
            paidAmount: paidAmount,
            status: 'partial paid',
            collected_by_user: findStudentFee[findStudentFeeSize - 1]?.collected_by_user?.username
          })
        }
        else {
          return ({ ...fee, status: 'unpaid' })
        }

      }
      else {
        const discount = all_fees?.discount?.filter(i => i.fee_id == fee.id);
        // console.log("discount1__", discount);

        const totalDiscount = discount.reduce((a, c) => {
          if (c.type == 'percent') return a + (c.amt * fee.amount) / 100
          else return a + c.amt
        }, 0)
        const feeAmount = fee.amount - totalDiscount
        fee['amount'] = feeAmount
        return ({ ...fee, status: 'unpaid' })
      }

    })

    const data = {
      ...all_fees.student_info,
      class_registration_no: all_fees.class_registration_no,
      class_roll_no: all_fees.class_roll_no,
      discount: all_fees.discount,
      fees
    };
    // console.log({ data });


    res.status(200).json({ data, success: true });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};
