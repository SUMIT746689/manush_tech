// import { deleteTblAttendanceQueues } from "./deleteTblAttendanceQueues.js";
import prisma from "./prisma_client.js"

export const isUserAttend = async ({ user_id, std_min_attend_date_wise, entry_time, today }) => {
  let isAttend = false;
  try {
    const std_min_attend_date_wise = new Date(today);
    std_min_attend_date_wise.setUTCHours(0);
    std_min_attend_date_wise.setUTCMinutes(0);
    std_min_attend_date_wise.setUTCSeconds(0);
    std_min_attend_date_wise.setUTCMilliseconds(0);

    const std_max_attend_date_wise = new Date(today);
    std_max_attend_date_wise.setUTCHours(23);
    std_max_attend_date_wise.setUTCMinutes(59);
    std_max_attend_date_wise.setUTCSeconds(59);
    std_max_attend_date_wise.setUTCMilliseconds(999);
    console.log({ std_min_attend_date_wise, std_max_attend_date_wise })

    const find_attendance = await prisma.tbl_attendance_queue.findMany({ where: { user_id, submission_time: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }, orderBy: { submission_time: "asc" } })

    console.log({ user_id, find_attendance });
    // // , (submission_time >= ${entry_time})AS isLate

    // const result = await prisma.$queryRaw`
    // SELECT id, submission_time
    //   FROM tbl_attendance_queue
    //   WHERE user_id=${user_id}
    //   ORDER BY submission_time 
    //   -- LIMIT 1 
    //   `
    // let isAttend = false;
    // const attedenceQueueIds = [];

    // const submission_time_ = new Date(attendance.submission_time).getTime();
    // const entry_time_ = new Date(entry_time).getTime();
    // const std_min_attend_date_wise_ = std_min_attend_date_wise.getTime();

    // for (const attendance of result) {
    //   attedenceQueueIds.push(attendance.id);

    //   if (std_min_attend_date_wise_ <= submission_time_ && submission_time_ <= entry_time_) isAttend = true;
    // }

    // // delete table from attendance queues
    // // deleteTblAttendanceQueues(attedenceQueueIds);

    // // if (!Array.isArray || result.length === 0) return false;
    return isAttend;
  }
  catch (err) {
    console.log({ err })
    return false;
  }
}