import prisma from "./prisma_client.js";
import { studentAttendence } from "./studentAttendance.js";

export const studentManualQueueHanlde = async (student_attendace_queue) => {

  const { class_id, section_id, school_id, academic_year_id, created_at } = student_attendace_queue;

  const whereSection = {};
  if (section_id) whereSection["id"] = section_id;

  //get students via class section academic year
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
                  user_id: true
                }
              }
            }
          },
        }
      }
    }
  });

  if (!responseStudentsViaClass?.sections || responseStudentsViaClass.sections.length === 0) throw new Error("No students founds");

  responseStudentsViaClass.sections.forEach((section, index) => {
    // const getEntryTime = new Date(section.std_entry_time);
    // const getEntryMinute = getEntryTime.getMinutes();
    // const getEntryHours = getEntryTime.getHours();
    // console.log({ getEntryTime, getEntryMinute, getEntryHours });
    section.students?.forEach(student => {
      //create table for student attendence
      studentAttendence({ std_entry_time: section.std_entry_time, class_id, student, last_time: created_at, school_id, section_id: section.id, index })
    })
  })
} 