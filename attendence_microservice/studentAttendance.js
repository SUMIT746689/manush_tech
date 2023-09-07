import prisma from "./prisma_client";

export const studentAttendence = (attend_queue, student_id, index) => {

  prisma.attendance.create({
    data: {
      student_id: student_id,
      date: new Date(attend_queue.submission_time),
      status: attend_queue.status === 1 ? "present" : "late",
      section_id: 1,
      school_id: attend_queue.school_id,
    }
  }).catch((error) => { console.log(student_attendence, error) })


  const currentDate = new Date().getTime();
  const sms_shoot_id = [String(attend_queue.school_id), String(currentDate), String(index)].join("_");

  prisma.tbl_queued_sms.create({
    data: {
      sms_shoot_id,
      user_id: parseInt(attend_queue.user_id),
      submission_time: new Date(attend_queue.submission_time),
      status: attend_queue.status,
      // route_id: 1,
      // sender_id: 1,
      // coverage_id: 1,
      contacts: '0186786',
      pushed_via: 'wrgve',
      // charges_per_sms: 0.25,
      total_count: 4,
      sms_type: 'masking',
      sms_text: 'eqfretrh rwgvebttrynt',
      // is_black_list: 2,
      fail_count: 3,
      priority: 4
    }
  }).catch(err => { console.log("tbl_queue_sms", err) })
}
