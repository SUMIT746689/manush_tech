import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { exam_id, subject_id, academic_year_id, syllabus_details_id } = req.query;

        switch (method) {
            case 'GET':
                const query = {}
                if (subject_id) query['subject_id'] = Number(subject_id)

                const all = {}
                if (!subject_id) {
                    all['include'] = {
                        syllabus: {
                            select: {
                                subject: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
                const syllabus = await prisma.syllabus_details.findMany({
                    where: {
                        syllabus: {
                            exam_id: Number(exam_id),
                            ...query,
                            academicYear: {
                                id: Number(academic_year_id),
                                school_id: refresh_token.school_id,
                            }
                        }
                    },
                    ...all
                });
                res.status(200).json(syllabus);
                break;
            case 'POST':

                await prisma.academicYear.findFirstOrThrow({
                    where: {
                        id: Number(academic_year_id),
                        school_id: refresh_token.school_id,
                        deleted_at:null
                    }
                })
                const syllabusMain = await prisma.syllabus.findFirst({
                    where: {
                        exam_id: Number(exam_id),
                        subject_id: Number(subject_id),
                        academic_year_id: Number(academic_year_id),
                    },
                    select: {
                        id: true
                    }
                })
                if (syllabusMain) {
                    await prisma.syllabus_details.create({
                        data: {
                            syllabus: {
                                connect: { id: syllabusMain.id }
                            },
                            body: req.body.body
                        }
                    })
                }
                else {
                    await prisma.syllabus.create({
                        data: {
                            exam_id: Number(exam_id),
                            subject_id: Number(subject_id),
                            academic_year_id: Number(academic_year_id),
                            Syllabus_details: {
                                create: {
                                    body: req.body.body
                                }
                            }
                        }
                    })
                }
                res.status(200).json({ message: 'Syllabus created successfully' });
                break;

            case 'PATCH':
                console.log(req.query);

                const syllabusDetails = await prisma.syllabus_details.findFirstOrThrow({
                    where: {
                        id: Number(syllabus_details_id),
                        syllabus: {
                            exam_id: Number(exam_id),
                            subject_id: Number(subject_id),
                            academicYear: {
                                id: Number(academic_year_id),
                                school_id: refresh_token.school_id,
                            }
                        }
                    },
                    select: {
                        id: true
                    }

                })
                await prisma.syllabus_details.update({
                    where: {
                        id: syllabusDetails.id,
                    },
                    data: {
                        body: req.body.body
                    }
                })
                res.status(200).json({ message: 'Syllabus updated successfully' });
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

export default authenticate(index);
