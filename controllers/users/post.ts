import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const post = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role.permission)
      throw new Error('provide all required informations');

    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const hashPassword = await bcrypt.hash(
      req.body.password,
      Number(process.env.SALTROUNDS)
    );

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id },
      include: {
        permissions: true,
        role: {
          include: {
            permissions: true
          }
        }

      }
    });
    
   
    if (!user.permissions.length && user.role_id) {
      user['permissions'] = user.role.permissions;
      delete user['role']['permissions'];
    }
    const findUser = user.permissions.find(
      (permission) => permission.value === role.permission
    );
    if (!findUser) throw Error('Permission denied !')

    const data = {
      username: req.body.username,
      password: hashPassword
    };

    if (refresh_token.school_id) data['school'] = {
      connect: { id: parseInt(refresh_token.school_id) }
    }

    const target_role = await prisma.role.findFirst({
      where: {
        title: role.role_title
      },
      include: {
        permissions: true
      }
    })

    data['role'] = {
      connect: { id: target_role.id }
    }
    data['user_role'] = {
      connect: { id: target_role.id }
    }

    await prisma.user.create({
      // @ts-ignore
      data
    });

    res.status(200).json({ message: `${role.role_title} Created Successfully` });
    // res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};
