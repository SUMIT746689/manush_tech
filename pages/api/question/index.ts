import prisma from '@/lib/prisma_client';
import { fileUpload } from '@/utils/upload';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { logFile } from 'utilities_api/handleLogFile';
export const config = {
    api: {
        bodyParser: false,
    },
};
const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { exam_details_id } = req.query
                const query = {}
                if (exam_details_id) {
                    query['id'] = Number(exam_details_id)
                }
                const questions = await prisma.question.findMany({
                    where: {
                        exam_details: {
                            ...query,
                            exam: {
                                school_id: refresh_token.school_id
                            }
                        }
                    },
                    include: {

                        exam_details: {
                            select: {
                                id: true,
                                subject_total: true,
                                exam: {
                                    select: {
                                        id: true,
                                        title: true,
                                        section: {
                                            select: {
                                                id: true,
                                                name: true,
                                                class: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        has_section: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                subject: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })
                res.status(200).json(questions);
                break;
            case 'POST':

                const uploadFolderName = 'question';

                const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                const filterFiles = {
                    file: fileType,
                }

                const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
                console.log("files, fields__", files, fields);

                if (error) throw new Error('Error')

                const { file } = files;

                await prisma.question.create({
                    data: {
                        exam_details: {
                            connect: {
                                id: Number(fields.exam_details_id)
                            }
                        },
                        content: fields?.content ? fields?.content : null,
                        file: file?.newFilename ? path.join(uploadFolderName, file?.newFilename) : null
                    }
                })
                res.status(200).json({ message: 'Question created successfully' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);
