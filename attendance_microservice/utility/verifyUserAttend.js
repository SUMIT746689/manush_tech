import { deleteTblAttendanceQueues } from "./deleteTblAttendanceQueues.js";
import prisma from "./prisma_client.js"

export const isUserAttend = async ({ user_id, std_min_attend_date_wise, entry_time }) => {
  try {
    // , (submission_time >= ${entry_time})AS isLate

    const result = await prisma.$queryRaw`
    SELECT id, submission_time
      FROM tbl_attendance_queue
      WHERE user_id=${user_id}
      ORDER BY submission_time 
      -- LIMIT 1 
      `
    let isAttend = false;
    const attedenceQueueIds = [];
    
    const submission_time_ = new Date(attendance.submission_time).getTime();
    const entry_time_ = new Date(entry_time).getTime();
    const std_min_attend_date_wise_ = std_min_attend_date_wise.getTime();

    for (const attendance of result) {
      attedenceQueueIds.push(attendance.id);

      if (std_min_attend_date_wise_ <= submission_time_ && submission_time_ <= entry_time_) isAttend = true;
    }

    // delete table from attendance queues
    deleteTblAttendanceQueues(attedenceQueueIds);

    // if (!Array.isArray || result.length === 0) return false;
    return isAttend;
  }
  catch (err) { return false; }
}