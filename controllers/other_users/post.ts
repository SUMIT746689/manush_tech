import { fileUpload } from '@/utils/upload';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';
import adminCheck from 'middleware/adminCheck';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyPermissions } from 'utilities_api/verifyPermissions';
import { TextRotationAngledownRounded } from '@mui/icons-material';

const post = async (req, res, refresh_token) => {
  try {
    const uploadFolderName = 'other_users';

    const resumeFileType = ['application/pdf', 'application/vnd.ms-excel'];
    const photoFileType = ['image/jpeg', 'image/jpg', 'image/png',]
    const filterFiles = {
      resume: resumeFileType,
      photo: photoFileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

    const { resume, photo } = files;

    try {
      if (error) throw new Error('Error')

      // if (error && (resume || photo)) {
      //   if (photo) deleteFiles(photo.filepath);
      //   if (resume) deleteFiles(resume.filepath);
      //   throw new Error('error files');
      // }

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
        employee_id,
        role
      }: any = fields;

      // const rolePrase = role ? JSON.parse(role) : {};
      const permissionRole = `create_${role}`.toLowerCase();
      const { isPermitted } = await verifyPermissions([permissionRole], refresh_token)
      if (!isPermitted) throw new Error("user permission denied")

      if (
        !username ||
        !password ||
        !first_name ||
        !gender ||
        !date_of_birth ||
        !present_address ||
        !permanent_address
        // ||
        // !national_id
      )
        return res.json({
          message: 'username || password || first_name || gender || date_of_birth || present_address || permanent_address is missing'
        });
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
          title: role.toUpperCase()
        }
      })

      const filePathQuery = {}

      if (fields?.resume) filePathQuery['resume'] = fields?.resume
      if (fields?.photo) filePathQuery['photo'] = fields?.photo

      for (let i in filePathQuery) {
        const oldPath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, filePathQuery[i]);
        const newPath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, uploadFolderName, filePathQuery[i]?.substring(filePathQuery[i].indexOf('\\') + 1))

        fs.rename(oldPath, newPath, (err) => {
          if (err) throw err
          console.log('Successfully moved file!')
        })
      }
      console.log({employee_id})
      const resOtherUsersInfo = await prisma.otherUsersInfo.create({
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
          // @ts-ignore
          resume: resume?.newFilename ? path.join(uploadFolderName, resume?.newFilename) : (filePathQuery?.resume || ''),
          school: { connect: { id: refresh_token.school_id } },
          employee_id: employee_id,
          user: {
            create: {
              username: username,
              password: encrypePassword,
              user_photo: optionalQuery.photo,
              role: { connect: { id: teacher_role.id } },
              user_role: { connect: { id: teacher_role.id } },
              school: { connect: { id: refresh_token.school_id } }
            }
          }
        }
      });
      return res.status(200).json({ data: resOtherUsersInfo, success: true });
    }
    catch (err) {
      logFile.error(err.message)
      if (resume) deleteFiles(resume.filepath);
      if (photo) deleteFiles(photo.filepath);
      res.status(404).json({ error: err.message });
    }
  }
  catch (err) {
    logFile.error(err.message)
    console.log({ err });
    res.status(404).json({ err: err.message });
  }
};

// export default authenticate(adminCheck(post))
export default authenticate(post)

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    logFile.error(err)
    console.log({ err });
  });
};
