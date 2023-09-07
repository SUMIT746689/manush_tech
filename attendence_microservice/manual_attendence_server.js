// import { studentAttendence } from "./manual_attendence/studentAttendance.js";
import prisma from "./prisma_client.js";
import { studentAttendence } from "./studentAttendance.js";


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
  try {
    const res_tbl_manual_student_attendace_queue = await prisma.tbl_manual_student_attendace_queue.findMany()
    if (res_tbl_manual_student_attendace_queue.length === 0) throw new Error("no manual student attend queue found")

    const { class_id, section_id, school_id, academic_year_id, created_at } = res_tbl_manual_student_attendace_queue;

    const whereSection = {};
    if (section_id) whereSection["id"] = section_id;

    const responseStudentsViaClass = await prisma.class.findFirst({
      where: {
        school_id,
        id: class_id,
      },
      select: {
        sections: {
          where: whereSection,
          select: {
            id: true,
            students: {
              where: {
                academic_year_id
              },
              select: {
                id: true,
                student_info: {
                  select: {
                    user_id: true
                  }
                }
              }
            },
          }
        }
      }
    });
    // console.log({ responseStudentsViaClass })
    if(!responseStudentsViaClass?.sections || responseStudentsViaClass.sections.length === 0) throw new Error("No students founds");
    
    const tbl_manual_attendace_queue = [];

    responseStudentsViaClass.sections.forEach(section => {
      section.students?.forEach(student => {
        console.log({student})
        studentAttendence(class_id, student )
    //     tbl_manual_attendace_queue.push({
    //       // user_id: student.student_info?.user_id,
    //       class_id: parseInt(class_id),
    //       section_id: section_id ? parseInt(section_id) : null,
    //       // school_id: parseInt(refresh_token?.school_id),
    //     })
      })
    })

    // tbl_manual_attendace.forEach(attendee => {
    //   prisma.tbl_attendance_queue.findMany({ where: { user_id: attendee.user_id }, include: { user: true } })
    //     .then((tbl_attendance) => {
    //       console.log({ tbl_attendance })
    //       let attendanceStatus = 1
    //       if (tbl_attendance.length > 0) studentAttendence(attendee, attendanceStatus);
    //       else {
    //         attendanceStatus = 2
    //         studentAttendence(attendee, 2)
    //       }
    //     })
    //     .catch((err) => { console.log({ "tbl_attendance_queue_error": err }) })
    // })


    // prisma.tbl_attendance_queue.findMany({ include: { user: { include: { user_role: true } } } })
    //   .then((v) => {
    //     v.forEach((element, index) => {
    //       attendenceDistributeByType(element, element.user.user_role, index);
    //     });

    //   })
    //   .catch((err) => { console.log({ err }) })
  }
  catch (err) {
    console.log({ err })
  }
}

main();
