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
          students = await prisma.$queryRaw`
                      SELECT 
                student_informations.id,student_informations.first_name,student_informations.middle_name,student_informations.last_name
                ,students.class_roll_no
                ,sections.name as section_name
                ,classes.name as class_name
                ,classes.id as class_id
                ,students.id as student_table_id,
                GROUP_CONCAT(subjects.id) as subject_ids,
                GROUP_CONCAT(subjects.name) AS subject_names
                
            FROM student_informations
            JOIN students on  students.student_information_id = student_informations.id
            JOIN sections on students.section_id = sections.id
            JOIN classes  on classes.id = sections.class_id
            LEFT JOIN _student_subjects on _student_subjects.A = students.id
            LEFT JOIN subjects on subjects.id = _student_subjects.B
            WHERE student_informations.student_id = ${student_id_} AND students.academic_year_id=${academic_year_id}
            GROUP BY students.id
        `;

        } else if (search_value) {
          students = await prisma.$queryRaw`
            SELECT 
                student_informations.id,student_informations.first_name,student_informations.middle_name,student_informations.last_name
                ,students.class_roll_no
                ,sections.name as section_name
                ,classes.name as class_name
                ,classes.id as class_id
                ,students.id as student_table_id,
                GROUP_CONCAT(subjects.id) as subject_ids,
                GROUP_CONCAT(subjects.name) AS subject_names
                
            FROM student_informations
            JOIN students on  students.student_information_id = student_informations.id
            JOIN sections on students.section_id = sections.id
            JOIN classes  on classes.id = sections.class_id
            LEFT JOIN _student_subjects on _student_subjects.A = students.id
            LEFT JOIN subjects on subjects.id = _student_subjects.B
            WHERE CONCAT(student_informations.first_name, IFNULL(student_informations.middle_name , ' '),IFNULL(student_informations.last_name, '')) REGEXP ${search_value_} AND students.academic_year_id=${academic_year_id}
            GROUP BY students.id
          
          `;
        }

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
