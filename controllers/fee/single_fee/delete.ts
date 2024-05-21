import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

const deleteFee = async (req, res, refresh_token, dcryptAcademicYear) => {
    try {
        const { id } = req.query;

        const response = await prisma.fee.update({
            where: { id: parseInt(id) },
            data: {
                deleted_at: new Date(Date.now())
            }
        })

        if (!response) throw new Error('failed to delete school');
        return res.json({ fee: response, success: true });

    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default deleteFee

