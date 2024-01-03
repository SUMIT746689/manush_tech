import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

async function get(req, res) {
  try {
    const { id } = req.query;

    // if (name) {
    const response = await prisma.examTerm.findFirst({
      where: { id: Number(id) }
    });

    if (!response) throw new Error('Invalid to found exam term');
    res.json({ success: true, rooms: response });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get);