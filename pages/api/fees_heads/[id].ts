import prisma from "@/lib/prisma_client";
import patch from "controllers/fees_heads/fees_head/patch";
import { logFile } from "utilities_api/handleLogFile";

const section = async (req, res) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);

    switch (method) {
      case 'PATCH':
        patch(req,res)
        break;

      default:
        res.setHeader('Allow', ['PATCH']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default section;
