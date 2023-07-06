import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function get(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token || !refresh_token.school_id) throw new Error('invalid user');
    const where = {
      school_id: refresh_token.school_id, 
    }
    if (req.query.academic_year_id) {
      where['academic_year_id'] = parseInt(req.query.academic_year_id)
    }

    //@ts-ignore
    const fee = await prisma.fee.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    // delete user['password'];
    res.status(200).json({ data: fee, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
