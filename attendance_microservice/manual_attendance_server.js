import { studentManualQueueHanlde } from "./utility/manualQueueHandler.js";
import prisma from "./utility/prisma_client.js";
import { sentSmsQueue } from "./utility/sentSmsQueue.js";


const main = async () => {
  try {
    let res_tbl_manual_student_attendace_queue = prisma.tbl_manual_student_attendace_queue.findMany()

    // if (res_tbl_manual_student_attendace_queue.length === 0) throw new Error("no manual student attend queue found")
    // res_tbl_manual_student_attendace_queue.forEach( individual_manual_student_attendace_queue => {
    //   studentManualQueueHanlde(individual_manual_student_attendace_queue)
    // })

    const res_sent_sms_details = prisma.sentSms.findMany({
      include: { sentSmsDetail: true, smsTemplate: true, smsGateway: true },
    })
    // prisma.sentSmsDetail.findMany()

    Promise.all([res_tbl_manual_student_attendace_queue, res_sent_sms_details]).then((res) => {
      if (res[0].length === 0 && res[1].length === 0) throw new Error("no data available for sending sms");

      // console.log(res[0], res[1]);

      // manually send attendance for students
      res[0].length > 0
        &&
        res[0].forEach(individual_manual_student_attendace_queue => {
          studentManualQueueHanlde(individual_manual_student_attendace_queue)
        });

      // sent sms from sent sms and sent sms details
      res[1].length > 0
        &&
        res[1].forEach(senderinfo => {

          const { sentSmsDetail, smsGateway, custom_body, smsTemplate, school_id } = senderinfo;
          const { details } = smsGateway ?? {};
          const { body } = smsTemplate ?? {};
          const message = body || custom_body;

          Array.isArray(sentSmsDetail) && sentSmsDetail?.forEach((sentSms, index) => {
            console.log({ index })
            sentSms.phone &&
            sentSmsQueue(sentSms, details, message, school_id, index);
          });

        });
    })
  }

  catch (err) {
    prisma.$disconnect();
    console.log({ "server": err.message })
  }
}

main();
