import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
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

    const sms_campaigns = prisma.tbl_sms_campaign_queued.findMany({
      // include: { sentSmsDetail: true, smsTemplate: true, smsGateway: true },
    })
    // prisma.sentSmsDetail.findMany()

    Promise.all([res_tbl_manual_student_attendace_queue, sms_campaigns]).then((res) => {
      if (res[0].length === 0 && res[1].length === 0) throw new Error("no data available for sending sms");

      // console.log(res[0], res[1]);

      // manually send attendance for students
      res[0].length > 0
        &&
        res[0].forEach(individual_manual_student_attendace_queue => {
          studentManualQueueHanlde(individual_manual_student_attendace_queue)
        });

      res[1].length > 0
      res[1].forEach((senderinfo,index) => {
        // console.log({ senderinfo })

        const { name, body, phone, sender_id, api_key, user_id, school_id,created_at } = senderinfo;
        console.log({ name, body, phone, sender_id, api_key, user_id,school_id})

        createSmsQueueTableHandler({ user_id, contacts: phone, sms_text: body, submission_time: created_at, school_id, index });
      })
      // campaign sms from sms campaign queued tables
      //   &&
      //   res[1].forEach(senderinfo => {

      //     const { details } = smsGateway ?? {};
      //     const { body } = smsTemplate ?? {};


      // Array.isArray(sentSmsDetail) && sentSmsDetail?.forEach((sentSms, index) => {
      //   console.log({ index })
      // sentSms.phone &&

      // sentSmsQueue(sentSms, details, message, school_id, index);
      // });

      //   });
    })
  }

  catch (err) {
    prisma.$disconnect();
    console.log({ "server": err.message })
  }
}

main();
