import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function getHandler(req, res, authenticate_user) {
  try {
    const authenticate_user_Info = await prisma.user.findFirst({
      where: { id: authenticate_user.id },
      select: {
        role: true
      }
    });

    if (authenticate_user_Info.role.title !== 'ASSIST_SUPER_ADMIN')
      throw new Error('Your role have no permissions');

    const schools = await prisma.school.findMany({
      include: {
        subscription: {
          where: { is_active: true },
          include: { package: true }
        },
        // @ts-ignore
        admins: {
          where: {
            role: {
              title: 'ADMIN'
            }
          },
          select: {
            id: true,
            username: true,
            role: true,
            created_at: true,
            updated_at: true,
            school_id: true
          }
        }
      }
    });
    res.status(200).json(schools);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(getHandler);
