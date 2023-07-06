import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {
    const { from_date, to_date } = req.query;

    const where = { school_id: refresh_token.school_id, created_at: {} };

    if (from_date) where['created_at']['gte'] = new Date(from_date);
    if (to_date) where['created_at']['lte'] = new Date(to_date);

    const findSchool = await prisma.transaction.findMany({
      where: {
        ...where,
        voucher: {
          type: 'debit'
        }
      },
      include: { voucher: true }
    });
    const totalAmount = await prisma.transaction.aggregate({
      where: {
        ...where,
        voucher: {
          type: 'debit'
        }
      },
      _sum: {
        amount: true
      }
    })

    res.status(200).json({ data: findSchool, success: true, totalAmount });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get) 