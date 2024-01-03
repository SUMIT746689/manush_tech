import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function getSchool(req, res, refresh_token) {
  try {
    const id = parseInt(req.query.id);

    if (!id) throw new Error('valid id required');

    const school = await prisma.school.findUnique({
      where: {
        id: id
      }
    });
    if (!school) throw new Error('school not found');
    res.status(200).json(school);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
