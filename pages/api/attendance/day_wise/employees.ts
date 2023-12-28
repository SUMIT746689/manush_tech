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
        
        if (!start_date) throw new Error('required start date');
        if (!end_date) throw new Error('required end date');

        start_date = new Date(start_date);
        end_date = new Date(end_date);
        
        const studentsPresent = await prisma.$queryRaw`
          WITH 
            role AS ( 
                SELECT id as without_role_id 
                FROM Role 
                WHERE title = "ADMIN"
                LIMIT 1
            ),
            all_attendance_date AS (
                SELECT DISTINCT(DATE(date)) as date
                FROM employee_attendances
                WHERE date BETWEEN DATE(${start_date}) AND DATE(${end_date})
            ),
            employee_attendances_date_wise AS (
                SELECT COUNT(id) as total_attend, date
                FROM employee_attendances
                WHERE employee_attendances.school_id = ${school_id} AND status = "present" AND date BETWEEN DATE(${start_date}) AND DATE(${end_date}) 
                GROUP BY date 
            ),
            no_of_employees AS (
                SELECT count(users.id) as total
                FROM users, role
                WHERE school_id = ${school_id} AND users.deleted_at IS NULL AND users.user_role_id != role.without_role_id
            )
          SELECT AVG(IFNULL(employee_attendances_date_wise.total_attend,0) * 100 / no_of_employees.total) as attendance_percent 
          FROM all_attendance_date
          JOIN no_of_employees
          LEFT JOIN  employee_attendances_date_wise ON all_attendance_date.date = employee_attendances_date_wise.date
      `;

        res.status(200).json(studentsPresent);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    console.log(err);
    res.status(500).json({ message: err.message });

  }

}

export default authenticate(index) 