import prisma from '@/lib/prisma_client';
import { academicYearVerify, authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token, academic_year) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { id: academic_year_id, school_id } = academic_year;
        const { search_value, student_id } = req.query;
        let students, search_value_, student_id_;
        if (search_value) {
          search_value_ = search_value.trim();
        } else if (student_id) {
          student_id_ = student_id.trim();
        }

        const query = {};

        if (!search_value && !student_id) throw new Error('search value field is empty ');

        if (student_id) {
          students = await prisma.$queryRaw`SELECT 
              student_informations.id,student_informations.first_name,student_informations.middle_name,student_informations.last_name
              ,students.class_roll_no
              ,sections.name as section_name
              ,classes.name as class_name
              ,students.id as student_table_id
          FROM student_informations
          JOIN students on  students.student_information_id = student_informations.id
          JOIN sections on students.section_id = sections.id
          JOIN classes  on classes.id = sections.class_id
          WHERE student_informations.student_id = ${student_id_} AND students.academic_year_id=${academic_year_id}
      `;
        } else if (search_value) {
          students = await prisma.$queryRaw`SELECT 
            student_informations.student_id,student_informations.id,student_informations.first_name,student_informations.middle_name,student_informations.last_name
            ,students.class_roll_no
            ,sections.name as section_name
            ,classes.name as class_name
            ,students.id as student_table_id 
        FROM student_informations
        JOIN students on  students.student_information_id = student_informations.id
        JOIN sections on students.section_id = sections.id
        JOIN classes  on classes.id = sections.class_id
        WHERE CONCAT(student_informations.first_name, IFNULL(student_informations.middle_name , ' '),IFNULL(student_informations.last_name, '')) REGEXP ${search_value_} AND students.academic_year_id=${academic_year_id}
    `;
        }

        // const students = await prisma.student.findMany({
        //     where: {
        //         academic_year: {
        //             id: academic_year_id
        //         },

        //         student_info: {
        //             first_name: { contains: search_value },
        //             middle_name: { contains: search_value },
        //             last_name: { contains: search_value },
        //             user: {
        //                 is: {
        //                     deleted_at: null
        //                 }
        //             },
        //             school_id
        //         }
        //     },
        //     select: {
        //         id: true,
        //         // section_id: true,
        //         section: {
        //             select: {
        //                 // id: true,
        //                 name: true,
        //                 class: {
        //                     select: {
        //                         // id: true,
        //                         name: true
        //                     }
        //                 }
        //             }
        //         },
        //         class_roll_no: true,
        //         class_registration_no: true,
        //         student_info: {
        //             select: {
        //                 first_name: true,
        //                 middle_name: true,
        //                 last_name: true,
        //             }
        //         }
        //     }
        // })

        res.status(200).json(students.slice(0, 50));
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        logFile.error(`Method ${method} Not Allowed`);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(academicYearVerify(index));
