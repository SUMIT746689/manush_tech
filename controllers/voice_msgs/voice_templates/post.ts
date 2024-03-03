import prisma from '@/lib/prisma_client';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
  try {
    const uploadFolderName = "voice_templates";

    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['audio/wav'];

    const filterFiles = {
      voice_file: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (files && error)
      // @ts-ignore
      for (const [key, value] of Object.entries(files)) fs.unlink(value.filepath, (err) => { if (err) console.log({ err }) })

    if (error) throw new Error(error);

    const { name } = fields;
    const { voice_file } = files;

    if (!name || !voice_file) throw new Error("provide all required datas");

    const response = await prisma.voiceTemplate.create({
      data: {
        // @ts-ignore
        name: name,
        voice_url: voice_file && path.join(uploadFolderName, voice_file?.newFilename),
        school_id: Number(refresh_token.school_id)
      }
    });

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)