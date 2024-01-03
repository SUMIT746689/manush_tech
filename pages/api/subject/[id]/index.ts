import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'PATCH':
        const { id } = req.query;
        const { name, class_id } = req.body;
        const data = {};

        if (name) data["name"] = name;
        if (class_id) data["class_id"] = class_id;

        await prisma.subject.update({
          where: { id: parseInt(id) },
          data
        });

        res.status(200).json({ message: 'Subject created successfully' });
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

export default index;
