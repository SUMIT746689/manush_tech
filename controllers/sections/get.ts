import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


const get = async (req, res, refresh_token) => {
  try {
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
          where: {
            deleted_at: null
          },
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
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(get);
