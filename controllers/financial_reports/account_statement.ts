import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {
    const { payment_method, type, from_date, to_date } = req.query;

    const where = { school_id: refresh_token.school_id, created_at: {} };

    if (payment_method) where['payment_method'] = payment_method;
    if (type) where['voucher'] = { type };
    if (from_date) where['created_at']['gte'] = new Date(from_date);
    if (to_date) where['created_at']['lte'] = new Date(to_date);

    const findSchool = await prisma.transaction.findMany({
      where,
      include: { voucher: true }
    });

    // const totalamountCal: Array<any> = await prisma.$queryRaw(Prisma.sql`SELECT vouchers.type, SUM(transactions.amount) AS totalAmmoutDebit FROM transactions
    // LEFT JOIN vouchers
    // ON transactions.voucher_id = vouchers.id WHERE vouchers.type IN ('credit','debit') GROUP BY vouchers.type`)

    
    const totalamountCal: Array<any> = await prisma.$queryRaw`SELECT
  vouchers.type,
  SUM(transactions.amount) AS totalAmmout
FROM
  transactions
  INNER JOIN vouchers ON transactions.voucher_id = vouchers.id
WHERE
(transactions.created_at) >= ${dayjs(from_date).format('YYYY-MM-DD')}
  AND (transactions.created_at) <= ${dayjs(to_date).format('YYYY-MM-DD')}
${type == 'credit' ? Prisma.sql`AND vouchers.type = 'credit'` : type == 'debit' ? Prisma.sql`AND vouchers.type = 'debit'` : Prisma.empty}
${payment_method ? Prisma.sql`AND transactions.payment_method = ${payment_method}` : Prisma.empty}
  AND  vouchers.type IN ('credit', 'debit')
GROUP BY
  vouchers.type`

    const totalamount = {}

    for (const i of totalamountCal) {
      totalamount[i.type] = i.totalAmmout
    }
    if (!totalamount['credit']) {
      totalamount['credit'] = 0
    }
    if (!totalamount['debit']) {
      totalamount['debit'] = 0
    }
    res.status(200).json({ data: findSchool, success: true, totalamount });


  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get) 