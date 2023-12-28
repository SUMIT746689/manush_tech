import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const Id = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'DELETE':

                await prisma.teacherRecruitment.delete({
                    where: {
                        id: Number(req.query.id)
                    }
                })
                res.status(200).json({ message: 'Teacher Recruitment request also deleted !' });
                break;
            default:
                res.setHeader('Allow', ['DELETE']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });

    }
}

export default authenticate(Id) 