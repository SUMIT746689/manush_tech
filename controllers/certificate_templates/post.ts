import { authenticate } from 'middleware/authenticate';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import fs from 'fs';
import prisma from '@/lib/prisma_client';

async function post(req, res, refresh_token) {
  try {
    const uploadFolderName = "certificate_templates";
    const fileUrl = `/${uploadFolderName}`;
    
    await certificateTemplateFolder(uploadFolderName);

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      logo: fileType,
      signature: fileType,
      background_image: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    const { logo, signature, background_image } = files;

    if (files && (error || !logo || !signature || !background_image)) for (const [key, value] of Object.entries(files)) {
      // @ts-ignore
      fs.unlink(value.filepath, (err) => { if (err) console.log({ err }) })
    };

    if (error) throw new Error(error);
    const notFoundFiles = [];
    if (!logo) notFoundFiles.push('logo');
    if (!signature) notFoundFiles.push('signature');
    if (!background_image) notFoundFiles.push('background_image');

    if (notFoundFiles.length > 0) throw new Error(`${notFoundFiles.join(', ')} file not found`)

    //fields checks 
    const { name, user_type, page_layout, student_qr_code, employee_qr_code, photo_style, photo_size, top_space, bottom_space, right_space, left_space, content } = fields;
    if (!name || !user_type || !page_layout || !photo_style || !photo_size || !top_space || !bottom_space || !right_space || !left_space || !content)
      throw new Error('provide all required fields')
    if (!student_qr_code && !employee_qr_code)
      throw new Error('required qr code field')

    const response = await prisma.certificateTemplate.create({
      data: {
        name,
        user_type,
        page_layout,
        student_qr_code: user_type === 'student' ? student_qr_code : null,
        employee_qr_code: user_type === 'student' ? employee_qr_code : null,
        photo_style,
        photo_size: Number(photo_size),
        top_space: Number(top_space),
        bottom_space: Number(bottom_space),
        right_space: Number(right_space),
        left_space: Number(left_space),
        signature_url: `${fileUrl}/${files['signature'].newFilename}`,
        logo_url: `${fileUrl}/${files["logo"].newFilename}`,
        background_url: `${fileUrl}/${files["background_image"].newFilename}`,
        content,
        school_id: refresh_token.school_id
      }
    })

    res.json({ data: response, success: true });
    //   let data = '';
    //   req.on('data',(a)=>{
    //     data+=a.toString('base64');
    //   })

    //   req.on('end',(a)=>{
    //     console.log('ending');
    //     // console.log({data});
    //     const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    //     console.log({matches: matches});
    //     const filePath = path.join(__dirname,'../../../../public/test.jpg');
    //     // console.log({filePath});
    //     fs.writeFile(filePath, data,'utf8', err => {
    //       if (err) {
    //         console.error({err});
    //       }
    //       // file written successfully
    //       return res.json({ message: data });
    //     });
    //   });

    // const readable = req.read(); 
    // const buffer = Buffer.from(readable);
    // req.on('data',(chunk)=>{console.log({chunk})})
    // console.log({readable})
    // console.log({buffer: JSON.parse(buffer)});
    // console.log({base64: buffer.toString('base64')});
    // console.log({buffer: buffer});
    // console.log(req.body)


  } catch (err) {
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)