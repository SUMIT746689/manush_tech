import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res,refresh_token) => {
    try {
        console.log({refresh_token});
        
        const { method } = req;

        switch (method) {
            case 'GET':
                let query = {}
                if (req.query.academic_year) {
                    query = {...query,
                        academic_year: {
                            id: parseInt(req.query.academic_year)
                        }
                    }
                }
                if(req.query.section_id){
                    query={...query,
                        section:{
                            id: parseInt(req.query.section_id)
                        }
                    }
                }

                const exams = await prisma.exam.findMany({
                    where: {
                        school: {
                            id: refresh_token.school_id
                        },
                        ...query
                    },
                    // include: {
                    //     section: {
                    //         select: {
                    //             name: true
                    //         }
                    //     },
                    //     academic_year: {
                    //         select: {
                    //             title: true
                    //         }
                    //     },
                    //     exam_details: {
                    //         select: {
                    //             subject: true
                    //         }
                    //     }
                    // }
                });
                res.status(200).json(exams);
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

export default authenticate(index) ;
