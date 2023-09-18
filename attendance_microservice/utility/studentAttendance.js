import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import prisma from "./prisma_client.js";
import { isUserAttend } from "./verifyUserAttend.js";


export const studentAttendence = async ({ std_entry_time, class_id, student, last_time, school_id, section_id, index }) => {

  // console.log({ std_entry_time, last_time });
  const std_attend_date_ = new Date(last_time);
  const std_max_attend_date_ = new Date(last_time);

  std_max_attend_date_.setHours(23);
  std_max_attend_date_.setMinutes(59);
  std_max_attend_date_.setSeconds(59);
  std_max_attend_date_.setMilliseconds(999);

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
        date: { gte: std_attend_date_, lte: std_max_attend_date_ }
      },
      select: {
        id: true,
      }
    });
    console.log({ findAttendence_ });

    // create/update attendance for student
    if (findAttendence_) {
    
      //verify user has already attend
      const isAttend = user_id ? await isUserAttend({ user_id, entry_time }) : false;
      console.log({isAttend})
      

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
