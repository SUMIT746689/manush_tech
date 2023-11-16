import prisma from "@/lib/prisma_client";
import { fileUpload } from "@/utils/upload";
import path from 'path';
import fs from 'fs';
import fsP from 'fs/promises';

export const config = {
    api: {
        bodyParser: false,
    },
};
const Question = async (req, res) => {
    const uploadFolderName = 'question';

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const filterFiles = {
        file: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    console.log({ files, fields })
    console.log({ error })
    try {
        const { method } = req;
        const id = parseInt(req.query.id);

        switch (method) {

            case 'PATCH':

                if (error) throw new Error(error);

                const { file } = files;
                const { content } = fields;

                let file_url = null;

                if (file) {

                    const fileNewName = Date.now().toString() + '_' + file.originalFilename;
                    await fsP.rename(file.filepath, path.join(process.cwd(), `${process.env.FILESFOLDER}`, uploadFolderName, fileNewName))
                        .then(() => {
                            file_url = path.join(uploadFolderName, fileNewName)

                        })
                        .catch(err => {
                            console.log("err__", err);
                            file_url = path.join(uploadFolderName, files.file?.newFilename)
                        })
                    await prevDelete(id)
                }


                const data = {};
                if (content) data['content'] = content;
                if (file_url) data['file'] = file_url;

                await prisma.question.update({
                    where: { id: Number(id) },
                    data
                })

                res.status(200).json({ message: 'Question successfully updated' });
                break;

            case 'DELETE':
                await prisma.question.delete({
                    where: {
                        id: id
                    }
                });
                prevDelete(id)
                res.status(200).json({ message: 'Question deleted successfully' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        for (const i in files) {
            deleteFiles(files[i].filepath)
        }
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


const prevDelete = async (id) => {
    try {
        const prevFile = await prisma.question.findFirst({
            where: {
                id: Number(id)
            }
        })
        if (prevFile) {
            const filePath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, prevFile.file);
            if (fs.existsSync(filePath)) {
                deleteFiles(filePath)
            }
        }
    } catch (err) {
        console.log(err);
    }
}
const deleteFiles = (path) => {
    fs.unlink(path, (err) => {
        console.log({ err });
    });
};
export default Question;
