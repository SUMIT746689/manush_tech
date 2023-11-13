import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const patch = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        // const { id } = req.query;
        // const { title } = req.body;
        // const data = {};

        // if(title) data["title"]= title;

        // await prisma.addtionalMarkingCategories.update({
        //   where: { id: parseInt(id) },
        //   data
        // });

        const { school_id } = refresh_token;
        if (!school_id) throw new Error("permission denied")

        const { exam_id, addtional_marks } = req.body;
        console.log({ addtional_marks })

        if (!exam_id || !addtional_marks) throw new Error("required field missing")
        const datas = addtional_marks?.forEach(async ({ id, total_mark }) => {
            // if (!id || !addtional_mark_id || !total_mark) throw new Error("addtional marks fields missing")
            console.log({ id, total_mark })
            await prisma.examAddtionalMark.update({
                where: { id },
                data: { total_mark }
            });
        });

        res.status(200).json({ message: 'updeated successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default patch;
