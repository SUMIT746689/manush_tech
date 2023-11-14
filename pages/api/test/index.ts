import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const singleStudentResult = unique_tracking_number()

                res.status(200).json({singleStudentResult,lenght:singleStudentResult.length});
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

export default (index);
