import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

async function get(req: any, res: any,refresh_token:any) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id, is_enabled: true },
      include: {
        permissions: true,
        role: {
          include: {
            permissions: true
          }
        },
        school: {
          include: {
            subscription: {
              where: { is_active: true },
              include: { package: true }
            }
          }
        }
      }
    });
    if (!user.permissions.length) {
      user['permissions'] = user.role.permissions;
      delete user['role']['permissions'];
    }
    delete user['password'];
    res.status(200).json({ user });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}

export default authenticate(get) ;