import prisma from "@/lib/prisma_client";

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { section_id, school_id, academic_year_id } = req.query
                if (!section_id || !school_id || !academic_year_id) {
                    res.status(500).json({ message: "section_id or school_id missing" })
                }
                const routine = await prisma.exam.findMany({
                    where: {
                        section_id: parseInt(section_id),
                        school_id: parseInt(school_id),
                        academic_year_id: parseInt(academic_year_id)
                    },
                    include: {
                        exam_details: {
                            include: {
                                subject: true,
                                room: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }

                })
                res.status(200).json(routine);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default index;
