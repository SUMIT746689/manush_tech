import prisma from "@/lib/prisma_client";
import adminCheck from "middleware/adminCheck";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const id = parseInt(req.query.id)
        if (!id) throw new Error('valid id required')

        switch (method) {
            case 'PATCH':
                await prisma.department.update({
                    where: {
                        id: Number(req.query.id),
                        school_id: refresh_token?.school_id
                    },
                    data: {
                        title: req.body.title
                    }
                });

                res.status(200).json({ success: true, message: 'Department title updated successfully !' });
                break;
            case 'DELETE':
                await prisma.department.delete({
                    where: {
                        id: id,
                        school_id: refresh_token?.school_id
                    },
                })
                res.status(200).json({ message: 'Department deleted successfully' })
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                logFile.error(`Method ${method} Not Allowed`);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message);
        res.status(500).json({ message: 'Department deleation failed !' });

    }
}

export default authenticate(adminCheck(id))  
