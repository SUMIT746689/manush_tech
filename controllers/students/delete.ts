import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


async function Delete(req, res, refresh_token) {
    try {
        const student_id = parseInt(req.query.id)
        // await prisma.student.update({
        //     where: {
        //         id: student_id
        //     },
        //     data: {
        //         student_info: {
        //             update:{
        //                 user:{
        //                     update:{
                                
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })

    } catch (error) {
        res.status(404).json({ Error: error.message });
    }
}

export default authenticate(Delete)