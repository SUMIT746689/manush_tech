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

            await fsP.rename(files.header_image.filepath, path.join(process.cwd(), 'files', uploadFolderName, header_imageNewName))
                .then(() => {
                    query['header_image'] = path.join('files', uploadFolderName, header_imageNewName)
                    const filePath = path.join(process.cwd(), websiteUirow.header_image);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                })
                .catch(err => {
                    query['header_image'] = path.join('files', uploadFolderName, files.header_image?.newFilename)
                })

        }
        if (files.history_photo?.newFilename) {
            const history_photoNewName = Date.now().toString() + '_' + files.history_photo.originalFilename;
            await fsP.rename(files.history_photo.filepath, path.join(process.cwd(), 'files', uploadFolderName, history_photoNewName))
                .then(() => {
                    query['history_photo'] = path.join('files', uploadFolderName, history_photoNewName)
                    const filePath = path.join(process.cwd(), websiteUirow.history_photo);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                })
                .catch(err => {
                    query['history_photo'] = path.join('files', uploadFolderName, files.history_photo?.newFilename)
                })

        }
        if (files.chairman_photo?.newFilename) {
            const chairman_photoNewName = Date.now().toString() + '_' + files.chairman_photo.originalFilename;

            await fsP.rename(files.chairman_photo.filepath, path.join(process.cwd(), 'files', uploadFolderName, chairman_photoNewName))
                .then(() => {
                    query['chairman_photo'] = path.join('files', uploadFolderName, chairman_photoNewName)
                    const filePath = path.join(process.cwd(), websiteUirow.chairman_photo);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                })
                .catch(err => {
                    query['chairman_photo'] = path.join('files', uploadFolderName, files.chairman_photo?.newFilename)
                })
        }
        if (files.principal_photo?.newFilename) {
            const principal_photoNewName = Date.now().toString() + '_' + files.principal_photo.originalFilename;


            await fsP.rename(files.principal_photo.filepath, path.join(process.cwd(), 'files', uploadFolderName, principal_photoNewName))
                .then(() => {
                    query['principal_photo'] = path.join('files', uploadFolderName, principal_photoNewName)
                    const filePath = path.join(process.cwd(), websiteUirow.principal_photo);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                })
                .catch(err => {
                    query['principal_photo'] = path.join('files', uploadFolderName, files.principal_photo?.newFilename)
                })
        }
        if (files.carousel_image && files.carousel_image.length) {
            const carousel_imageList = []

            for (const i of files.carousel_image) {
                const newName = Date.now().toString() + '_' + i.originalFilename
                const newFilePath = path.join(process.cwd(), 'files', uploadFolderName, newName);

                // fs.rename(i.filepath, newFilePath, (err) => {
                //     if (err) {
                //         carousel_imageList.push({
                //             name: i.newFilename,
                //             path: path.join("files", uploadFolderName, i.newFilename)
                //         })
                //     } else {

                //         carousel_imageList.push({
                //             name: newName,
                //             path: path.join("files", uploadFolderName, newName)
                //         })
                //         //         // const filePath = path.join(process.cwd(), oldPath);
                //         //         // if (fs.existsSync(filePath)) {
                //         //         //     fs.unlinkSync(filePath)
                //         //         // }
                //     }
                // })

                await fsP.rename(i.filepath, newFilePath)
                    .then(() => {
                        carousel_imageList.push({
                            name: newName,
                            path: path.join("files", uploadFolderName, newName)
                        })
                        // const filePath = path.join(process.cwd(), oldPath);
                        // if (fs.existsSync(filePath)) {
                        //     fs.unlinkSync(filePath)
                        // }
                    })
                    .catch(err => {
                        carousel_imageList.push({
                            name: i.newFilename,
                            path: path.join("files", uploadFolderName, i.newFilename)
                        })
                    })

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

        // if (websiteUirow) {


        //     await prisma.websiteUi.update({
        //         where: {
        //             id: websiteUirow.id
        //         },
        //         data: query
        //     });


        // }
        // else {
        //     await prisma.websiteUi.create({
        //         data: {
        //             ...query,
        //             history_description: '',
        //             school: {
        //                 connect: {
        //                     id: refresh_token?.school_id
        //                 }
        //             }
        //         }
        //     })
        // }

        res.status(200).json({ message: 'frontend information updated !' });
    } catch (error) {
        res.status(404).json({ Error: error.message });
    }
}
export default authenticate(put);