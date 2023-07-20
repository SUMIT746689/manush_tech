import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function get(req, res) {
  try {
    console.log("hitted!!");
    
    console.log({ req: req.headers.host });

    // console.log({protocol: req.headers["x-forwarded-proto"]});
    const findSchool = await prisma.school.findFirst({
      where: { domain: { equals: req.headers.host } },
      include: { websiteui: true }
    });

    if (!findSchool) {
      if (!req.cookies.refresh_token)
        throw new Error('refresh token not founds');

      const refresh_token: any = refresh_token_varify(
        req.cookies.refresh_token
      );

      if (!refresh_token) throw new Error('invalid user');

      const ui = await prisma.websiteUi.findFirst({
        where: { school_id: refresh_token.school_id }
      });
      res.status(200).json(ui);
    }
    else {
      const ui = await prisma.websiteUi.findFirst({
        where: { school_id: findSchool.id }
      });
      res.status(200).json(ui);
    }

  } catch (error) {
    res.status(404).json({ Error: error.message });
  }
}

