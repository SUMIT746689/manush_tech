import { imageFolder, saveImage, validateField } from '@/utils/upload';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false
  }
};

export const patch = async (req, res) => {
  try {
    const { teacher_id } = req.query;

    if (!teacher_id) throw new Error('Teacher ID must be provided');

    // validate user
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');
    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });

    await imageFolder();

    const options: formidable.Options = {};

    options.uploadDir = path.join(process.cwd(), '/public/files');
    options.multiple = true;
    // options.maxFieldsSize = 1 * 1024 * 1024;
    // options.maxFields = 2;
    options.keepExtensions = true;
    // @ts-ignore
    options.filename = (name, ext, path, form) => {
      // console.log({ name, ext, path, form });
      return Date.now().toString() + '_' + path.originalFilename;
    };
    options['filter'] = function ({ name, mimetype }) {
      // keep only images
      if (name === 'resume')
        if (!['application/pdf'].includes(mimetype)) {
          throw new Error('');
          // return res.json('Only pdf file is supported');
        }
      if (name === 'photo')
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)) {
          throw new Error('');
          // return res.json('Only png, jpg & jpeg file is supported');
        }
      return true;
    };

    const form = formidable(options);

    await form.parse(req, async (err, fields, files) => {
      const { resume, photo } = files;
      console.log({ fields });

      if (err) return res.json({ err });

      const {
        username,
        password,
        // school_id,
        first_name,
        middle_name,
        last_name,
        national_id,
        phone,
        email,
        gender,
        blood_group,
        religion,
        date_of_birth,
        present_address,
        permanent_address,
        joining_date,
        department_id
      }: any = fields;

      let encrypePassword;
      if (password)
        encrypePassword = await bcrypt.hash(
          password,
          Number(process.env.SALTROUNDS)
        );

      let query = {};

      if (department_id)
        query['department'] = { connect: { id: parseInt(department_id) } };
      let temp = {};
      if (username) {
        temp = {
          username: username,
        }
      }
      if (password !=='' && encrypePassword) {
        temp = {
          ...temp,
          password: encrypePassword
        }

      }
      query['user'] = {
        update: temp
      }
      query['user'] = {
        update: {
          username: username,
          password: encrypePassword
        }
      };

      try {
        const teacher = await prisma.teacher.update({
          where: { id: Number(teacher_id) },
          // @ts-ignore
          data: {
            ...query,
            middle_name,
            last_name,
            phone,
            email,
            blood_group,
            religion,
            photo: photo?.newFilename,
            first_name,
            national_id,
            gender,
            date_of_birth: date_of_birth && new Date(date_of_birth),
            permanent_address,
            present_address,
            joining_date: joining_date ? new Date(joining_date) : new Date(),
            resume: resume?.newFilename
          }
        });
        return res.status(200).json({ teacher: teacher, success: true });
      } catch (err) {
        if (resume) deleteFiles(resume.filepath);
        if (photo) deleteFiles(photo.filepath);
        res.status(404).json({ error: err.message });
      }
    });
  } catch (err) {
    console.log({ err });
    res.status(404).json({ err: err.message });
  }
};

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    console.log({ err });
  });
};
