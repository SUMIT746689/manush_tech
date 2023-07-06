import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {
    const { from_date, to_date, payment_method } = req.query;

    const totalamountCal: Array<any> = await prisma.$queryRaw`SELECT
  vouchers.type,
  
  SUM(transactions.amount) AS totalAmmout
FROM
  transactions
  INNER JOIN vouchers ON transactions.voucher_id = vouchers.id
WHERE
(transactions.created_at) >= ${dayjs(from_date).format('YYYY-MM-DD')}
  AND (transactions.created_at) <= ${dayjs(to_date).format('YYYY-MM-DD')}
  ${payment_method ? Prisma.sql`AND transactions.payment_method = ${payment_method}` : Prisma.empty} 
  AND vouchers.type IN ('credit', 'debit')
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


    res.status(200).json({ data: [totalamount], success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get) 