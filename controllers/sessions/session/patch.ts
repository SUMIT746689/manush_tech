import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function post(req, res) {
  try {
    const { id } = req.query;
    const { title } = req.body;
    console.log({ title });

    if (title) {
      // @ts-ignore
      const response = await prisma.session.update({
        where: {
          id: Number(id),
        },
        data: {
          title
        }
      });

      if (response) return res.json({ success: true });
      else throw new Error('Invalid to update room');
    } else throw new Error('provide valid data');
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
