import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import prisma from "./prisma_client.js";
import { isUserAttend } from "./verifyUserAttend.js";


export const studentAttendence = async ({ std_entry_time, class_id, student, last_time, school_id, section_id, index }) => {

  // console.log({ std_entry_time, last_time });
  const std_min_attend_date_wise = new Date(last_time);
  std_min_attend_date_wise.setHours(0);
  std_min_attend_date_wise.setMinutes(0);
  std_min_attend_date_wise.setSeconds(0);
  std_min_attend_date_wise.setMilliseconds(0);

  const std_max_attend_date_wise = new Date(last_time);
  std_max_attend_date_wise.setHours(23);
  std_max_attend_date_wise.setMinutes(59);
  std_max_attend_date_wise.setSeconds(59);
  std_max_attend_date_wise.setMilliseconds(999);

  const std_attend_date_ = new Date(last_time);
  const entry_time = new Date(std_entry_time);
  entry_time.setFullYear(std_attend_date_.getFullYear());
  entry_time.setMonth(std_attend_date_.getMonth());
  entry_time.setDate(std_attend_date_.getDate());

  try {
    const { id, guardian_phone, class_roll_no } = student;
    const { student_info: { user_id } = {} } = student;


    // searching have any one attendance record selected date wise
    const findAttendence_ = await prisma.attendance.findFirst({
      where: {
        student_id: id,
        date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise }
      },
      select: {
        id: true,
        status: true,
      }
    });
    let isAttend = findAttendence_?.status === "present" ? true : false;

    // create/update attendance for student
    if (!findAttendence_ || !findAttendence_?.status) {
      console.log("hi....")

      if (findAttendence_) {

        //verify user had attended before
        const isAttend = user_id ? await isUserAttend({ user_id, std_min_attend_date_wise, entry_time }) : false;

        // search for atttence record
        await prisma.attendance.update({
          where: { id: findAttendence_.id },
          // data: { status: "present"}
          data: { status: isAttend ? "present" : "late" }
        })
          .catch((error) => { console.log("error update attendance", error.message) });
      }
      else {
        prisma.attendance.create({
          data: {
            student_id: id,
            date: new Date(last_time),
            status: "late",
            // status: "absent",
            section_id,
            school_id,
          }
        })
          .catch((error) => { console.log("error create attendance", error) });
      }

    }

    // delete users attendences from 
    prisma.tbl_attendance_queue.deleteMany({ where: { user_id } })
      .catch((error) => { console.log("error tbl_attendance_queue", error.message) })

    // store user data to sent sms queue table 
    if (!guardian_phone) return;

    const smsQueueHandlerParameters = { user_id, contacts: guardian_phone, submission_time: last_time, school_id, index };
    smsQueueHandlerParameters["sms_text"] = `class: ${class_id}, roll: ${class_roll_no} is ${isAttend ? "present" : "late"} today `;

    createSmsQueueTableHandler(smsQueueHandlerParameters)

  }
  catch (error) {
    console.log({ "attendance error": error })
  }
}
