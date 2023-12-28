import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate"
import { logFile } from "utilities_api/handleLogFile";
import { convertToDate } from "utilities_api/mysqlDateConverter";

const get = async (req, res, refresh_token) => {
  try {
    const types = ["all", "individual"];
    const { get_type } = req.query;

    if (!get_type) return res.status(404).json({ error: "required field missing" })

    switch (get_type) {
      case types[0]:
        if (refresh_token?.role?.title !== 'ADMIN') return res.status(403).json({ error: "unauthorized user" });

        const { section_id, start_date, end_date } = req.query;

        if (!section_id || !start_date || !end_date) return res.status(404).json({ error: "required field missing" })

        const start_date_ = convertToDate(start_date);
        const end_date_ = convertToDate(end_date);

        const resDailyNote = await prisma.dailyNote.findMany({
          where: {
            date: { gte: start_date_, lte: end_date_ },
            period: { section_id: parseInt(section_id), school_id: parseInt(refresh_token.school_id) }
          },
          select: {
            id: true,
            date: true,
            note: true,
            subject: {
              select: {
                name: true
              }
            },
            period: {
              select: {
                teacher: {
                  // @ts-ignore
                  where: { deleted_at: null },
                  select: {
                    first_name: true
                  }
                },
                // section: {
                //   select: {
                //     name: true,
                //     class: {
                //       select: {
                //         name: true
                //       }
                //     }
                //   }
                // }
              }
            }
          }
        });
        return res.status(200).json(resDailyNote);

      case types[1]:

        const { period_id, subject_id } = req.query;

        if (!subject_id) return res.status(404).json({ error: "required field missing" })

        const date = convertToDate();

        const resIndividual = await prisma.dailyNote.findFirst({ where: { period_id: parseInt(period_id), date } });
        return res.status(200).json(resIndividual);

      default:
        return res.status(500).json({ error: 'unauthorized request' });
    }
  }
  catch (err) {
    logFile.error(err.message)
    console.error({ err: err.message });
    res.status(500).json({ error: err.message });
  }

  // res.status(200).json(re);
}

export default authenticate(get);