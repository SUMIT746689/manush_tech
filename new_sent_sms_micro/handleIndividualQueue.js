import { createSmsQueueTableHandler } from "./utility/createSmsQueueTableHandler.js";
import { handleClassWiseStudents } from "./utility/handleResClassWiseStudents.js";
import { handleSmsGateWay } from "./utility/handleSmsGateway.js";
import prisma from "./utility/prismaClient.js";

export const handleIndividualQueue = async ({ student_attendace_queue, std_min_attend_date_wise, std_max_attend_date_wise }) => {

  const { id, class_id, section_id, school_id, academic_year_id, created_at } = student_attendace_queue;

  // delete queue
  prisma.tbl_student_sent_sms_queue.delete({ where: { id } }).catch(err => { console.log("error delete tbl_manual_student_attendace_queue", err) });

  // verify sms gateway
  const { error, data } = await handleSmsGateWay({ school_id });
  if (error) return console.log(error);

  const whereSection = {};
  if (section_id) whereSection["id"] = section_id;

  //get students via school class section academic year wise
  const { error: student_err, data: studentsViaClass } = await handleClassWiseStudents({ school_id, class_id, whereSection, academic_year_id });
  if (student_err) return console.log(student_err);

  const { school } = studentsViaClass;
  const { name: school_name, masking_sms_price, masking_sms_count, non_masking_sms_price, non_masking_sms_count } = school ?? {};
  const sms_type = "masking";
  const sms_count = sms_type === "masking" ? masking_sms_count : non_masking_sms_count;
  const sms_price = sms_type === "masking" ? masking_sms_price : non_masking_sms_price;


  // verify sms price
  if (!sms_price || sms_price < 0) return console.log(`error school_id(${school_id}) have not ${sms_type} sms price`);

  // verify school have enough balance 
  let totalSmsCount = 0;
  studentsViaClass.sections.forEach((section, index) => {
    if (Array.isArray(section?.students)) totalSmsCount += section?.students.length;
  });

  if (sms_count < totalSmsCount) return console.log(`error school_id(${school_id}) have not enough ${sms_type} sms `);


  studentsViaClass.sections.forEach((section, index) => {
    const { id: section_id } = section;

    section.students?.forEach(async student => {

      const { id, guardian_phone, class_roll_no, student_info } = student;
      const { user_id, gender, phone } = student_info ?? {};

      if (!guardian_phone) return console.log(`guardian_phone not found student_id(${id})`);

      const haveAttendance = await prisma.attendance.findFirst({
        where: { AND: [{ student_id: student.id }, { date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }] },
        select: {
          status: true
        }
      });

      const smsQueueHandlerParameters = {
        user_id,
        contacts: guardian_phone,
        submission_time: created_at,
        school_id,
        school_name,
        sender_id,
        index,
        sms_type,
        charges_per_sms: sms_price
      };

      smsQueueHandlerParameters["sms_text"] = `Dear Parents, Your ${gender === "male" ? "son" : "daughter"}, Class-${class_id}, Sec-${section_id}, Roll-${class_roll_no} is ${haveAttendance?.status || "absent"} ${new Date(created_at).toLocaleDateString('en-US')} in class. Principal, ${school_name}`;
      smsQueueHandlerParameters["number_of_sms_parts"] = smsQueueHandlerParameters.sms_text?.length <= 160 ? 1 : Math.ceil(smsQueueHandlerParameters.sms_text?.length / 153)

      // create sent sms queue, tbl sent sms and update school 
      createSmsQueueTableHandler(smsQueueHandlerParameters);
    })
  })
}