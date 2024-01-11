import prisma from '@/lib/prisma_client';
import { fileUpload } from '@/utils/upload';
import bcrypt from 'bcrypt';
import fs from 'fs';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { logFile } from 'utilities_api/handleLogFile';

const patch = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) throw new Error('User ID must be provided');

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
        employee_id,
      }: any = fields;

      let encrypePassword;
      if (password)
        encrypePassword = await bcrypt.hash(
          password,
          Number(process.env.SALTROUNDS)
        );

      let query = {};
      if (employee_id) query['employee_id'] = employee_id;
      let temp = {};
      if (username) {
        temp = {
          username: username,
        }
      }
      if (password !== '' && encrypePassword) {
        temp = {
          ...temp,
          password: encrypePassword
        }
      }
      const resAlreadyOtherUser = await prisma.otherUsersInfo.findFirst({ where: { id: parseInt(id) }, select: { resume: true, photo: true } })

      if (resume) query['resume'] = path.join(uploadFolderName, resume?.newFilename)
      if (photo) query['photo'] = path.join(uploadFolderName, photo?.newFilename)

      query['user'] = {
        update: temp
      }


      const resOtherUsersInfo = await prisma.otherUsersInfo.update({
        where: { id: parseInt(id) },
        // @ts-ignore
        data: {
          ...query,
          middle_name,
          last_name,
          phone,
          email,
          blood_group,
          religion,
          first_name,
          national_id,
          gender,
          date_of_birth: date_of_birth && new Date(date_of_birth),
          permanent_address,
          present_address,
          joining_date: joining_date ? new Date(joining_date) : new Date(),
        }
      });

      // delete previous files 
      if (resume && resAlreadyOtherUser.resume) deleteFiles(path.join(process.cwd(), `${process.env.FILESFOLDER}`, resAlreadyOtherUser.resume))
      if (photo && resAlreadyOtherUser.photo) deleteFiles(path.join(process.cwd(), `${process.env.FILESFOLDER}`, resAlreadyOtherUser.photo))

      return res.status(200).json({ data: resOtherUsersInfo, success: true });
    } catch (err) {
      console.log(err);
      logFile.error(err.message)
      if (resume) deleteFiles(resume.filepath);
      if (photo) deleteFiles(photo.filepath);
      res.status(404).json({ error: err.message });
    }

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};
export default authenticate(adminCheck(patch));

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    logFile.error(err)
    console.log({ err });
  });
};
