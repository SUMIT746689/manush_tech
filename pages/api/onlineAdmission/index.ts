import { fileRename, fileUpload } from '@/utils/upload';
import prisma from '@/lib/prisma_client';

export const config = {
    api: {
        bodyParser: false
    }
};

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const requestList = await prisma.onlineAdmission.findMany();
                res.status(200).json(requestList);
                break;
            case 'POST':
                const uploadFolderName = 'onlineAdmission';

                const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
                const filterFiles = {
                    logo: fileType,
                    signature: fileType,
                    background_image: fileType,
                }

                const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
                
                console.log(files, fields);
                
                if (error) {
                    throw new Error('Server Error !')
                }
                const filePathQuery = {}

                if (files?.student_photo?.newFilename) {
                    filePathQuery['student_photo_path'] = await fileRename(files,
                        uploadFolderName, "student_photo",
                        Date.now().toString() + '_' + files?.student_photo?.originalFilename)
                }
                if (files?.father_photo?.newFilename) {
                    filePathQuery['father_photo_path'] = await fileRename(files,
                        uploadFolderName, "father_photo",
                        Date.now().toString() + '_' + files?.father_photo?.originalFilename)
                }
                if (files?.mother_photo?.newFilename) {
                    filePathQuery['mother_photo_path'] = await fileRename(files,
                        uploadFolderName, "mother_photo",
                        Date.now().toString() + '_' + files?.mother_photo?.originalFilename)
                }
                if (files?.guardian_photo?.newFilename) {
                    filePathQuery['guardian_photo_path'] = await fileRename(files,
                        uploadFolderName, "guardian_photo",
                        Date.now().toString() + '_' + files?.guardian_photo?.originalFilename)
                }

                await prisma.onlineAdmission.create({
                    data: {
                        student: {
                            ...fields,
                            filePathQuery
                        }
                    }
                })
                res.status(200).json({ success: true, message: "Admission Application submitted !!" });
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

export default index;
