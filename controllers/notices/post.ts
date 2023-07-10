import { authenticate } from 'middleware/authenticate';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import path from 'path';
import prisma from '@/lib/prisma_client';
import fs from 'fs';


async function post(req, res, refresh_token) {
  try {
    const uploadFolderName = "notice";
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/get_file/files/${uploadFolderName}/`;
   
    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (error) throw new Error(error);

    const { photo } = files;

    const notFoundFiles = [];

    if (!photo) notFoundFiles.push('photo');

    if (notFoundFiles.length > 0) throw new Error(`${notFoundFiles.join(', ')} file not found`)
    
    const customFileName =  Date.now().toString() + '_' + photo.originalFilename;
    const newFileName = path.join(process.cwd(),"files", uploadFolderName,customFileName);

    
    // @ts-ignore
    fs.rename(photo.filepath, newFileName, (err) => { console.log({ err }) })
    
    //fields checks 
    const { title, description } = fields;
    if (!title || !description) throw new Error('required all field')

    const response = await prisma.notice.create({
      data: {
        title,
        description,
        photo_url: fileUrl + customFileName,
        school_id : refresh_token.school_id
      }
    })

    res.json({ data: response, success: true });
    res.end()


  } catch (err) {
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)