import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function deleteSchool(req, res, refresh_token) {
  try {
    const id = parseInt(req.query.id);

    if (!id) throw new Error('valid id required');
    const school = await prisma.school.delete({
      where: {
        id: id
      }
    });
    if (!school) throw new Error('falied to delete school');
    res.status(200).json({ success: true });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
