import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';


const handleDelete = async (req, res) => {
    try {
        console.log("req.query.id___", req.query.id);

        const student_id = parseInt(req.query.id)

        // await prisma.student.update({
        //     where: {
        //         id: student_id
        //     },
        //     data: {
        //         student_info: {
        //             update: {
        //                 user: {
        //                     update: {
        //                         created_at: new Date()
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })

        const user_id = await prisma.student.findFirst({
            where: {
                id: student_id
            },
            select: {
                student_info: {
                    select: {
                        user_id: true
                    }
                }
            }
        })
        await prisma.user.update({
            where: {
                id: user_id.student_info.user_id
            },
            data: {
                deleted_at: new Date()
            }
        })
        res.status(200).json({ message: 'Student deleted successfully !' })

    } catch (error) {
        console.log(error);

        res.status(404).json({ Error: error.message });
    }
}

export default authenticate(handleDelete) 