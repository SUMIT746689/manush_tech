import prisma from "./prisma_client.js"

export const deleteTblAttendanceQueues = (ids) => {
  prisma.tbl_attendance_queue.deleteMany({ where: { id: { in: ids } } })
    .catch(err => { console.log("delete form tblAttendanceQueue", err.message) })
}