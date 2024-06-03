import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import { logFile } from 'utilities_api/handleLogFile';

import { new_student_fees_id, new_transaction_fees_id, account_table_update_info } from './post';

// global errors variable
let create_student_fees_table_id = null;

const errorHandleAccounts = async (resultsArr) => {
  // account.balance + data.collected_amount

  try {
    let sum = 0;
    for (let i = 0; i < resultsArr.length; i++) {
      sum = sum + resultsArr[i].account_balance - resultsArr[i].collect_amount;
    }

    const r = await prisma.accounts.update({
      where: {
        id: resultsArr[0].account_id
      },
      data: {
        balance: sum
      }
    });

    return null;
  } catch (err) {
    throw new Error("unable to update account's balance");
  }
};

// student_fee table data insert code start

const createStudentFees = ({ studentClass, collection_date, data, status, account, refresh_token, sent_sms, tracking_number }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // updated code start

      const result = await prisma.$transaction(async (prisma) => {
        const voucherData = await prisma.voucher.create({
          data: {
            title: `${data.fees_name} student fees`,
            description: data.fees_name,
            amount: data.collected_amount,
            reference: `${refresh_token.name},${refresh_token.role.title}`,
            type: 'credit',
            resource_type: 'studentFee',
            school_id: refresh_token.school_id
          }
        });
        const studentFeesData = await prisma.studentFee.create({
          data: {
            student: { connect: { id: data.student_id } },
            account: { connect: { id: data.account_id } },
            payment_method_list: { connect: { id: data.payment_method_id } },
            collected_by_user: { connect: { id: data.collected_by } },
            collected_amount: data.collected_amount,
            on_time_discount: 0,
            payment_method: data.payment_method,
            transID: data.transID,
            collection_date: collection_date,
            other_fee_name: data.fees_name,
            status,
            total_payable: data?.total_payable,
            transaction: {
              create: {
                amount: data.collected_amount, // done
                account_id: account.id, // done
                payment_method_id: account?.payment_method[0]?.id, // done
                voucher_id: voucherData.id,
                transID: data.transID, // done
                school_id: refresh_token.school_id, // done
                created_at: data.created_at, // done
                payment_method: account?.payment_method[0]?.title, // done
                account_name: account.title, // done
                acccount_number: account.account_number, // done
                voucher_type: voucherData.type,
                voucher_name: voucherData.title,
                voucher_amount: voucherData.amount,
                tracking_number: tracking_number // done
              }
            }
          }
        });

        // voucher resource_id update related code
        await prisma.voucher.update({
          where: {
            id: voucherData.id
          },
          data: {
            resource_id: studentFeesData.id
          }
        });
        // acount related code

        let sum = account.balance + data.collected_amount;

        const accountData = await prisma.accounts.update({
          where: {
            id: account.id
          },
          data: {
            balance: sum
          }
        });

        return {
          voucher_info: voucherData,
          student_fees_info: studentFeesData,
          // account_info: account,
          refresh_token: refresh_token,
          account_info_data: accountData
        };
      });

      resolve({
        other_fee_name: result.voucher_info.description,
        account_balance: result.account_info_data.balance,
        account_id: result.account_info_data.id,
        account_name: result.account_info_data.title,
        collect_amount: result.student_fees_info.collected_amount,
        created_at: result.account_info_data.created_at,
        id: result.student_fees_info.student_id,
        last_payment_date: result.student_fees_info.collection_date,
        payment_method: result.student_fees_info.payment_method,
        status: result.student_fees_info.status,
        tracking_number: tracking_number,
        transID: result.student_fees_info.transID,
        title: result.student_fees_info.other_fee_name,
        paidAmount: result.student_fees_info.collected_amount,
        amount: result.student_fees_info.collected_amount,
        late_fee: 0,
        last_date: ''
      });

      create_student_fees_table_id = result.student_fees_info.id;
    } catch (err) {
      await errorHandleAccounts(account_table_update_info);
      new_student_fees_id.forEach(async (item) => {
        await prisma.studentFee.delete({
          where: {
            id: item.id
          }
        });
      });
      new_transaction_fees_id.forEach(async (item) => {
        await prisma.transaction.delete({
          where: {
            id: item.id
          }
        });
      });
      await prisma.studentFee.delete({
        where: {
          id: create_student_fees_table_id
        }
      });
      reject(new Error(`${err.message}`));
    }
  });
};

// student_fee table data insert code end
export const post_other_fees = async (studentClass, collection_date, req, res, refresh_token, tracking_number) => {
  // updated code start

  try {
    let {
      student_id,
      // fee_id,
      account_id,
      payment_method_id,
      collected_by_user,
      transID,
      total_payable,
      sent_sms,
      collect_filter_data,
      fees_name
    }: any = req;

    // }

    const promises = collect_filter_data.map(async (item) => {
      try {
        let collected_amount = null;
        // let fee_id = item.id;
        let total_payable = item.total_payable;

        if (!item?.collected_amount) {
          collected_amount = Number(req.collected_amount);
        } else {
          collected_amount = Number(item.collected_amount);
        }

        if (!student_id || !collected_amount) {
          throw new Error('provide valid informations');
        }

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
        });

        const data = {
          student_id,
          // fee_id,
          collected_amount,
          account_id,
          payment_method_id,
          payment_method: account?.payment_method[0]?.title,
          transID,
          collected_by: Number(collected_by_user),
          total_payable: Number(total_payable),
          fees_name
        };
        let status = 'paid';

        return await createStudentFees({
          studentClass,
          collection_date,
          data,
          status,
          account,
          refresh_token,
          sent_sms,
          tracking_number
        });
      } catch (error) {
        throw new Error('failed to insert student fees');
      }
    });

    const results = await Promise.all(promises);
    const successfulResults = results.filter((result) => result !== null);

    return {
      ...successfulResults[0]
    };
  } catch (error) {
    throw new Error(error.message);
  }
  // updated code end
};
