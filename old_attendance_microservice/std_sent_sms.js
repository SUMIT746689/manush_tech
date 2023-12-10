// import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
import { studentManualQueueHandle } from "./utility/manualQueueHandler.js";
import prisma from "./utility/prisma_client.js";


const main = async () => {
  try {
    let res_tbl_student_sent_sms_queue = await prisma.tbl_student_sent_sms_queue.findMany()

    if (!res_tbl_student_sent_sms_queue || res_tbl_student_sent_sms_queue?.length === 0) throw new Error("manual attendace queue is empty");

    const today = new Date(Date.now());
    // utc day start time 
    const std_min_attend_date_wise = new Date(today);
    std_min_attend_date_wise.setHours(0, 0, 0, 0);

    // utc day end time
    const std_max_attend_date_wise = new Date(today);
    std_max_attend_date_wise.setHours(23, 59, 59, 999);

    // manually send attendance for students
    res_tbl_student_sent_sms_queue.forEach(individual_student_attendace_queue => {
      studentManualQueueHandle({ student_attendace_queue: individual_student_attendace_queue, std_min_attend_date_wise, std_max_attend_date_wise })
    });
  }

  catch (err) {
    prisma.$disconnect();
    console.log({ "server": err.message })
  }
}

main();
