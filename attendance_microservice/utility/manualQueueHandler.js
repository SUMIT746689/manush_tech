import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import prisma from "./prisma_client.js";
import { studentAttendence } from "./studentAttendance.js";

export const studentManualQueueHandle = async ({ student_attendace_queue, std_min_attend_date_wise, std_max_attend_date_wise }) => {

  const { id, class_id, section_id, school_id, academic_year_id, created_at } = student_attendace_queue;

  // delete queue
  prisma.tbl_student_sent_sms_queue.delete({ where: { id } }).catch(err => { console.log("error delete tbl_manual_student_attendace_queue", err) });

  // response from sms gateway response
  const smsGatewayRes = await prisma.smsGateway.findFirst({ where: { school_id } })

  if (!smsGatewayRes) return console.log("error :-", "sms gateway missing");

  const { details } = smsGatewayRes;
  const { sender_id, sms_api_key: api_key } = details ?? {};
  if (!sender_id && !api_key) return console.log("error :-", "sender_id or api_key missing");

  const whereSection = {};
  if (section_id) whereSection["id"] = section_id;

  //get students via class section academic year
  const responseStudentsViaClass = await prisma.class.findFirst({
    where: {
      school_id,
      id: class_id,
    },
    select: {
      school: {
        select: {
          name: true,
          masking_sms_price: true,
          masking_sms_count: true,
          non_masking_sms_price: true,
          non_masking_sms_count: true
        }
      },
      sections: {
        where: whereSection,
        select: {
          id: true,
          std_entry_time: true,
          std_exit_time: true,
          students: {
            where: {
              academic_year_id
            },
            select: {
              id: true,
              guardian_phone: true,
              class_roll_no: true,
              student_info: {
                select: {
                  phone: true,
                  user_id: true,
                  gender: true
                }
              }
            }
          },
        }
      }
    }
  });

  if (!responseStudentsViaClass?.sections || responseStudentsViaClass.sections.length === 0) throw new Error("No students founds");

  const { school } = responseStudentsViaClass;
  const { name: school_name, masking_sms_price, masking_sms_count, non_masking_sms_price, non_masking_sms_count } = school ?? {};
  const sms_type = "masking";
  const sms_count = sms_type === "masking" ? masking_sms_count : non_masking_sms_count;
  const sms_price = sms_type === "masking" ? masking_sms_price : non_masking_sms_price;
  
  // console.log(sms_price < 0)
  // return;
  // verify sms price
  if (!sms_price || sms_price < 0) return console.log(`error school_id(${school_id}) have not ${sms_type} sms price`);

  // verify school have enough balance 
  let totalSmsCount = 0;
  responseStudentsViaClass.sections.forEach((section, index) => {
    if (Array.isArray(section?.students)) totalSmsCount += section?.students.length;
  });
  console.log({ totalSmsCount })

  if (sms_count < totalSmsCount) return console.log(`error school_id(${school_id}) have not enough ${sms_type} sms `);

  responseStudentsViaClass.sections.forEach((section, index) => {

    const { id: section_id } = section;
    section.students?.forEach(async student => {
      const { id, guardian_phone, class_roll_no, student_info } = student;
      const { user_id, gender, phone } = student_info ?? {};

      if (!guardian_phone) return console.log(`guardian_phone not found student_id(${id})`);

      // prisma.school.update({
      //   where: { id: school_id },
      //   data: {
      //     masking_sms_count: sms_type === "masking" ? { decrement: 1 } : undefined,
      //     non_masking_sms_count: sms_type === "non_masking" ? { decrement: 1 } : undefined
      //   }
      // })
      //   .then((res) => { console.log(`school update successfull`) })

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
      console.log({ smsQueueHandlerParameters, "length": smsQueueHandlerParameters.sms_text?.length })

      createSmsQueueTableHandler(smsQueueHandlerParameters);

      // // create table for student attendence
      // studentAttendence({ std_entry_time, class_id, student, last_time: created_at, school_id, school_name, sender_id, section_id, index })
    })
  })
}