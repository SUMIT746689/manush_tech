import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import axios from 'axios';
import { readFileSync } from 'fs';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import mime from 'mime';
import { Blob } from 'buffer';

async function post(req, res, refresh_token) {
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

    const { gateway_id, msisdn } = fields;
    const { voice_file } = files;

    if (!gateway_id || !msisdn || !voice_file) throw new Error("provide all required datas");
    console.log({ fields, files })
    var bufferValue = Buffer.from(JSON.parse(fields.voiceData), "base64");

    const authenticateHeader = 'Authorization: Bearer PktcjYCSqYgM6zR1uhozUmd0unVr5LnB';
    // console.log(voice_file);
    // const readFile = await openAsBlob (voice_file.filepath);
    // const readFile = await openAsBlob(voice_file.filepath);
    // const file = new Blob([readFileSync(voice_file.filepath)], { type: mime.getType(voice_file.filepath) });
    const readFile_ = readFileSync(voice_file.filepath);
    // console.log({ readFile_ })
    // const file = new Blob([readFileSync(voice_file.filepath)]);
    // console.log({ file })
    const file_ = new File([JSON.parse(fields.voiceData)], voice_file.originalFilename, { type: mime.getType(voice_file.filepath) })
    // console.log(file_);
    // const form  = new File(file,mime.getType(voice_file.filepath))
    const formData = new FormData();
    formData.append("message_id", "654986542653")
    formData.append("receivers", "8801776912033")
    formData.append("total_contact_count", "1")
    formData.append("type", "single")

    formData.append("audio_file", file_)
    formData.append("duration", "3")
    formData.append("sender_id", "8809677602858")
    formData.append("base_url", "http://msg.elitbuzz-bd.com")

    console.log(formData)
    const resp = await axios.post("http://103.204.81.117:9999/send",
      new URLSearchParams(formData)
      // {
      //   "message_id": "654986542653",
      //   "receivers": "8801776912033",
      //   "total_contact_count": 1,
      //   "type": "single",
      //   "audio_file": file,
      //   "duration": 3,
      //   "sender_id": "8809677602858",
      //   "base_url": "http://msg.elitbuzz-bd.com"

      // }
      , { headers: { 'Authorization': 'Bearer PktcjYCSqYgM6zR1uhozUmd0unVr5LnB' } }
      // ,{ headers: formData.getHeaders() }
    );
    console.log(resp.data);
    const response = {};

    // const response = await prisma.voiceTemplate.create({
    //   data: {
    //     // @ts-ignore
    //     name: name,
    //     voice_url: voice_file && path.join(uploadFolderName, voice_file?.newFilename),
    //     school_id: Number(refresh_token.school_id)
    //   }
    // });

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    console.log({ err: err })
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)