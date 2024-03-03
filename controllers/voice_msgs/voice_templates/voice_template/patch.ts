import prisma from '@/lib/prisma_client';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { logFile } from 'utilities_api/handleLogFile';

async function patch(req, res, refresh_token) {
  try {
    const { id } = req.query;

    const uploadFolderName = "voice_templates";

    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['audio/wav'];

    const filterFiles = {
      voice_file: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    // if (files && (error || !logo || !signature || !background_image))
    if (files && error)
      // @ts-ignore
      for (const [key, value] of Object.entries(files)) fs.unlink(value.filepath, (err) => { if (err) console.log({ err }) })

    if (error) throw new Error(error);

    const { name } = fields;
    const { voice_file } = files;

    if (!name) throw new Error("provide valid data");

    console.log({ voice_file })
    const response = await prisma.voiceTemplate.update({
      where: { id: parseInt(id) },
      data: {
        // @ts-ignore
        name: name,
        voice_url: voice_file && path.join(uploadFolderName, voice_file?.newFilename),
        school_id: Number(refresh_token.school_id)
      }
    });

    return res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch)