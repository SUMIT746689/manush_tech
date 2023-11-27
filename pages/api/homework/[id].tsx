import prisma from "@/lib/prisma_client";
import { fileDelete } from "@/utils/upload";
import { authenticate } from "middleware/authenticate";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { id, academic_year_id } = req.query;

        switch (method) {
            case 'DELETE':
                const deletedHomeWork = await prisma.homework.delete({
                    where: {
                        id: Number(id),
                        academic_year_id: Number(academic_year_id),
                        student: {
                            student_info: {
                                user_id: refresh_token.id,
                                school_id: refresh_token.school_id
                            }
                        }
                    }
                })
                fileDelete([deletedHomeWork?.file_path])
                res.status(200).json({ message: 'Home work deleted!' })
                break;
            default:
                res.setHeader('Allow', ['PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(id);
