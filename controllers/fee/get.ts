import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function get(req: any, res: any, refresh_token) {
  try {

    if (!refresh_token.school_id) throw new Error('invalid user');
    const where = {
      school_id: refresh_token.school_id,
      deleted_at: null
    }
    if (req.query.academic_year_id) {
      where['academic_year_id'] = Number(req.query.academic_year_id)
    }
    if (req.query.class_id) {
      where['class_id'] = Number(req.query.class_id)
    }

    //@ts-ignore
    const fee = await prisma.fee.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        fees_head: true
      },
      orderBy: {
        id: "desc"
      }
    });
    // delete user['password'];
    res.status(200).json({ data: fee, success: true });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ err: err.message });
  }
}
