// import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
import { todayMinMaxDateTime } from "./utility/dateTime.js";
import { handleIndividualQueue } from "./handleIndividualQueue.js";
import prisma from "./utility/prismaClient.js";


const main = async () => {
  try {
    let res_tbl_student_sent_sms_queue = await prisma.tbl_student_sent_sms_queue.findMany()

    if (!res_tbl_student_sent_sms_queue || res_tbl_student_sent_sms_queue?.length === 0) throw new Error("manual attendace queue is empty");

    const { std_min_attend_date_wise, std_max_attend_date_wise } = todayMinMaxDateTime();

    // manually send attendance for students
    res_tbl_student_sent_sms_queue.forEach(individual_student_attendace_queue => {
      handleIndividualQueue({ student_attendace_queue: individual_student_attendace_queue, std_min_attend_date_wise, std_max_attend_date_wise })
    });
  }

  catch (err) {
    prisma.$disconnect();
    console.log({ "server": err.message })
  }
}

main();
