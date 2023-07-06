import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const patch = async (req, res) => {
  try {
    // const { username, password, permission,is_enabled } = req.body;
   
    
    const { username, password, role, is_enabled } = req.body;

    if (!username || !password || !role ) throw new Error('provide required informations');

    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id },
      select: {
        permissions: true,
        role_id: true,
        role: {
          select: {
            title: true,
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
    
    const hashPassword = await bcrypt.hash(
      req.body.password,
      Number(process.env.SALTROUNDS)
    );
    
    const data = {};
    if(username) data["username"] = username; 
    if(password) data["password"] = hashPassword;
    if(is_enabled) data["is_enabled"] = is_enabled;

    await prisma.user.update({
      where: {
        id: parseInt(req.query.id)
      },
      data
    });

    res.status(200).json({ message: 'User updated Successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};
