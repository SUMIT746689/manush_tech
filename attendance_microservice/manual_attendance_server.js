import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
import { studentManualQueueHandle } from "./utility/manualQueueHandler.js";
import prisma from "./utility/prisma_client.js";


const main = async () => {
  try {
    let res_tbl_student_sent_sms_queue = await prisma.tbl_student_sent_sms_queue.findMany()

    if (!res_tbl_student_sent_sms_queue || res_tbl_student_sent_sms_queue?.length === 0) throw new Error("manual attendace queue is empty");

    // manually send attendance for students
    res_tbl_student_sent_sms_queue.forEach(individual_student_attendace_queue => {
      studentManualQueueHandle(individual_student_attendace_queue)
    });
  }

  catch (err) {
    prisma.$disconnect();
    console.log({ "server": err.message })
  }
}

main();
