import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';

const prisma = new PrismaClient();
const saveImage = (req, saveLocally) => {
    const options: formidable.Options = {};

    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), '/public/files');
        //@ts-ignore
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + '_' + path.originalFilename;
        };
    }
    // options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            if (
                !fields.first_name ||
                !fields.section_id ||
                !fields.academic_year_id ||
                !fields.username ||
                !fields.password ||
                !fields.admission_date ||
                !fields.date_of_birth ||
                !fields.roll_no ||
                !fields.registration_no ||
                !fields.school_id
            ) {
                reject({ message: 'field value missing !!' });
            }
            resolve({ fields, files });
        });
    });
};
async function put(req, res, refresh_token) {
    try {

        try {
            await fs.readdir(path.join(process.cwd() + '/public', '/files'));
        } catch (error) {
            await fs.mkdir(path.join(process.cwd() + '/public', '/files'));
        }
        const { fields, files }: any = await saveImage(req, true);
        const {
            header_image,
            carousel_image,
            history_photo,
            history_description,
            chairman_photo,
            chairman_speech,
            principal_photo,
            principal_speech
        } = req.body;

        const websiteUiId = await prisma.websiteUi.findFirst({
            where: {
                school_id: refresh_token?.school_id
            }
        })
        // const ui = await prisma.websiteUi.update({
        //     where: {
        //         id: websiteUiId.id
        //     },
        //     data: {
        //         header_image: files.header_image?.newFilename,
        //         carousel_image: 
        //     }
        // });
        res.status(200).json({});
    } catch (error) {
        res.status(404).json({ Error: error.message });
    }
}
export default authenticate(put);