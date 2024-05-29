import prisma from "@/lib/prisma_client";
import { academicYearVerify, authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const section = async (req, res, refresh_token, academicYearVerify) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);

    switch (method) {
      case 'GET':
        const user = await prisma.section.findUnique({
          where: {
            id: id
          }
          // include: {

          // }
        });
        res.status(200).json(user);
        break;
      case 'PATCH':
        const { name, class_id, class_teacher_id, group_ids, std_entry_time, std_late_time, std_absence_time, std_exit_time } = req.body;

        const quries = {
          where: {
            id
          },
          data: {}
        };

        if (name) quries.data['name'] = name;
        if (class_id) quries.data['class_id'] = class_id;
        if (class_teacher_id) quries.data['class_teacher_id'] = class_teacher_id;
        if (std_entry_time) quries.data['std_entry_time'] = std_entry_time;
        if (std_late_time) quries.data["std_late_time"] = std_late_time
        if (std_absence_time) quries.data["std_absence_time"] = std_absence_time
        if (std_exit_time) quries.data['std_exit_time'] = std_exit_time;
        if (group_ids) quries.data['groups'] = { connect: group_ids.map((id) => ({ id })) }

        else {
          // quries['groups'] = { connect: { id: group_id } };
          // quries.data['group_id'] = null;
        }
        await prisma.section.update({
          ...quries
        });
        res.status(200).json({ success: 'successfully updated' });
        break;

      case 'DELETE':
        const { school_id } = refresh_token;
        const haveAlreadySection = await prisma.section.findFirst({
          where: { class: { school_id } },
          select: {
            students: {
              select: {
                id: true
              },
              take: 1
            },
            class: {
              select: {
                name: true,
                sections: {
                  select: { id: true }
                }
              }
            }
          }
        });
        if (!Array.isArray(haveAlreadySection?.class?.sections) || haveAlreadySection?.class?.sections.length === 0) throw new Error(' invalid section...')

        if (haveAlreadySection?.class?.sections.length > 1) {
          await prisma.section.delete({
            where: {
              id: id
            }
          });
          return res.status(200).json({ success: 'successfully deleted' })
        }

        if (haveAlreadySection?.students.length > 0) throw new Error('This section has dependencies')

        await prisma.section.update({
          where: {
            id: id
          },
          data: {
            name: `dafault-${haveAlreadySection.class.name}`,
            class: {
              update: {
                has_section: false
              }
            }
          }
        });
        return res.status(200).json({ success: 'successfully deleted' })
        break;

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    if (err.message.includes('Foreign key constraint')) return res.status(404).json({ message: "this section has dependencies" });

    res.status(500).json({ message: err.message });
  }
};

export default authenticate(academicYearVerify(section));
