import { authenticate } from 'middleware/authenticate';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import path from 'path';
import prisma from '@/lib/prisma_client';
import fs from 'fs';
import fsP from 'fs/promises';


async function post(req, res, refresh_token) {
  try {
    const { id } = req.query;
    console.log({ id })
    const uploadFolderName = "notice";

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    console.log({ error })
    if (error) throw new Error(error);

    const { photo } = files;
    const { title, headLine } = fields;

    let file_url = null;

    if (photo) {
      const prevFile = await prisma.notice.findFirst({
        where: {
          id: Number(id)
        }
      })
      if (prevFile) {
        const filePath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, prevFile.file_url);
        if (fs.existsSync(filePath)) {
        
          fs.unlink(filePath, (err) => {
            if (err) console.log('prev File failed');
            else console.log("prev File deleted !");
          })
        }
      }

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


    const data = {};
    if (title) data['title'] = title;
    if (headLine) data['headLine'] = headLine;
    if (file_url) data['file_url'] = file_url;

    const response = await prisma.notice.update({
      where: { id: Number(id) },
      data
    })

    res.json({ data: response, success: true });
    res.end()

  } catch (err) {
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)