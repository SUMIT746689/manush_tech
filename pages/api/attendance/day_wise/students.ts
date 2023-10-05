import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";


const index = async (req, res) => {
  try {
    const { method } = req;


    switch (method) {
      case 'GET':

        // let { last_no_of_days = 0 } = req.query;
        // console.log(Number(last_no_of_days));

        // if (last_no_of_days && !(parseInt(last_no_of_days) >= 0)) throw new Error(" provide a number for last_no_of_days query")
        // if (last_no_of_days) last_no_of_days = parseInt(last_no_of_days);

        let { start_date, end_date } = req.query;

        if (!start_date) throw new Error('required start date');
        if (!end_date) throw new Error('required end date');
        
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        console.log({start_date, end_date});
        
        const studentsPresent = await prisma.$queryRaw`
          SELECT AVG(no_of_attend *100 /(
            SELECT COUNT(students.id) 
            FROM students 
            JOIN student_informations
            ON students.academic_year_id = student_informations.id
            WHERE students.academic_year_id = 1 AND student_informations.school_id = 1    
          )) as attendance_percent
          FROM (
            SELECT COUNT(DISTINCT(student_id)) as no_of_attend
            FROM attendances
            WHERE school_id = 1 AND status = "present" AND DATE(date) BETWEEN DATE(${start_date}) AND DATE(${end_date})
            GROUP BY DATE(date)
            ORDER BY DATE(date) ASC
          ) AS student_results
      `;

        res.status(200).json(studentsPresent);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });

  }

}

export default authenticate(index) 