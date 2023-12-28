import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";
const post = async (req, res, refresh_token) => {
    try {
        if (!refresh_token?.school_id) throw new Error("permission denied")

        const { exam_id, addtional_marks } = req.body;

        if (!exam_id || !addtional_marks) throw new Error("required field missing")
        const datas = addtional_marks?.map(({ addtional_mark_id, total_mark }) => {
            if (!addtional_mark_id || !total_mark) throw new Error("addtional marks fields missing")
            return ({ addtional_mark_id, total_mark, exam_id })
        })

        await prisma.examAddtionalMark.createMany({
            data: datas
        });

        res.status(200).json({ message: 'Addtional marking catagory created successfully' });
    } catch (err) {
        logFile.error(err.message)
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export default post;