import prisma from "./prisma_client.js";

export const createSmsQueueTableHandler = ({ user_id, contacts, sms_text, submission_time, school_id, index }) => {

  const currentDate = new Date().getTime();
  const sms_shoot_id = [String(school_id), String(currentDate), String(index)].join("_");

  prisma.tbl_queued_sms.create({
    data: {
      sms_shoot_id,
      user_id: parseInt(user_id),
      submission_time: new Date(submission_time),
      // status: status,
      // // route_id: 1,
      // // sender_id: 1,
      // // coverage_id: 1,
      contacts,
      pushed_via: 'wrgve',
      // // charges_per_sms: 0.25,
      total_count: 1,
      sms_type: 'masking',
      sms_text,
      // // is_black_list: 2,
      //fail_count: 3,
      //priority: 4
    }
  })
    // .then(res => { console.log("tbl_queue_sms", res) })
    .catch(err => { console.log("tbl_queue_sms", err) })
}