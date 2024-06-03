import prisma from '@/lib/prisma_client';

import { academicYearVerify, authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { from_date, to_date } = req.query;

        const isoFromDate = new Date(new Date(from_date).setHours(0, 0, 0, 0)).toISOString();
        const isoToDate = new Date(new Date(to_date).setHours(23, 59, 59, 999)).toISOString();

        if (!from_date || !to_date) throw new Error('required fields is not founds');

        // const expenseData = await prisma.transaction.aggregate({
        //   _sum: {
        //     voucher_amount: true
        //   },
        //   where: {
        //     created_at: {
        //       gte: isoFromDate,
        //       lte: isoToDate
        //     },
        //     voucher_type: 'credit'
        //   }
        // });
        // const incomeData = await prisma.studentFee.findMany({
        //   select: {
        //     transaction: true,
        //     other_fee_name: true
        //   }
        // });

        // const incomeData = await prisma.transaction.findMany({
        //   include: {
        //     voucher: true
        //   }
        // });

        const incomeData = await prisma.transaction.findMany({
          where: {
            created_at: {
              gte: isoFromDate,
              lte: isoToDate
            },
            voucher_type: 'credit'
          },
          include: {
            voucher: true
          }
        });

        const result = incomeData.reduce(
          (acc, transaction) => {
            const resourceType = transaction.voucher.resource_type;
            const amount = transaction.amount;

            if (resourceType === 'fee' || resourceType === 'studentFee') {
              acc.fees += amount;
            } else {
              acc.other_fees += amount;
            }

            return acc;
          },
          { fees: 0, other_fees: 0 }
        );

        res.status(200).json({
          message: 'success',
          result
        });
        break;

      default:
        res.setHeader('Allow', ['GET']);
        logFile.error(`Method ${method} Not Allowed`);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(academicYearVerify(index));
