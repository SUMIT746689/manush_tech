import prisma from "@/lib/prisma_client";
import { fileUpload, unknownFileDelete } from "@/utils/upload";
import { authenticate } from "middleware/authenticate";
import path from 'path';
export const config = {
    api: {
        bodyParser: false,
    },
};

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { academic_year_id, class_id, student_id, subject_id, date } = req.query;

        switch (method) {
            case 'GET':
                const homework = await prisma.homework.findMany({
                    where: {
                        academicYear: {
                            id: Number(academic_year_id),
                            school_id: refresh_token.school_id
                        },
                        subject: {
                            id: Number(subject_id),
                            class_id: Number(class_id)
                        }
                    }
                })
                res.status(200).json(homework);
                break;
            case 'POST':
                const uploadFolderName = 'homework';

                const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                const filterFiles = {
                    file: fileType,
                }

                const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
                console.log("files, fields__", files, fields);

                if (error) throw new Error('Error')
                res.status(200)
                const { file } = files;

                if (!subject_id || !student_id || !academic_year_id || !file) {
                    unknownFileDelete(files, [])
                    throw new Error('subject or student or academic_year or homework file missing !!')
                }

                unknownFileDelete(files, ['file'])

                await prisma.homework.create({
                    data: {
                        subject: { connect: { id: Number(subject_id) } },
                        student: { connect: { id: Number(student_id) } },
                        academicYear: { connect: { id: Number(academic_year_id) } },
                        date: new Date(date),
                        file_path: path.join(uploadFolderName, file?.newFilename)
                    }
                })
                res.status(200).json({message:'Home work submitted !!'});
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
