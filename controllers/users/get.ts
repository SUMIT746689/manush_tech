import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export const get = async (req, res) => {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');
    console.log({ refresh_token });

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id },
      include: {
        role: true
      }
    });

    const AND = [];
    if (user.role.title === 'SUPER_ADMIN') AND.push({
      role: {
        title: 'ADMIN'
      }
    });
    else if (user.role.title === 'ADMIN') {
      AND.push(
        { school_id: user.school_id },
        {
          NOT: {
            role: {
              title: 'ADMIN'
            }
          }
        }
      );
    }
    else throw new Error('Only role 1 and 2 is allowed to see validate data')
    // : [{ school_id: user.school_id }, { id: { not: user.id } }]
    const users = await prisma.user.findMany({
      where: {
        AND
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
        permissions: true,
        user_photo: true
      }
    });

    console.log({ users });
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
