import path from "path";
import { createAttendance, stdAlreadyAttendance, updateAttendance } from "./utility/handleAttendance.js";
import { deleteTblAttendanceQueues, resStdAttendanceQueues, userWiseAttendanceQueues, userWiseAttendanceQueuesWithStatus } from "./utility/handleAttendanceQueue.js";
import { handleResStdInfo } from "./utility/handleUserInfo.js";
import { logFile } from "./utility/handleLog.js";
import { sentSms } from "./utility/sent_sms.js";

export const stdAttendance = async ({ min_attend_datetime, max_attend_datetime }) => {
    try {
        const { error, data } = await resStdAttendanceQueues();
        if (error) return logFile.error(error)
        data.forEach(async (userAttend) => {
            const { user_id } = userAttend;

            const { error, data: resStudent } = await handleResStdInfo({ user_id });
            if (error) return logFile.error(error);
            console.log({ resStudent })
            const { id, guardian_phone, section, student_info, class_roll_no } = resStudent || {};

            if (!id || !section?.std_entry_time) return logFile.error(`student user_id(${user_id}) or section_id(${section?.id}) entry time not found`);

            const isAlreadyAttendanceEntry = await stdAlreadyAttendance({ student_id: id, min_attend_datetime, max_attend_datetime })

            if (isAlreadyAttendanceEntry && isAlreadyAttendanceEntry?.id) {

                const { error, data: stdAttendanceQ } = await userWiseAttendanceQueues({ user_id, min_attend_datetime, max_attend_datetime });
                if (error) return logFile.error(error);
                const { error: errorAttend } = updateAttendance({ id: isAlreadyAttendanceEntry.id, exit_time: stdAttendanceQ[0].exit_time })
                if (errorAttend) return logFile.error(error);

                logFile.info(`user_id(${user_id}) student update successfull`);

                const deleteIds = stdAttendanceQ.map((e) => e.id);
                const { error: errDeleteTblAttendanceQueues } = await deleteTblAttendanceQueues({ ids: deleteIds })
                if (errDeleteTblAttendanceQueues) logFile.error(error);

                logFile.info("tbl_attendance_queue delete successfull")

            }
            else {
                const { error, data: stdAttendanceQ } = await userWiseAttendanceQueuesWithStatus({ user_id, entry_time: section.std_entry_time, min_attend_datetime, max_attend_datetime });
                if (error) return logFile.error(error)

                let entry_time;
                let exit_time;
                if (Array.isArray(stdAttendanceQ) && stdAttendanceQ.length > 0) {
                    entry_time = stdAttendanceQ[0].entry_time;
                    exit_time = stdAttendanceQ.length > 1 ? stdAttendanceQ[0].exit_time : undefined;
                };

                const createAttendanceDatas = {
                    student_id: id,
                    status: stdAttendanceQ[0].status,
                    section_id: section.id,
                    school_id: student_info.school_id,
                    first_name: student_info.first_name,
                    middle_name: student_info.middle_name || undefined,
                    last_name: student_info.last_name || undefined,
                    section_name: section.name,
                    class_name: section.class.name,
                    class_roll_no,
                    entry_time,
                    exit_time
                };
                const { error: errorCreateAttnd } = await createAttendance(createAttendanceDatas);
                if (errorCreateAttnd) return logFile.error(errorCreateAttnd)
                logFile.info("create attendance successfull");

                const deleteIds = stdAttendanceQ.map((e) => e.id);
                const { error: errorDeletetblAttQueues } = await deleteTblAttendanceQueues({ ids: deleteIds })
                if (errorDeletetblAttQueues) return logFile.error(errorDeletetblAttQueues);
                logFile.info("tbl_attendance_queue delete successfull");
            }

            // sent sms
            const resAutoAttendanceSentSms = Array.isArray((resStudent.student_info.school.AutoAttendanceSentSms)) && resStudent.student_info.school.AutoAttendanceSentSms.length > 0 ? resStudent.student_info.school.AutoAttendanceSentSms[0] : {};
            sentSms(resAutoAttendanceSentSms, isAlreadyAttendanceEntry, resStudent, user_id);

        })
    }
    catch (err) {
        logFile.error(err.message);
    }
} 