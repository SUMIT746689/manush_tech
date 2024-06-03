import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

export default async function get(req: any, res: any, refresh_token, dcryptAcademicYear) {
    try {
        const { school_id } = refresh_token;
        const { fees_head_id, class_id } = req.query;
        const parse_fees_head_id = parseInt(fees_head_id);
        const parse_class_id = parseInt(class_id);

        if (!Number.isInteger(parse_fees_head_id) || !Number.isInteger(parse_class_id)) throw new Error('provided invalid required values');

        const resFeeMonths = await prisma.fee.findMany({
            where: { fees_head_id: parse_fees_head_id, class_id: parse_class_id, school_id },
            distinct: "fees_month",
            select: { fees_month: true }
        });

        const months = resFeeMonths.map(month => month.fees_month)

        return res.json(months)

    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ err: err.message });
    }
}
