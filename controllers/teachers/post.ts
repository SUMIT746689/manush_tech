import { fileUpload, imageFolder, saveImage, validateField } from '@/utils/upload';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { logFile } from 'utilities_api/handleLogFile';

const post = async (req, res, refresh_token) => {
  const { admin_panel_id } = refresh_token;
  const uploadFolderName = 'teacher';

  const photoFileType = ['image/jpeg', 'image/jpg', 'image/png'];
  const resumeFileType = ['application/pdf', 'application/vnd.ms-excel'];

  const filterFiles = {
    photo: photoFileType,
    resume: resumeFileType
  };

  const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

  const { resume, photo } = files;
  try {
    if (error) throw new Error(error);

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
      department_id,
      salary_type
    }: any = fields;

    if (!username || !password || !first_name || !gender || !date_of_birth || !present_address || !permanent_address || !national_id || !salary_type)
      throw new Error(
        'username || password || first_name || gender || date_of_birth || salary_type || present_address || permanent_address is missing'
      );

    const encrypePassword = await bcrypt.hash(password, Number(process.env.SALTROUNDS));

    const optionalQuery = {
      middle_name: middle_name && middle_name,
      last_name: last_name && last_name,
      phone: phone && phone,
      email: email && email,
      blood_group: blood_group && blood_group,
      religion: religion && religion,
      photo: photo?.newFilename ? path.join(uploadFolderName, photo?.newFilename) : ''
    };
    let query = {};
    for (let i in optionalQuery) {
      if (optionalQuery[i]) {
        query[i] = optionalQuery[i];
      }
    }
    const teacher_role = await prisma.role.findFirst({
      where: {
        title: 'TEACHER'
      }
    });

    const filePathQuery = {};

    if (fields?.resume) filePathQuery['resume'] = fields?.resume;
    if (fields?.photo) filePathQuery['photo'] = fields?.photo;

    for (let i in filePathQuery) {
      const oldPath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, filePathQuery[i]);
      const newPath = path.join(
        process.cwd(),
        `${process.env.FILESFOLDER}`,
        uploadFolderName,
        filePathQuery[i]?.substring(filePathQuery[i].indexOf('\\') + 1)
      );

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log('Successfully moved file!');
      });
    }
    // console.log({ department_id, resume___: resume?.newFilename })
    if (department_id) query['department'] = { connect: { id: parseInt(department_id) } };
    // console.log(query)

    const teacher = await prisma.teacher.create({
      // @ts-ignore
      data: {
        ...query,
        first_name: first_name,
        national_id: national_id && national_id,
        gender: gender,
        date_of_birth: new Date(date_of_birth),
        salary_type: salary_type,
        permanent_address: permanent_address,
        present_address: present_address,
        joining_date: joining_date ? new Date(joining_date) : new Date(),
        // @ts-ignore
        // resume: resume?.newFilename ? path.join(uploadFolderName, resume?.newFilename) : (filePathQuery?.resume || ''),
        resume: resume?.newFilename ? path.join(uploadFolderName, resume?.newFilename) : '',
        school: { connect: { id: refresh_token.school_id } },
        // department: { connect: { id: parseInt(department_id) } },
        user: {
          create: {
            username: username,
            password: encrypePassword,
            user_photo: optionalQuery.photo,
            role: { connect: { id: teacher_role.id } },
            user_role: { connect: { id: teacher_role.id } },
            school: { connect: { id: refresh_token.school_id } },
            adminPanel: { connect: { id: admin_panel_id } }
          }
        }
      }
    });
    return res.status(200).json({ teacher: teacher, success: true });
  } catch (err) {
    logFile.error(err.message);
    if (resume) deleteFiles(resume.filepath);
    if (photo) deleteFiles(photo.filepath);
    console.log({ err });
    res.status(404).json({ error: err.message });
  }
};
export default authenticate(adminCheck(post));

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    logFile.error(err);
    console.log({ err });
  });
};
