import prisma from '@/lib/prisma_client';
import { academicYearVerify, authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token, academic_year) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { school_id } = refresh_token;
        const { search_type, search_value } = req.query;
        let teachers, search_value_;
        search_value_ = search_value.trim();

        if (!search_value && !search_type) throw new Error('search value field is empty ');

        if (search_type === "id") {
          teachers = await prisma.$queryRaw`
          SELECT 
              teachers.id AS id, teachers.teacher_id AS teacher_id, user_id, TRIM(CONCAT(teachers.first_name,' ', IFNULL( teachers.middle_name , ''),' ',IFNULL(teachers.last_name, ''))) AS name
          FROM teachers
          JOIN users ON users.id = teachers.user_id
          WHERE users.deleted_at IS NULL AND teachers.teacher_id = ${search_value}
      `;
          return res.status(200).json(teachers);
        }

        teachers = await prisma.$queryRaw`
        SELECT 
        -- teachers.teacher_id AS teacher_id, 
            teachers.id as id, user_id, TRIM(CONCAT(teachers.first_name,' ', IFNULL( teachers.middle_name , ''),' ',IFNULL(teachers.last_name, ''))) AS name
        FROM teachers
        JOIN users ON users.id = teachers.user_id
        WHERE TRIM(CONCAT(teachers.first_name,' ', IFNULL( teachers.middle_name , ''),' ',IFNULL(teachers.last_name, ''))) REGEXP ${search_value_}
        LIMIT 50
    `;

        res.status(200).json(teachers);
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
