import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function get(req, res, refresh_token) {
  try {
    const { section_id, academic_year_id, class_id } = req.query;

    const where = {};

    if (section_id) {
      const Id_s = section_id.split(',').map((id) => parseInt(id, 10));
      // old
      //  where['section_id'] = parseInt(section_id);

      where['section_id'] = {
        in: Id_s
      };
    } else if (class_id) {
      where['section'] = {
        class_id: parseInt(class_id)
      };
    }
    if (academic_year_id) where['academic_year_id'] = parseInt(academic_year_id);

    const students = await prisma.student.findMany({
      where: {
        ...where,
        student_info: {
          school_id: refresh_token.school_id,
          user: {
            is: {
              deleted_at: null
            }
          }
        },
        academic_year: {
          deleted_at: null
        }
      },
      include: {
        student_info: {
          include: {
            school: {
              select: {
                name: true
              }
            },
            user: {
              select: {
                username: true
              }
            }
          }
        },
        academic_year: true,
        discount: true,
        waiver_fees: true,
        section: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
                has_section: true
              }
            }
          }
        },
        group: {
          select: {
            title: true
          }
        }
      }
    });

    res.status(200).json(students);
  } catch (err) {
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get);
