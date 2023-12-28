import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export const patch = async (req, res) => {
  try {
    const {role, is_enabled } = req.body;

    if (!role || typeof is_enabled !== 'boolean') throw new Error('provide role informations');
    
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
    
    const {title} = role;

    if (!user.permissions.length && user.role_id) {
      user['permissions'] = user.role.permissions;
      delete user['role']['permissions'];
    }
    const findUser = user.permissions.find(
      (permission) => permission.value === `create_${title.toLowerCase()}`  
    );
    if (!findUser) throw Error('Permission denied !')
    
    await prisma.user.update({
      where: {
        id: parseInt(req.query.id)
      },
      data: {
        is_enabled
      }
    });
    res.status(200).json({ message: 'User Status updated Successfully' });
   
  } catch (err) {
    logFile.error(err.message)
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};
