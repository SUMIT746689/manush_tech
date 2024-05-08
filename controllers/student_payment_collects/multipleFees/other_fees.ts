import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import { logFile } from 'utilities_api/handleLogFile';

import {
  new_student_fees_id,
  new_transaction_fees_id,
  account_table_update_info
} from './post';

// global errors variable
let create_student_fees_table_id = null;
let create_voucher_table_id = null;
let create_transaction_table_id = null;

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

// accounts table update code start
const handleAccounts = async (amount_obj) => {
  // account.balance + data.collected_amount

  try {
    let sum =
      amount_obj.student_fees_info_obj.account_info.balance +
      amount_obj.student_fees_info_obj.student_fees_info[0].data
        .collected_amount;

    const r = await prisma.accounts.update({
      where: {
        id: amount_obj.student_fees_info_obj.account_info.id
      },
      data: {
        balance: sum
      }
    });

    return {
      other_fee_name: amount_obj.student_fees_info_obj.voucher_info.description,
      account_balance: r.balance,
      account_id:
        amount_obj.student_fees_info_obj.student_fees_info[0].account.id,
      account_name:
        amount_obj.student_fees_info_obj.student_fees_info[0].account.title,
      collect_amount:
        amount_obj.student_fees_info_obj.student_fees_info[0].collect_amount,
      created_at:
        amount_obj.student_fees_info_obj.student_fees_info[0].created_at,
      id: amount_obj.student_fees_info_obj.student_fees_info[0].student_id,
      last_payment_date:
        amount_obj.student_fees_info_obj.student_fees_info[0].last_payment_date,
      payment_method:
        amount_obj.student_fees_info_obj.student_fees_info[0].data
          .payment_method,
      status: amount_obj.student_fees_info_obj.student_fees_info[0].status,
      tracking_number: amount_obj.transaction_info.tracking_number,
      transID: amount_obj.transaction_info.transID,
      title:
        amount_obj.student_fees_info_obj.student_fees_info[0].data.fees_name,
      paidAmount:
        amount_obj.student_fees_info_obj.student_fees_info[0].data
          .collected_amount,
      amount:
        amount_obj.student_fees_info_obj.student_fees_info[0].data
          .collected_amount,
      late_fee: 0,
      last_date: ''
    };
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
    await prisma.transaction.delete({
      where: {
        id: create_transaction_table_id
      }
    });
    await prisma.studentFee.delete({
      where: {
        id: create_student_fees_table_id
      }
    });
    await prisma.voucher.delete({
      where: {
        id: create_voucher_table_id
      }
    });
    throw new Error("unable to update account's balance");
  }
};

// transaction table data insert code start
const transactionTableDataInsert = async (
  student_fees_info_obj,
  tracking_number
) => {
  try {
    // const tracking_number = unique_tracking_number('st-');
    const transaction_info = await prisma.transaction.create({
      data: {
        amount: student_fees_info_obj.student_fees_info[0].collect_amount,
        account_id: student_fees_info_obj.account_info.id,
        payment_method_id:
          student_fees_info_obj.account_info?.payment_method[0]?.id,
        voucher_id: student_fees_info_obj.voucher_info.id,
        transID: student_fees_info_obj.student_fees_info[0].transID,
        school_id: student_fees_info_obj.refresh_token.school_id,
        created_at: student_fees_info_obj.student_fees_info[0].created_at,
        payment_method:
          student_fees_info_obj.account_info?.payment_method[0]?.title,
        account_name: student_fees_info_obj.account_info.title,
        acccount_number: student_fees_info_obj.account_info.account_number,
        voucher_type: student_fees_info_obj.voucher_info.type,
        voucher_name: student_fees_info_obj.voucher_info.title,
        voucher_amount: student_fees_info_obj.voucher_info.amount,
        tracking_number: tracking_number
      }
    });
    create_transaction_table_id = transaction_info.id;

    return {
      transaction_info: transaction_info,
      student_fees_info_obj
    };
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
    await prisma.transaction.delete({
      where: {
        id: create_transaction_table_id
      }
    });
    await prisma.studentFee.delete({
      where: {
        id: create_student_fees_table_id
      }
    });
    await prisma.voucher.delete({
      where: {
        id: create_voucher_table_id
      }
    });
    throw new Error('failed to process transaction');
  }
};
// transaction table data insert code end

// voucher table data insert code start
const voucherTableDataInsert = async (student_fees_info_arr) => {
  //   console.log(student_fees_info_arr);
  //   const tempData = { fees_name:[] };
  //   student_fees_info_arr.forEach((std) => {
  //     tempData.fees_name.push(std.data.fees_name);
  //     tempData.data.
  //   });
  try {
    const voucher_data = await prisma.voucher.create({
      data: {
        title: `${student_fees_info_arr[0].data.fees_name} student fees`,
        description: student_fees_info_arr[0].data.fees_name,
        amount: student_fees_info_arr[0].data.collected_amount,
        reference: `${
          student_fees_info_arr[0].refresh_token.name
        }, ${student_fees_info_arr[0].refresh_token.role.title.toUpperCase()}`,
        type: 'credit',
        resource_type: 'studentFee',
        resource_id: student_fees_info_arr[0].student_id, // '1,2,3'
        school_id: student_fees_info_arr[0].refresh_token.school_id
      }
    });

    create_voucher_table_id = voucher_data.id;

    return {
      voucher_info: voucher_data,
      student_fees_info: student_fees_info_arr,
      account_info: student_fees_info_arr[0].account,
      refresh_token: student_fees_info_arr[0].refresh_token
    };
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
    await prisma.voucher.delete({
      where: {
        id: create_voucher_table_id
      }
    });
    throw new Error('voucher table error');
  }
};

// voucher table data insert code end
// student_fee table data insert code start

const createStudentFees = ({
  data,
  status,
  account,
  refresh_token,
  sent_sms
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const temp = await prisma.studentFee.create({
        data: {
          student: { connect: { id: data.student_id } },
          account: { connect: { id: data.account_id } },
          payment_method_list: { connect: { id: data.payment_method_id } },
          collected_by_user: { connect: { id: data.collected_by } },
          collected_amount: data.collected_amount,
          payment_method: data.payment_method,
          transID: data.transID,
          other_fee_name: data.fees_name,
          status,
          total_payable: data?.total_payable
        }
      });

      create_student_fees_table_id = temp.id;

      resolve({
        collect_amount: data.collected_amount,
        created_at: temp.created_at,
        last_payment_date: temp.created_at,
        transID: data.transID,
        status: temp.status,
        student_id: temp.id,
        account: account,
        refresh_token: refresh_token,
        sent_sms: sent_sms,
        data: data
      });
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
export const post_other_fees = async (
  req,
  res,
  refresh_token,
  tracking_number
) => {
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

        // data,
        // status,
        // account,
        // refresh_token,
        // sent_sms,
        // student_fees_info_arr

        return await createStudentFees({
          data,
          status,
          account,
          refresh_token,
          sent_sms
        });
      } catch (error) {
        throw new Error('failed to insert student fees');
      }
    });

    const results = await Promise.all(promises);

    const successfulResults = results.filter((result) => result !== null);

    if (successfulResults.length > 0) {
      const voucher_data_insert = await voucherTableDataInsert(
        successfulResults
      );

      if (
        voucher_data_insert.voucher_info !== undefined &&
        voucher_data_insert.student_fees_info !== undefined &&
        voucher_data_insert.account_info !== undefined
      ) {
        const transaction_data_insert = await transactionTableDataInsert(
          voucher_data_insert,
          tracking_number
        );

        if (
          transaction_data_insert.transaction_info !== undefined &&
          transaction_data_insert.student_fees_info_obj !== undefined
        ) {
          const calculate_result =
            (await handleAccounts(transaction_data_insert)) || {};

          if (Object.keys(calculate_result).length === 0) {
            // console.log("Object is empty");
          } else {
            return calculate_result;
          }
        } else {
          throw new Error('missing transaction related information');
        }
      } else {
        throw new Error('missing voucher related information');
      }
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
    // res.status(500).json({ error: 'Internal Server Error' });
  }
  // updated code end
};
