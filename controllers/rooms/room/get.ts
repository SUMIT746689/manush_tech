import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function get(req, res, refresh_token) {
  try {
    const { id } = req.query;

    // if (name) {
    const response = await prisma.room.findFirst({
      where: { id: Number(id), deleted_at: null, school_id: refresh_token?.school_id }
    });

    if (response) return res.json({ success: true, rooms: response });
    else throw new Error('Invalid to found room');

    // } else throw new Error('provide valid data');
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
