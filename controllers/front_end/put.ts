import { authenticate } from 'middleware/authenticate';
import path from 'path';
import formidable from 'formidable';
import { imageFolder, fileUpload, fileRename } from '@/utils/upload';
import prisma from '@/lib/prisma_client';
import fs from 'fs';
import fsP from "fs/promises";
async function put(req, res, refresh_token) {
    try {
        const uploadFolderName = "frontendPhoto";

        const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
        const filterFiles = {
            carousel_image: fileType,
            header_image: fileType,
            chairman_photo: fileType,
            principal_photo: fileType,
        }

        const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName, uniqueFileName: false });
        // console.log({ error })

        console.log({ fields, files });
        //  console.log(files.carousel_image);

        if (error) {
            throw new Error('something wrong !')
        }


        const websiteUirow = await prisma.websiteUi.findFirst({
            where: {
                school_id: refresh_token?.school_id
            }
        })

        const query = {};
        if (files.header_image?.newFilename) {

            const header_imageNewName = Date.now().toString() + '_' + files.header_image.originalFilename;

            await fsP.rename(files.header_image.filepath, path.join(process.cwd(), 'public', uploadFolderName, header_imageNewName))
                .then(() => {
                    query['header_image'] = path.join( uploadFolderName, header_imageNewName)
                    const filePath = path.join(process.cwd(),"public", websiteUirow.header_image);
                    if (fs.existsSync(filePath)) {
                        console.log("header_image__");

                        fs.unlinkSync(filePath)
                        console.log("header_image deleted__");
                    }
                })
                .catch(err => {
                    query['header_image'] = path.join( uploadFolderName, files.header_image?.newFilename)
                })

        }
        if (files.history_photo?.newFilename) {
            const history_photoNewName = Date.now().toString() + '_' + files.history_photo.originalFilename;
            await fsP.rename(files.history_photo.filepath, path.join(process.cwd(), 'public', uploadFolderName, history_photoNewName))
                .then(() => {
                    query['history_photo'] = path.join( uploadFolderName, history_photoNewName)
                    const filePath = path.join(process.cwd(),"public", websiteUirow.history_photo);
                    if (fs.existsSync(filePath)) {
                        console.log("history_photo");
                        fs.unlinkSync(filePath)
                        console.log("history_photo");
                    }
                })
                .catch(err => {
                    query['history_photo'] = path.join( uploadFolderName, files.history_photo?.newFilename)
                })

        }
        if (files.chairman_photo?.newFilename) {
            const chairman_photoNewName = Date.now().toString() + '_' + files.chairman_photo.originalFilename;

            await fsP.rename(files.chairman_photo.filepath, path.join(process.cwd(), 'public', uploadFolderName, chairman_photoNewName))
                .then(() => {
                    query['chairman_photo'] = path.join( uploadFolderName, chairman_photoNewName)
                    const filePath = path.join(process.cwd(),"public", websiteUirow.chairman_photo);
                    if (fs.existsSync(filePath)) {
                        console.log("chairman_photo");
                        fs.unlinkSync(filePath)
                        console.log("chairman_photo");
                    }
                })
                .catch(err => {
                    query['chairman_photo'] = path.join( uploadFolderName, files.chairman_photo?.newFilename)
                })
        }
        if (files.principal_photo?.newFilename) {
            const principal_photoNewName = Date.now().toString() + '_' + files.principal_photo.originalFilename;


            await fsP.rename(files.principal_photo.filepath, path.join(process.cwd(), 'public', uploadFolderName, principal_photoNewName))
                .then(() => {
                    query['principal_photo'] = path.join( uploadFolderName, principal_photoNewName)
                    const filePath = path.join(process.cwd(),"public", websiteUirow.principal_photo);
                    if (fs.existsSync(filePath)) {
                        console.log("principal_photo");
                        fs.unlinkSync(filePath)
                        console.log("principal_photo");
                    }
                })
                .catch(err => {
                    query['principal_photo'] = path.join( uploadFolderName, files.principal_photo?.newFilename)
                })
        }
        let flag = false;

        if (files.carousel_image && files.carousel_image.length) {
            const carousel_imageList = []
            let index = 0;
            for (const i of files.carousel_image) {
                const newName = Date.now().toString() + '_' + i.originalFilename
                const newFilePath = path.join(process.cwd(), 'public', uploadFolderName, newName);

                await fsP.rename(i.filepath, newFilePath)
                    .then(() => {
                        carousel_imageList.push({
                            number: index,
                            originalFilename: i.originalFilename,
                            path: path.join( uploadFolderName, newName)
                        })

                    })
                    .catch(err => {
                        carousel_imageList.push({
                            number: index,
                            originalFilename: i.originalFilename,
                            path: path.join( uploadFolderName, i.newFilename)
                        })

                    })

                if (websiteUirow && !flag) {
                    for (const l of websiteUirow.carousel_image) {
                        const filePath = path.join(process.cwd(),"public", l.path);
                        console.log("filePath__", filePath);

                        if (fs.existsSync(filePath)) {
                            console.log(`${l.number}`);

                            fs.unlinkSync(filePath)
                            console.log(`${l.number}`);
                        }
                    }
                    flag = true;
                }
                index++;
            }
            query['carousel_image'] = carousel_imageList
        }
        if (fields?.school_history) {
            query['school_history'] = fields?.school_history
        }
        if (fields?.chairman_speech) {
            query['chairman_speech'] = fields?.chairman_speech
        }
        if (fields?.principal_speech) {
            query['principal_speech'] = fields?.principal_speech
        }
        console.log({ query });
        if (fields?.latest_news) {
            query['latest_news'] = fields?.latest_news
        }
        if (websiteUirow) {


            await prisma.websiteUi.update({
                where: {
                    id: websiteUirow.id
                },
                data: query
            });


        }
        else {
            await prisma.websiteUi.create({
                data: {
                    header_image: query?.header_image,
                    carousel_image: query?.carousel_image,
                    school_history: query?.school_history,
                    history_photo: query?.history_photo,
                    history_description: '',
                    chairman_photo: query?.chairman_photo,
                    chairman_speech: query?.chairman_speech,
                    principal_photo: query?.principal_photo,
                    principal_speech: query?.principal_speech,
                    school: {
                        connect: {
                            id: refresh_token?.school_id
                        }
                    },
                    latest_news: query?.latest_news
                }
            })
        }

        res.status(200).json({ message: 'frontend information updated !' });
    } catch (error) {
        res.status(404).json({ Error: error.message });
    }
}
export default authenticate(put);