import prisma from "./prisma_client.js";


const studentAttendence = (attend_queue, student_id, index) => {

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

// const employeeAttendence = (attend_queue) => {
//   // console.log({ attend_queue })
//   prisma.employeeAttendance.create({
//     data: {
//       user_id: attend_queue.user_id,
//       date: new Date(attend_queue.submission_time),
//       school_id: attend_queue.school_id,
//       status: attend_queue.status === 1 ? "present" : "late"
//     }
//   }).then(banna => {
//     console.log({ banna })
//     // prisma.employeeAttendance.delete({ where: { id: banna.id } }) 
//   })
// }


//distribute attendence by user type 

const attendenceDistributeByType = async (attend_queue, role_type, index) => {

  switch (role_type?.title) {

    case 'STUDENT':
      prisma.student.findFirst({
        where: {
          student_info: {
            // school_id: 1 || attend_queue.school_id,
            // school_id: attend_queue.school_id,
            user_id: 4 || attend_queue.user_id,
            // user_id: attend_queue.user_id,
          }
          // user_id: attend_queue.user_id
        },
        select: {
          id: true
        }
      }).then(student => {
        console.log({ student })
        student?.id && studentAttendence(attend_queue, student.id, index);
      })
      break;
    case 'SUPER_ADMIN', 'ADMIN':
      break;
    default:
    // employeeAttendence(attend_queue);
  }
}

const main = async () => {

  // prisma.tbl_manual_attendace_queue.findMany({ include: { user: { include: { user_role: true } } } })
  prisma.tbl_manual_attendace_queue.findMany({})
    .then(tbl_manual_attendace => {
      console.log({ tbl_manual_attendace })
      tbl_manual_attendace.forEach(attendee => {
        prisma.tbl_attendance_queue.findMany({ where: { user_id: attendee.user_id }, include: { user: true } })
          .then((tbl_attendance) => {
            console.log({ tbl_attendance })
          })
          .catch((err) => { console.log({ "tbl_attendance_queue_error": err }) })
      })
    })
    .catch((err) => { console.log({ err }) })

  // prisma.tbl_attendance_queue.findMany({ include: { user: { include: { user_role: true } } } })
  //   .then((v) => {
  //     v.forEach((element, index) => {
  //       attendenceDistributeByType(element, element.user.user_role, index);
  //     });

  //   })
  //   .catch((err) => { console.log({ err }) })
}

main();
