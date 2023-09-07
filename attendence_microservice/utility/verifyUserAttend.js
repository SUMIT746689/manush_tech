import prisma from "./prisma_client.js"

export const isUserAttend = async (user_id) => {
  try {
    await prisma.tbl_attendance_queue.findFirstOrThrow({ where: { user_id } })
    return true;
  }
  catch (err) { return false; }
}