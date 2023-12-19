import { authenticate } from 'middleware/authenticate';
import { fileUpload } from '@/utils/upload';
import path from 'path';
import prisma from '@/lib/prisma_client';
import fsP from 'fs/promises'

async function post(req, res, refresh_token) {
  try {
    const uploadFolderName = "notice";

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (error) throw new Error(error);

    const { photo } = files;
    const { title, headLine } = fields;

    if (!title || !headLine) throw new Error('required all field')

    let file_url = '';
    
    if (photo) {
      const photoNewName = Date.now().toString() + '_' + files.photo.originalFilename;
      await fsP.rename(files.photo.filepath, path.join(process.cwd(), `${process.env.FILESFOLDER}`, uploadFolderName, photoNewName))
        .then(() => {
          file_url = path.join(uploadFolderName, photoNewName)

        })
        .catch(err => {
          console.log("err__", err);
          file_url = path.join(uploadFolderName, files.photo?.newFilename)
        })
    }
    //fields checks 

    const response = await prisma.notice.create({
      data: {
        title,
        headLine,
        file_url,
        school_id: refresh_token.school_id
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