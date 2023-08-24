import { fileUpload, imageFolder, saveImage, validateField } from '@/utils/upload';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

import { authenticate } from 'middleware/authenticate';
const prisma = new PrismaClient();

 const post = async (req, res, refresh_token) => {
  try {
    const uploadFolderName = 'teacher';

    const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const filterFiles = {
      logo: fileType,
      signature: fileType,
      background_image: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    if (error) throw new Error('Error')

    const { resume, photo } = files;

    if (files && resume) {
      if (photo) {
        if (
          ['image/jpeg', 'image/jpg', 'image/png'].includes(resume.mimetype)
        )
          return res.json('Only png, jpg & jpeg is supported');
      }
      if (!resume || resume.length === 0) deleteFiles(photo.filepath);
    } 
    else {
      // console.log({ files });
      if (photo) deleteFiles(photo.filepath);
      return res.json('require resume');
    }
    const {
      username,
      password,
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
        'username || password || first_name || gender || date_of_birth || present_address || permanent_address || resume missing'
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
      photo: path.join(uploadFolderName,photo?.newFilename)
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
          resume: path.join(uploadFolderName,resume?.newFilename),
          school: { connect: { id: refresh_token.school_id } },
          department: { connect: { id: parseInt(department_id) } },
          user: {
            create: {
              username: username,
              password: encrypePassword,
              user_photo: path.join(uploadFolderName,photo?.newFilename)  || null,
              role: { connect: { id: teacher_role.id } },
              user_role: { connect: { id: teacher_role.id } },
              school: { connect: { id: refresh_token.school_id } }
            }
          }
        }
      });
      return res.status(200).json({ teacher: teacher, success: true });
    } 
    catch (err) {
      if (resume) deleteFiles(resume.filepath);
      if (photo) deleteFiles(photo.filepath);
      res.status(404).json({ error: err.message });
    }

  } catch (err) {
    console.log({ err });
    res.status(404).json({ err: err.message });
  }
};
export default authenticate(post)

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    console.log({ err });
  });
};
