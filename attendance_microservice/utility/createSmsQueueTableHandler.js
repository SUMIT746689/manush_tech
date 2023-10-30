import prisma from "./prisma_client.js";

export const createSmsQueueTableHandler = ({ user_id, contacts, sms_text, submission_time, school_id, school_name, sender_id, index }) => {

  const currentDate = new Date().getTime();
  const sms_shoot_id = [String(school_id), String(currentDate), String(index)].join("_");

  prisma.$transaction([
    prisma.tbl_queued_sms.create({
      data: {
        sms_shoot_id,
        user_id: parseInt(user_id),
        school_id,
        school_name,
        sender_id,
        sms_type: 'masking',
        sms_text,
        // // sender_id: 1,
        // // sender_name: "",
        submission_time: new Date(submission_time),
        contacts,
        pushed_via: '',
        // // status: status,
        // // route_id: 1,
        // // coverage_id: 1,
        // // charges_per_sms: 0.25,
        total_count: 1,
        // // is_black_list: 2,
        //fail_count: 3,
        //priority: 4
      }
    }),
    prisma.tbl_sent_sms.create({
      data: {
        sms_shoot_id,
        user_id: parseInt(user_id),
        school_id,
        school_name,
        sender_id,
        sms_type: 'masking',
        sms_text,
        // // sender_id: 1,
        // // sender_name: "",
        submission_time: new Date(submission_time),
        contacts,
        pushed_via: '',
        // // status: status,
        // // route_id: 1,
        // // coverage_id: 1,
        // // charges_per_sms: 0.25,
        total_count: 1,
        // // is_black_list: 2,
        //fail_count: 3,
        //priority: 4
      }
    }),
  ])
    // .then(res => { console.log("tbl_queue_sms", res) })
    .catch(err => { console.log("tbl_queue_sms", err) })
}