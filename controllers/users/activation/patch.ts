import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const patch = async (req, res, refresh_token) => {
  try {
    const { is_enabled } = req.body;
    const { id } = req.query;
    const { admin_panel_id } = refresh_token;
    
    if (typeof is_enabled !== 'boolean') throw new Error('provide role informations');

    const deactive_user = await prisma.user.findFirst({
      where: { id: parseInt(id), admin_panel_id },
      select: {
        user_role: true
      }
    });

    if (!deactive_user) throw new Error("selected user not founds");

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
      (permission) => permission.value === `create_${deactive_user.user_role.title.toLowerCase()}`
    );

    if (!findUser) throw Error('Permission denied !')

    await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        is_enabled
      }
    });
    res.status(200).json({ message: 'User Status updated Successfully' });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(patch)