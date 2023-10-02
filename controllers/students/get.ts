import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


async function get(req, res, refresh_token) {
  try {

    const { section_id, academic_year_id, class_id } = req.query;

    const where = {};

    if (section_id) {
      where['section_id'] = parseInt(section_id);
    } else if (class_id) {
      where['section'] = {
        class_id: parseInt(class_id)
      }
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
        }
      },
      select: {
        id: true,
        student_photo: true,
        section_id: true,
        class_registration_no: true,
        student_present_address: true,
        discount: true,
        student_info: {
          // select: {
          //   first_name: true,
          //   middle_name: true,
          //   last_name: true,
          //   school: {
          //     select: {
          //       name: true
          //     }
          //   }
          // }
          include: {
            school: {
              select: {
                name: true
              }
            }
          }
        },
        academic_year: true,
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
        guardian_phone: true,
        class_roll_no: true,
        waiver_fees: true
      }
    });

    res.status(200).json(students);
  } catch (error) {
    console.log(error);

    res.status(404).json({ Error: error.message });
  }
}

export default authenticate(get)