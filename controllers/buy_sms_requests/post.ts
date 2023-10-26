import { authenticate } from 'middleware/authenticate';
import formidable from 'formidable';
import path from 'path';
import { imageFolder } from '@/utils/upload';
import prisma from '@/lib/prisma_client';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: any, res: any, refresh_token) => {
  try {

    if (!refresh_token.school_id) throw new Error('permission denied');

    await imageFolder();
    const options: formidable.Options = {};

    options.uploadDir = path.join(process.cwd(), '/public/files');
    // options.multiple = true;
    options.maxFieldsSize = 1 * 1024 * 1024;

    // options.maxFields = 2;
    options.keepExtensions = true;
    // @ts-ignore
    options.filename = (name, ext, path, form) => {

      return Date.now().toString() + '_' + path.originalFilename;
    };
    options['filter'] = function ({ name, mimetype }) {

      // if (name === 'document_photo')
      //   if (!['application/pdf','image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)) {
      //     throw new Error('invalid photo');
      //     // return res.json('Only png, jpg & jpeg file is supported');
      //   }
      return true;
    };

    const form = await formidable(options);

    // get fields and files
    await form.parse(req, async (err, fields, files) => {

      if (err) return res.json({ err });

      const { document_photo, masking_count, non_masking_count } = files;

      if (!masking_count && !non_masking_count)
        return res.status(404).json({ message: 'field value missing !!' });


      const response = await prisma.requestBuySms.create({
        data: {
          school_id: parseInt(refresh_token.school_id),
          masking_count: masking_count ?? undefined,
          non_masking_count: non_masking_count ?? undefined,
          document_photo: document_photo?.newFilename,
          status: 'pending'
        }
      });

      if (!response) throw new Error('failed to create');
      res.status(201).json({ success: 'created successfully' });
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};


export default authenticate(post);
