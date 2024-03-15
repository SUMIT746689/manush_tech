import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function get(req: any, res: any, refresh_token: any) {
  try {
    const { admin_panel_id } = refresh_token

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id, is_enabled: true },
      include: {
        permissions: true,
        adminPanel: true,
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
            },
            academic_years: {
              where: {
                curr_active: true
              }
            }
          }
        }
      }
    });

    // verify adminpanel domain 
    const { adminPanel } = user;
    const host = req.headers.host;
    if (host !== adminPanel?.domain) throw new Error("Login using correct domain address")
    if (admin_panel_id !== adminPanel.id) throw new Error("malicious info, login again")
    if (!user.permissions.length) {
      user['permissions'] = user.role.permissions;
      delete user['role']['permissions'];
    }
    delete user['password'];

    if (user?.role?.title !== 'ASSIST_SUPER_ADMIN' && user?.role?.title !== 'SUPER_ADMIN') {
      let isSubscriptionActive = false;
      // console.log(user.school?.subscription[0]?.end_date.getTime() + 86400000 > new Date().getTime());
      if (user?.school?.subscription?.length > 0 && user.school?.subscription[0]?.end_date.getTime() + 86400000 > new Date().getTime()) {

        isSubscriptionActive = true;

      }
      else {
        if (user?.role?.title === 'ADMIN') {

          isSubscriptionActive = true;
          console.log(isSubscriptionActive, "user?.role?.title__", user?.role?.title,);
          user['permissions'] = user['permissions'].filter(i => i.value === 'package_request')
        }
      }
      if (!isSubscriptionActive) {

        throw new Error('Your subscription has expired or not active');
      }
    }


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
    logFile.error(err.message)
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}

export default authenticate(get);