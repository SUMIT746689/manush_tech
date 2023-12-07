import { resEmpAttendanceQueues, userWiseAttendanceQueues, deleteTblAttendanceQueues, userWiseAttendanceQueuesWithStatus } from "./utility/handleAttendanceQueue.js"
import { createEmployeeAttendance, resEmployeeAttendance, updateEmployeeAttendance } from "./utility/handleAttendance.js"
export const empAttendance = async ({ min_attend_datetime, max_attend_datetime }) => {
    const { error, data: resEmp } = await resEmpAttendanceQueues();
    if (error) return console.log({ error })

    resEmp.forEach(async (empAttend) => {

        const { user_id } = empAttend;
        const { error, data: isEmpAlreadyEntryAttend } = await resEmployeeAttendance({ user_id, min_attend_datetime, max_attend_datetime })
        if (error) return console.log({ error })

        if (isEmpAlreadyEntryAttend) {
            const { error, data: tblAttendanceQ } = await userWiseAttendanceQueues({ user_id, min_attend_datetime, max_attend_datetime });
            console.log({ error, data })
            if (error) return console.log({ error });

            const { error: errorEmpAttendanceUpdate } = await updateEmployeeAttendance({ user_id, id: isEmpAlreadyEntryAttend.id, exit_time: tblAttendanceQ[0].exit_time })
            if (errorEmpAttendanceUpdate) return console.log({ errorEmpAttendanceUpdate })
            console.log(`user_id(${user_id}) employee attendance updated sucessfully`)

            const deleteIds = tblAttendanceQ.map((e) => e.id);
            const { error: errorDeleteTblAttendance } = await deleteTblAttendanceQueues({ ids: deleteIds })
            if (error) return console.log({ errorDeleteTblAttendance })
            console.log("tbl_attendance_queue delete successfull")
        }
        else {
            // employee entry time and exit time needed to includes
            const emp_entry_time = new Date();

            const { error: errTblAttendanceQ, data: tblAttendanceQ } = await userWiseAttendanceQueuesWithStatus({ user_id, entry_time: emp_entry_time, min_attend_datetime, max_attend_datetime })
            if (error) return console.log({ errTblAttendanceQ })
            let entry_time;
            let exit_time;
            if (Array.isArray(tblAttendanceQ) && tblAttendanceQ.length > 0) {
                entry_time = tblAttendanceQ[0].entry_time;
                exit_time = tblAttendanceQ.length > 1 ? tblAttendanceQ[0].exit_time : undefined;
            }
            const status = "late";
            const { error: errorCreateEmpAttendance } = await createEmployeeAttendance({ user_id, school_id, data, status, entry_time, exit_time });
            if (errorCreateEmpAttendance) return console.log({ errorCreateEmpAttendance })

            const deleteIds = tblAttendanceQ.map((e) => e.id);
            const { error: errorDeleteTblAttendance } = await deleteTblAttendanceQueues({ ids: deleteIds })
            if (errorDeleteTblAttendance) return console.log({ errorDeleteTblAttendance })
            console.log("tbl_attendance_queue delete successfull")
        }

    });
}