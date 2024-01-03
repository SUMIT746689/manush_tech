import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export const post = async (req, res) => {
  try {

    const { id } = req.query;
    console.log({ id });
    await prisma.class.findFirst({
      where: { id: id },
      select: {
        name: true,
        code: true,
      }
    });
    res.status(200).json({ message: 'teacher created successfull!!' });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};
