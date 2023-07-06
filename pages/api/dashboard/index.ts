import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const index = async (req, res) => {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');
  
    const userInfo = await prisma.user.findFirst({
      where: { id: refresh_token.id },
      include: {
        role: true
      }
    });
  
    const { method } = req;

    switch (method) {
      case 'GET':
        const totalCount = {};
        if (userInfo.role.title === 'SUPER_ADMIN') {
          totalCount['schools'] = { count: await prisma.school.count() };
          totalCount['admins'] = {
            count: await prisma.user.count({
              where: {
                role: {
                  title: 'ADMIN'
                }
              }
            })
          };
        }
        if (userInfo.role.title === 'ADMIN') {
          totalCount['students'] = {
            count: await prisma.student.count({
              where: { student_info: { school_id: userInfo?.school_id } }
            })
          };
          totalCount['teachers'] = {
            count: await prisma.teacher.count({
              where: { school_id: userInfo?.school_id }
            })
          };
        }

        // if (userInfo.role.title === 'STUDENT') {
        //   totalCount['class'] = await prisma.student.findFirst
        // }

        res.status(200).json({
          ...totalCount
        });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default index;
