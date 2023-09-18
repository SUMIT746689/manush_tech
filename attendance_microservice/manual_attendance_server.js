import { studentManualQueueHanlde } from "./utility/manualQueueHandler.js";
import prisma from "./utility/prisma_client.js";


const main = async () => {
  try {
    let res_tbl_manual_student_attendace_queue = await prisma.tbl_manual_student_attendace_queue.findMany()
    
    if (res_tbl_manual_student_attendace_queue.length === 0) throw new Error("no manual student attend queue found")

    res_tbl_manual_student_attendace_queue.forEach( individual_manual_student_attendace_queue => {
      studentManualQueueHanlde(individual_manual_student_attendace_queue)
    })
  }
  catch (err) {
    prisma.$disconnect();
    console.log({ err: err.message })
  }
}

main();
