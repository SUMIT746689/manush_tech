import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();
// @ts-ignore
export const get = async (req, res) => {
  try {
    // console.log("request domain__", req.headers.host);
    let query = {}

    if (!req.cookies.refresh_token) {
      query = {
        school:{
          domain: req.headers.host
        }
      }

    }
    else {
      console.log("req.cookies.refresh_token___", req.cookies.refresh_token);

      const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

      if (!refresh_token || !refresh_token.school_id) throw new Error('invalid user');
      else query = {
        school_id: refresh_token.school_id
      }
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        ...query,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            school_id: true,
            school: true
          }
        }
      }
    });
    
    res.status(200).json(teachers);
  } catch (err) {
    console.log(err);
    res.status(400).json(err)

  }

};
