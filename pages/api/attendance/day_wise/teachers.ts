import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";


const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;


    switch (method) {
      case 'GET':

        let { start_date, end_date } = req.query;
        const {school_id} = refresh_token;
        
        if (!school_id) throw new Error('invalid school')
        if (!start_date) throw new Error('required start date');
        if (!end_date) throw new Error('required end date');

        start_date = new Date(start_date);
        end_date = new Date(end_date);
        
        const teachersPresent = await prisma.$queryRaw`
          WITH 
          teacher_role AS ( SELECT id FROM Role WHERE title = "TEACHER"), 
          total_teachers_presents_date_wise as (
            SELECT 
            COUNT(users.id) AS usr_id,
            employee_attendances.date as date
            FROM employee_attendances
            JOIN teacher_role
            JOIN users ON employee_attendances.user_id = users.id
            WHERE
              employee_attendances.school_id = ${school_id}
              AND users.deleted_at IS NULL
              AND employee_attendances.status = "present"
              AND users.user_role_id = teacher_role.id
              AND employee_attendances.date BETWEEN DATE(${start_date}) AND DATE(${end_date})
            GROUP BY employee_attendances.date
          ),
          total_teachers AS (
              SELECT COUNT(users.id) as count_teachers
              FROM users,teacher_role
              WHERE users.school_id = ${school_id}
              AND users.deleted_at IS NULL
              AND teacher_role.id = users.user_role_id
          ),
          all_attendance_dates AS (
              SELECT DISTINCT(DATE(date)) as date
              FROM employee_attendances
              WHERE date BETWEEN DATE(${start_date}) AND DATE(${end_date})
          )

          SELECT AVG(IFNULL(total_teachers_presents_date_wise.usr_id,0)*100/total_teachers.count_teachers) as attendance_percent
          FROM all_attendance_dates
          JOIN total_teachers
          LEFT JOIN total_teachers_presents_date_wise ON all_attendance_dates.date = total_teachers_presents_date_wise.date 
        `;

        res.status(200).json(teachersPresent);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    console.log("error message:", err.message);
    res.status(500).json({ message: err.message });

  }

}

export default authenticate(index) 