import prisma from "./prisma_client.js";
import { studentAttendence } from "./studentAttendance.js";

export const studentManualQueueHandle = async (student_attendace_queue) => {

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
        select: { name: true }
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

  const { school: { name: school_name } } = responseStudentsViaClass;

  responseStudentsViaClass.sections.forEach((section, index) => {
    // const getEntryTime = new Date(section.std_entry_time);
    // const getEntryMinute = getEntryTime.getMinutes();
    // const getEntryHours = getEntryTime.getHours();
    // console.log({ getEntryTime, getEntryMinute, getEntryHours });
    const { std_entry_time, id: section_id } = section;
    section.students?.forEach(student => {
      //create table for student attendence
      studentAttendence({ std_entry_time, class_id, student, last_time: created_at, school_id, school_name, sender_id, section_id, index })
    })
  })
}