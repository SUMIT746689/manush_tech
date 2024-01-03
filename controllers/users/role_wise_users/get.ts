import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const get = async (req, res,refresh_token) => {
  try {
    const {role_id} = req.query;
    console.log({role_id})
    const users = await prisma.user.findMany({
      where: {
        school_id: refresh_token.school_id,
        role_id:Number(role_id) 
      },
      select: {
        id: true,
        username: true,
        user_role: {
          select: {
            id: true,
            title: true
          }
        },
        role_id: true,
        school_id: true,
        school: {
          select: {
            name: true
          }
        },
        // @ts-ignore
        is_enabled: true,
        permissions: true
      }
    });

    console.log({ users });
    res.status(200).json(users);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(get)