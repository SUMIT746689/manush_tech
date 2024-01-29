import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
import { handleClassWiseStudents } from "./utility/handleResClassWiseStudents.js";
import { handleSmsGateWay } from "./utility/handleSmsGateway.js";
import prisma from "./utility/prismaClient.js";
import { logFile } from "./utility/handleLog.js";
import { verifyIsUnicode } from "./utility/handleVerifyUnicode.js";
import { findMatches } from "./utility/findMatches.js";
import { customizeDateWithTime } from "./utility/dateTime.js";

export const handleIndividualQueue = async ({ student_attendace_queue, std_min_attend_date_wise, std_max_attend_date_wise }) => {
  try {
    const { id, class_id, section_id, school_id, academic_year_id, created_at } = student_attendace_queue;

    // verify sms gateway
    const { error, data: smsGatewayData } = await handleSmsGateWay({ school_id });
    if (error) return (error);
    const { id: smsGatewayId, sender_id, is_masking } = smsGatewayData;
    const whereSection = {};
    if (section_id) whereSection["id"] = section_id;

    //get students via school class section academic year wise
    const { error: student_err, data: studentsViaClass } = await handleClassWiseStudents({ school_id, class_id, whereSection, academic_year_id });
    if (student_err) return logFile.error(student_err);

    const { school } = studentsViaClass;
    const { name: school_name, masking_sms_price, masking_sms_count, non_masking_sms_price, non_masking_sms_count, AutoAttendanceSentSms } = school ?? {};

    const sms_count = is_masking ? masking_sms_count : non_masking_sms_count;
    const sms_price = is_masking ? masking_sms_price : non_masking_sms_price;

    // verify sms price
    // if (!sms_price || sms_price < 0) return logFile.error(`error school_id(${school_id}) have not ${sms_type} sms price`);

    // verify school have enough balance 
    let totalSmsCount = 0;
    studentsViaClass.sections.forEach((section, index) => {
      if (Array.isArray(section?.students)) totalSmsCount += section?.students.length;
    });

    if (sms_count < totalSmsCount) return logFile.error(`error school_id(${school_id}) have not enough ${sms_type} sms `);

    if (AutoAttendanceSentSms.length === 0) return logFile.error(`error school_id(${school_id}) auto_attendance_sent_sms table datas not founds  `);

    // sms type verify  
    const isUnicode = verifyIsUnicode(AutoAttendanceSentSms[0].body);
    const sms_type = isUnicode ? 'unicode' : 'text';

    // delete queue
    prisma.tbl_student_sent_sms_queue.delete({ where: { id } }).catch(err => { logFile.error("error delete tbl_manual_student_attendace_queue", err) });

    studentsViaClass.sections.forEach((section, index) => {
      const { id: section_id } = section;

      section.students?.forEach(async student => {
        console.log(student)

        const { id, guardian_phone, class_roll_no, student_info } = student;
        const { user_id, gender, phone } = student_info ?? {};

        if (!phone) return logFile.error(`phone number not found student_id(${id})`);

        const haveAttendance = await prisma.attendance.findFirst({
          where: { AND: [{ student_id: student.id }, { date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }] },
          select: {
            status: true
          }
        });

        const resAutoAttendanceSentSms = Array.isArray((AutoAttendanceSentSms)) && AutoAttendanceSentSms.length > 0 ? AutoAttendanceSentSms[0] : {};

        let sms_text = JSON.parse(JSON.stringify(resAutoAttendanceSentSms.body));
        //dynamic values replace

        const allMatchesArray = findMatches(resAutoAttendanceSentSms.body);
        for (const element of allMatchesArray) {
          sms_text = sms_text.replaceAll(`#${element}#`, student[element] || student_info[element] || element === 'submission_time' && customizeDateWithTime(created_at) || '')
        }
        console.log({sms_text})
        
        // calculate part of sms
        const bodyLength = isUnicode ? sms_text.length * 2 : sms_text.length;

        const number_of_sms_parts = bodyLength <= 160 ? 1 : Math.ceil(bodyLength / 153);
        if (masking_sms_count < number_of_sms_parts) return logFile.error(`student sent sms, user_id(${user_id}) school_id(${school_id}) masking sms count is ${masking_sms_count}`);


        const smsQueueHandlerParameters = {
          user_id,
          contacts: phone,
          submission_time: created_at,
          school_id,
          school_name,
          sender_id: smsGatewayId,
          sender_name: sender_id,
          index,
          sms_type,
          charges_per_sms: sms_price,
          sms_text: resAutoAttendanceSentSms.body,
          is_masking,
          number_of_sms_parts
        };

        // create sent sms queue, tbl sent sms and update school 
        createSmsQueueTableHandler(smsQueueHandlerParameters);
      })
    })
  }
  catch (err) {
    logFile.error(err.message)
  }
}