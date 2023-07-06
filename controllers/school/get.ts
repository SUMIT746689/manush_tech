import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function getHandler(req, res, authenticate_user) {
  try {
    const authenticate_user_Info = await prisma.user.findFirst({
      where: { id: authenticate_user.id },
      select: {
        role: true
      }
    });
    console.log("authenticate_user_Info__", authenticate_user_Info);

    if (authenticate_user_Info.role.title !== 'SUPER_ADMIN')
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
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(getHandler);
