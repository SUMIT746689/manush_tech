import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
// @ts-ignore
const get = async (req, res, refresh_token) => {
  try {
    // console.log("request domain__", req.headers.host);
    let query = {}

    // if (!req.cookies.refresh_token) {
    //   query = {
    //     school: {
    //       domain: req.headers.host
    //     }
    //   }
    // }
    // else {
      // console.log("req.cookies.refresh_token___", req.cookies.refresh_token);

      // const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);
      const {school_id} = refresh_token;
      if (!school_id) throw new Error('invalid user');
      
      else query = {
        school_id: refresh_token.school_id
      }
    // }

    const teachers = await prisma.otherUsersInfo.findMany({
      where: {
        ...query,
        deleted_at: null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            school_id: true,
            school: true,
            user_role: true,
          }
        },
      }
    });

    res.status(200).json(teachers);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }

};

export default authenticate(get)
