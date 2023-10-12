import { authenticate } from 'middleware/authenticate';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import fs from 'fs';
import prisma from '@/lib/prisma_client';


async function post(req, res, refresh_token) {
  try {
    const { id } = req.query;

    const uploadFolderName = "certificate_templates";
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/get_file/${uploadFolderName}`;

    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      logo: fileType,
      signature: fileType,
      background_image: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    const { logo, signature, background_image } = files;
    // if (files && (error || !logo || !signature || !background_image))
    if (files && error)
      // @ts-ignore
      for (const [key, value] of Object.entries(files)) fs.unlink(value.filepath, (err) => { if (err) console.log({ err }) })
      console.log({files})

    if (error) throw new Error(error);

    //fields checks 
    const { name, user_type, page_layout, student_qr_code, employee_qr_code, photo_style, photo_size, top_space, bottom_space, right_space, left_space, content } = fields;
    const response = await prisma.certificateTemplate.update({
      where: { id: Number(id) },
      data: {
        name,
        user_type,
        page_layout,
        student_qr_code: user_type === 'student' ? student_qr_code : null,
        employee_qr_code: user_type !== 'student' ? employee_qr_code : null,
        photo_style,
        photo_size: Number(photo_size),
        top_space: Number(top_space),
        bottom_space: Number(bottom_space),
        right_space: Number(right_space),
        left_space: Number(left_space),
        signature_url: files?.signature?.newFilename ? `${fileUrl}/${files['signature'].newFilename}` : undefined,
        logo_url: files?.logo?.newFilename ? `${fileUrl}/${files['logo'].newFilename}` : undefined,
        background_url: files?.background_image?.newFilename ? `${fileUrl}/${files['background_image'].newFilename}` : undefined,
        content
      }
    })

    res.json({ data: response, success: true });

  } catch (err) {
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)