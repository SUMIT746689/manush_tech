import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const id = parseInt(req.query.id);

        switch (method) {
            case 'DELETE':
                await prisma.gradingSystem.delete({
                    where: {
                        id: id,
                        school_id: refresh_token?.school_id
                    }
                });
                res.status(200).json({ success: 'Grading System deleted successfully!' });
                break;

            default:
                res.setHeader('Allow', ['DELETE']);
                logFile.error(`Method ${method} Not Allowed`);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(id);
