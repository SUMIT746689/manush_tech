import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { fileUpload } from '@/utils/upload';
import prisma from '@/lib/prisma_client';
import { verifyNumber } from 'utilities_api/verify';
import { logFile } from 'utilities_api/handleLogFile';
import { handleDeleteFile } from 'utilities_api/handleDeleteFiles';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: any, res: any, refresh_token) => {
  try {
    const { school_id } = refresh_token;

    if (!school_id) throw new Error('permission denied');

    const uploadFolderName = "sms_requests";

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (error) throw new Error(error);

    const { document_photo } = files;
    const { sms_type, amount } = fields;

    try {
      if (!document_photo) throw new Error('file missing !!');
      if (!sms_type || !amount) throw new Error("sms_type or amount field is missing");

      const { non_masking_sms_price, masking_sms_price } = await prisma.school.findFirst({
        where: {
          id: school_id
        },
        select: {
          non_masking_sms_price: true,
          masking_sms_price: true
        }
      });

      let masking_count = 0;
      let non_masking_count = 0;

      if (sms_type === "masking") {
        if (!masking_sms_price) throw new Error('school masking sms price not valid');
        masking_count = Math.round((amount || 0) / (masking_sms_price || 0))
      }

      else if (sms_type === "non-masking") {
        if (!non_masking_sms_price) throw new Error('school non masking sms price not valid');
        non_masking_count = Math.round((amount || 0) / (non_masking_sms_price || 0))
      }

      const upload_path = path.join(uploadFolderName, document_photo?.newFilename);
      const response = await prisma.requestBuySms.create({
        data: {
          school_id: verifyNumber(refresh_token.school_id),
          masking_count,
          non_masking_count,
          document_photo: upload_path,
          status: 'pending'
        }
      });

      if (!response) throw new Error('failed to create');
      res.status(201).json({ success: 'created successfully' });
    } catch (err) {
      if(document_photo) handleDeleteFile(document_photo.filepath);
      logFile.error(err.message);
      console.log(err.message);
      res.status(404).json({ error: err.message });
    }
  } catch (err) {
    logFile.error(err.message)
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};




export default authenticate(post);
