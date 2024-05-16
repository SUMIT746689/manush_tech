import { fileRename, fileUpload } from '@/utils/upload';
import prisma from '@/lib/prisma_client';
import fs from 'fs';
import path from 'path';
import get from 'controllers/teachers-recruitment/get';
import bcrypt from 'bcrypt';
import { logFile } from 'utilities_api/handleLogFile';

export const config = {
  api: {
    bodyParser: false
  }
};

const index = async (req, res) => {
  const filePathQuery = {};
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res);
        break;
      case 'POST':
        const reqDomain = new URL(req.headers.origin).host;

        const school = await prisma.school.findFirstOrThrow({
          where: {
            domain: reqDomain
          }
        });

        const uploadFolderName = 'teacherRecruitment';

        const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        const filterFiles = {
          logo: fileType,
          signature: fileType,
          background_image: fileType
        };

        const { files, fields, error } = await fileUpload({
          req,
          filterFiles,
          uploadFolderName
        });

        const { resume, photo } = files;

        if (files && resume) {
          if (photo) {
            if (['image/jpeg', 'image/jpg', 'image/png'].includes(resume.mimetype)) return res.json('Only png, jpg & jpeg is supported');
          }
          if (!resume || resume.length === 0) deleteFiles(photo.filepath);
        } else {
          // console.log({ files });
          if (photo) deleteFiles(photo.filepath);
          return res.json('require resume');
        }

        const {
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

        // old code

        // if (
        //   !first_name ||
        //   !gender ||
        //   !date_of_birth ||
        //   !present_address ||
        //   !permanent_address ||
        //   !resume ||
        //   !department_id ||
        //   !national_id
        // )
        //   return res.send(
        //     ' first_name || gender || date_of_birth || present_address || permanent_address || resume missing'
        //   );

        // updated code start

        if (!first_name || !gender || !date_of_birth || !present_address || !permanent_address || !resume || !national_id)
          return res.send(' first_name || gender || date_of_birth || present_address || permanent_address || resume missing');
        // updated code end

        const filePathQuery = {};
        if (resume?.newFilename) {
          filePathQuery['resume'] = await fileRename(files, uploadFolderName, 'resume', Date.now().toString() + '_' + resume?.originalFilename);
        }
        if (photo?.newFilename) {
          filePathQuery['photo'] = await fileRename(files, uploadFolderName, 'photo', Date.now().toString() + '_' + photo?.originalFilename);
        }
        await prisma.teacherRecruitment.create({
          data: {
            teacher: {
              ...fields,
              filePathQuery
            },
            school_id: school.id
          }
        });

        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );
        res.status(200).json({
          success: true,
          message: 'Teacher recruitment Application submitted !!'
        });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        logFile.error(`Method ${method} Not Allowed`);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    for (const i in filePathQuery) {
      fs.unlinkSync(path.join(process.cwd(), filePathQuery[i]));
    }
    console.log(err);
    logFile.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export default index;

const deleteFiles = (path) => {
  fs.unlink(path, (err) => {
    console.log({ err });
  });
};
