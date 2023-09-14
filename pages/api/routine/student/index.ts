import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        
        const responseStudent = await prisma.student.findFirst({
          where: {
            student_info: { user_id: refresh_token.id, school_id: refresh_token.school_id },
            // section: { class: { has_section: true } }
          },
          select: { section: { include: { class: true } } }
        })

        // if (!responseStudent.section?.class?.has_section) return res.status(200).json({ routine: null, class: responseStudent.section.class.name, section: '' })

        const routine = await prisma.period.findMany({
          where: {
            section_id: responseStudent.section.id,
            school_id: refresh_token.school_id
          },
          select: {
            day: true,
            start_time: true,
            end_time: true,
            room: true,
            teacher: {
              select: {
                school_id: true,
                user: {
                  select: {
                    username: true,
                  }
                }
              }
            },
            subject: true,
            section: {
              select: {
                name: true,
                class: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }

        });

        res.status(200).json({ routine, class: responseStudent.section.class.name, section: responseStudent.section.class.has_section ? responseStudent.section.name : 'no section' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

export default authenticate(index);
// export default index;
