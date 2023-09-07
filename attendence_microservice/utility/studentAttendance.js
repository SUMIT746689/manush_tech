import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import prisma from "./prisma_client.js";
import { isUserAttend } from "./verifyUserAttend.js";


export const studentAttendence = async (class_id, student, last_time, school_id, section_id, index) => {
  try {
    const { id, guardian_phone, class_roll_no } = student;
    const { student_info: { user_id } = {} } = student;

    const isAttend = user_id ? await isUserAttend(user_id) : false;

    // create attendance for student
    prisma.attendance.create({
      data: {
        student_id: id,
        date: new Date(last_time),
        status: isAttend ? "present" : "late",
        section_id,
        school_id,
      }
    }).catch((error) => { console.log("error create attendance", error) });


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
