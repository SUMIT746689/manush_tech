import prisma from '@/lib/prisma_client';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import getAudioDurationInSeconds from 'get-audio-duration';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { handleGetFileDuration } from 'utilities_api/fileDuration';
import { handleDeleteFile } from 'utilities_api/handleDeleteFiles';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
  let voice_file_path;
  try {
    const uploadFolderName = "voice_templates";

    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['audio/wav', 'audio/x-wav'];

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
    voice_file_path = voice_file.filepath;

    const [duration, durationErr] = await handleGetFileDuration(voice_file_path);

    if (durationErr) throw new Error(durationErr);

    const response = await prisma.voiceTemplate.create({
      data: {
        // @ts-ignore
        name: name,
        voice_url: voice_file && path.join(uploadFolderName, voice_file?.newFilename),
        voice_duration: duration,
        school_id: Number(refresh_token.school_id)
      }
    });

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    if (voice_file_path) handleDeleteFile(voice_file_path)
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)
