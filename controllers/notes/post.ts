import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";


const post = async (req, res, refresh_token) => {
  try {
    const date = new Date(Date.now());
    date.setUTCHours(0)
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    // const date = new Date().toLocaleDateString("en-us");
    // const date2 = new Date().toLocaleDateString("en-us");
    // console.log(date, date2, date === date2);
    // const body = JSON.parse(JSON.stringify(req.body));
    // console.log({ body })
    // console.log({ "aaaa": body.subject_id })
    // console.log(req.body.subject_id)
    const { subject_id, period_id, note } = req.body;
    // console.log({ subject_id, period_id, note, date });
    
    if (!req.body.subject_id || !req.body.subject_id || !req.body.note) return res.status(404).json({ message: "missing required fields" })
    const upsertUser = await prisma.dailyNote.upsert({
      where: {
        period_id_date: {
          period_id,
          date
        },
      },
      update: {
        note: note
      },
      create: {
        date,
        note: req.body.note,
        period: { connect: { id: period_id } },
        subject: { connect: { id: subject_id } }
      },
    });
    res.status(200).json({ upsertUser })
    // const resNote = await prisma.dailyNote.findFirst({ where: {} });
    // const resNote = await prisma.$queryRaw`
    //     SELECT * FROM
    //     daily_notes
    //     WHERE DATE(${date}) = date
    // `;
    // if (resNote) {
    //     const res_ = await prisma.$queryRaw`
    //         SELECT * FROM
    //         daily_notes
    //         WHERE DATE(${ date }) = date
    //     `;
    //     // const res_ = await prisma.dailyNote.update({
    //     //     where:{ date}
    //     //     data: {
    //     //         note,
    //     //         subject_id,
    //     //         date
    //     //     }
    //     // });
    //     return res.json(res_);
    // };

    // const res_ = await prisma.dailyNote.create({
    //     data: {
    //         note,
    //         subject_id,
    //         date
    //     }
    // });
    // return res.json(res_);

    // res.json(resNote);
  }
  catch (err) {
    logFile.error(err.message)
    console.log({ err: err.message })
    res.status(500).json({ error: err.message });
  }

}

export default authenticate(post);