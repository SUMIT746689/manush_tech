import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { fileUpload } from '@/utils/upload';
import prisma from '@/lib/prisma_client';
import { verifyNumber } from 'utilities_api/verify';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: any, res: any, refresh_token) => {
  try {

    if (!refresh_token.school_id) throw new Error('permission denied');

    const uploadFolderName = "sms_requests";

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const filterFiles = {
      photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (error) throw new Error(error);

    const { document_photo } = files;
    const { masking_count, non_masking_count } = fields;

    if (!document_photo) return res.status(404).json({ message: 'file missing !!' });
    if (!masking_count && !non_masking_count)
      return res.status(404).json({ message: 'field value missing !!' });
    

    const upload_path = path.join(uploadFolderName, document_photo?.newFilename);
    const response = await prisma.requestBuySms.create({
      data: {
        school_id: verifyNumber(refresh_token.school_id),
        masking_count: verifyNumber(masking_count),
        non_masking_count: verifyNumber(non_masking_count),
        document_photo: upload_path,
        status: 'pending'
      }
    });

    if (!response) throw new Error('failed to create');
    res.status(201).json({ success: 'created successfully' });
    // });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};




export default authenticate(post);
