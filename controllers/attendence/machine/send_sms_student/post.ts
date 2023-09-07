import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function post(req, res, refresh_token) {
  try {
    const { class_id, section_id, academic_year_id } = req.query;
    console.log({ class_id, section_id, academic_year_id });

    if (!class_id || !academic_year_id) return res.status(400).json({ "error": " required field is not found" });
    // const whereSection = {};
    // if (section_id) whereSection["id"] = parseInt(section_id);

    // const response = await prisma.class.findFirst({
    //   where: {
    //     school_id: refresh_token.school_id,
    //     id: parseInt(class_id),

    //   },
    //   select: {
    //     sections: {
    //       where: whereSection,
    //       select: {
    //         id: true,
    //         students: {
    //           select: {
    //             id: true,
    //             student_info: {
    //               select: {
    //                 user_id: true
    //               }
    //             }
    //           }
    //         },
    //       }
    //     }
    //   }
    // });

    const tbl_manual_attendace_queue = [];

    // response?.sections.forEach(section => {
    //   section.students?.forEach(student => {
    //     tbl_manual_attendace_queue.push({
    //       // user_id: student.student_info?.user_id,
    //       class_id: parseInt(class_id),
    //       section_id: section_id ? parseInt(section_id) : null,
    //       // school_id: parseInt(refresh_token?.school_id),
    //     })
    //   })
    // })

    await prisma.tbl_manual_student_attendace_queue.create({
      data: {
        class_id: parseInt(class_id),
        section_id: section_id ? parseInt(section_id) : null,
        school_id: parseInt(refresh_token.school_id),
        academic_year_id: parseInt(academic_year_id)
      }
    })

    return res.json({ message: "successfully sending messages...", success: true });

  } catch (err) {
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)