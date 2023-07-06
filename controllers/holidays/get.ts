import {  Prisma, PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function get(req, res) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    console.log({ refresh_token });


    if (refresh_token.school_id) {
      const response = await prisma.holiday.findMany({
        where: { school_id: refresh_token.school_id }
      });

      if (response) return res.json({ data: response, success: true });
      else throw new Error('Invalid to find school');
    }
    else if (refresh_token.role.title == 'SUPER_ADMIN') {
      const response = await prisma.subscription.findMany({
        where: {
          is_active: true
        },
        select: {
          school: {
            select: {
              name: true
            }
          },
          end_date: true
        }
      })
      // const response = await prisma.$queryRaw(
      //   Prisma.sql`select schools.name,subscriptions.end_date,subscriptions.is_active from subscriptions inner join schools on schools.id = subscriptions.school_id && subscriptions.is_active = true`
      // )
      console.log("XXXXXXXXXXXXXXXXXXX___",response);

      if (response) return res.json({ data: response, success: true });
      else throw new Error('Invalid to find school');
    }
    else {
      throw new Error('provide valid data');
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
