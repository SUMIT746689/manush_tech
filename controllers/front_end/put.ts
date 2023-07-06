import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';

const prisma = new PrismaClient();

const saveImage = (req, saveLocally) => {
    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), '/public/frontendPhoto');
        //@ts-ignore
        options.multiple = true;
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + '_' + path.originalFilename;
        };
    }
    // options.maxFileSize = 4000 * 1024 * 1024;
    options.multiples = true;
    const form = formidable(options);


    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};
async function put(req, res, refresh_token) {
    try {
        console.log('!!!!!!!!! hitted');
        // try {
        //     await fs.readdir(path.join(process.cwd() + '/public', '/frontendPhoto'));
        // } catch (error) {
        //     await fs.mkdir(path.join(process.cwd() + '/public', '/frontendPhoto'));
        // }
        // const { fields, files }: any = await saveImage(req, true);


        const uploadFolderName = "frontendPhoto";
        const fileUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/get_file/${uploadFolderName}`;

        await certificateTemplateFolder(uploadFolderName);

        const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
        const filterFiles = {
            carousel_image: fileType,
            header_image: fileType,
            chairman_photo: fileType,
            principal_photo: fileType,
        }

        const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName, uniqueFileName: false });
        // const {
        //     header_image,
        //     carousel_image,
        //     history_photo,
        //     history_description,
        //     chairman_photo,
        //     chairman_speech,
        //     principal_photo,
        //     principal_speech
        // } = req.body;
        console.log({ fields, files });

        console.log("aaaaaaaaaaaaa__", typeof(fields.carousel_image_name_list),fields.carousel_image_name_list);

        // const websiteUiId = await prisma.websiteUi.findFirst({
        //     where: {
        //         school_id: refresh_token?.school_id
        //     }
        // })

        // const ui = await prisma.websiteUi.update({
        //     where: {
        //         id: websiteUiId.id
        //     },
        //     data: {
        //         header_image: files.header_image?.newFilename,
        //         carousel_image: carousel_image_name_list.
        //     }
        // });
        res.status(200).json({});
    } catch (error) {
        res.status(404).json({ Error: error.message });
    }
}
export default authenticate(put);