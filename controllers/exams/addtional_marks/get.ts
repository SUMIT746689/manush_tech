import prisma from "@/lib/prisma_client";

const get = async (req, res, refresh_token) => {
    try {
        let query = {
            where: {
                school_id: refresh_token.school_id
            }
        };
        const resAddMarks = await prisma.examAddtionalMark.findMany({
            where: { exam_id: req.query.exam_id ? parseInt(req.query.exam_id) : undefined },
            include: {
                addtionalMarkingCategorie:true
            }
        });

        res.status(200).json(resAddMarks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export default get;