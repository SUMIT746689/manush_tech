import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function get(req: any, res: any, refresh_token: any) {
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


    if (user?.school?.subscription[0]?.package?.is_std_cnt_wise) {
      const student_cnt = await prisma.student.aggregate({
        where: {
          student_info: {
            school_id: user.school_id,
            user: {
              deleted_at: null
            }
          },
        },
        _count: {
          id: true
        }
      })

      user.school.subscription[0].package.price = student_cnt._count.id * user.school.subscription[0].package.price
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}

export default authenticate(get);