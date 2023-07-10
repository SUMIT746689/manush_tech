import { authenticate } from 'middleware/authenticate';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import path from 'path';
import prisma from '@/lib/prisma_client';
import fs from 'fs';


async function post(req, res, refresh_token) {
  try {
    const { id } = req.query;
    console.log({id})
    const uploadFolderName = "notice";
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/get_file/files/${uploadFolderName}/`;

    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    console.log({error})
    if (error) throw new Error(error);

    const { photo } = files;
    const { title, description } = fields;

    if (!photo && !title && !description) throw new Error(`no field found for update `)

    const customFileName = Date.now().toString() + '_' + photo?.originalFilename;
    const newFileName = path.join(process.cwd(), "files", uploadFolderName, customFileName);

    if (photo) {
      // @ts-ignore
      fs.rename(photo.filepath, newFileName, (err) => { console.log({ err }) })
    }

    const data = {};
    if (title) data['title'] = title;
    if (description) data['description'] = description;
    if (photo) data['photo_url'] = fileUrl + customFileName;

    const response = await prisma.notice.update({
      where: { id : Number(id)},
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