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

export const post = async (req, res) => {
  try {
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

    const form = await formidable(options);

    await form.parse(req, async (err, fields, files) => {
      const { resume, photo } = files;

      if (err) return res.json({ err });

      if (files && resume) {
        if (photo) {
          if (
            ['image/jpeg', 'image/jpg', 'image/png'].includes(resume.mimetype)
          )
            return res.json('Only png, jpg & jpeg is supported');
        }
        if (!resume || resume.length === 0) deleteFiles(photo.filepath);
      } else {
        // console.log({ files });
        if (photo) deleteFiles(photo.filepath);
        return res.json('require resume');
      }
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

      if (
        !username ||
        !password ||
        !user?.school_id ||
        !first_name ||
        !gender ||
        !date_of_birth ||
        !present_address ||
        !permanent_address ||
        !resume ||
        !department_id ||
        !national_id
      )
        return res.send(
          'username || password || school_id || first_name || gender || date_of_birth || present_address || permanent_address || resume missing'
        );

      const encrypePassword = await bcrypt.hash(
        password,
        Number(process.env.SALTROUNDS)
      );
      console.log({ encrypePassword });

      const optionalQuery = {
        middle_name: middle_name && middle_name,
        last_name: last_name && last_name,
        phone: phone && phone,
        email: email && email,
        blood_group: blood_group && blood_group,
        religion: religion && religion,
        photo: photo?.newFilename
      };
      let query = {};
      for (let i in optionalQuery) {
        if (optionalQuery[i]) {
          query[i] = optionalQuery[i];
        }
      }
      try {
        const teacher_role = await prisma.role.findFirst({
          where: {
            title: 'TEACHER'
          }
        })
        const teacher = await prisma.teacher.create({
          // @ts-ignore
          data: {
            ...query,
            first_name: first_name,
            national_id: national_id && national_id,
            gender: gender,
            date_of_birth: new Date(date_of_birth),
            permanent_address: permanent_address,
            present_address: present_address,
            joining_date: joining_date ? new Date(joining_date) : new Date(),
            resume: resume?.newFilename,
            school: { connect: { id: user.school_id } },
            department: { connect: { id: parseInt(department_id) } },
            user: {
              create: {
                username: username,
                password: encrypePassword,
                role: { connect: { id: teacher_role.id } },
                user_role: { connect: { id: teacher_role.id } },
                school: { connect: { id: user.school_id } }
              }
            }
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
