import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate"
import { logFile } from "utilities_api/handleLogFile";

const patch = async (req, res, token_data) => {
    try {
        const { } = token_data;
        const { seat_plan_id, teacher_ids } = req.body;
        console.log(req.body, seat_plan_id)

        const resSeatPlan = await prisma.seatPlan.update({
            where: { id: parseInt(seat_plan_id) },
            data: {
                teachers: {
                    connect: teacher_ids
                }
            }
        });

        res.status(200).json({ success: "successfully added" })
    }
    catch (err) {
        logFile.error(err.message)
        res.status(500).json({ error: err.message });
    }
}

export default authenticate(patch);