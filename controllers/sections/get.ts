import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

const get = async (req, res, refresh_token) => {
  const sections = await prisma.section.findMany({
    where: {
      class: {
        school_id: refresh_token.school_id,
        has_section: true
      }
    },
    include: {
      groups: true,
      class: {
        select: {
          id: true,
          name: true
        }
      },
      class_teacher: {
        select: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  });
  res.status(200).json(sections);
};

export default authenticate(get);
