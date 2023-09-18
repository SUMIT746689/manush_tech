import prisma from "./prisma_client.js"

export const isUserAttend = async ({ user_id, entry_time }) => {
  try {
    console.log({ entry_time })
    const result = await prisma.$queryRaw`
    SELECT submission_time, (submission_time >= ${entry_time})AS isLate
      FROM tbl_attendance_queue
      WHERE submission_time >= ${entry_time}
      ORDER BY submission_time 
      LIMIT 1 
      `
    console.log({ result });
    if (result.length > 0) return false;
    // await prisma.tbl_attendance_queue.findFirstOrThrow({ where: { user_id } })
    return true;
  }
  catch (err) { return false; }
}