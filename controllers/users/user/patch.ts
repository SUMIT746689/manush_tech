import { refresh_token_varify } from 'utilities_api/jwtVerify';
import bcrypt from 'bcrypt';
import { fileUpload } from '@/utils/upload';
import fspromises from 'fs/promises'
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma_client';



export const patch = async (req, res) => {
  try {
    const uploadFolderName = "userPhoto";

    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const filterFiles = {
      user_photo: fileType,
    }

    const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName, uniqueFileName: false });

    if (error) {
      throw new Error('Server error !')
    }
    const { username, password, role } = fields;
    const parseRole = JSON.parse(role)

    if (!parseRole.permission)
      throw new Error('provide all required informations');

    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALTROUNDS)
    );

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id },
      include: {
        permissions: true,
        role: {
          include: {
            permissions: true
          }
        }

      }
    });


    if (!user.permissions.length && user.role_id) {
      user['permissions'] = user.role.permissions;
      delete user['role']['permissions'];
    }
    const findUser = user.permissions.find(
      (permission) => permission.value === parseRole.permission
    );
    if (!findUser) throw Error('Permission denied !')

    const targetUser = await prisma.user.findFirst({
      where: {
        id: parseInt(req.query.id)
      }
    })
    const data = {};
    if (username) {
      data['username'] = username
    }
    if (password) {
      data['password'] = hashPassword
    }
    
    if (files?.user_photo?.newFilename) {
      const user_imageNewName = Date.now().toString() + '_' + files.user_photo.originalFilename;
      await fspromises.rename(files.user_photo.filepath, path.join(process.cwd(), `${process.env.FILESFOLDER}`, uploadFolderName, user_imageNewName))
        .then(() => {
          data['user_photo'] = path.join(uploadFolderName, user_imageNewName)

        })
        .catch(err => {
          data['user_photo'] = path.join(uploadFolderName, files.user_photo?.newFilename)
        })

      if (targetUser?.user_photo) {
        const filePath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, targetUser.user_photo);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.log('user_photo deletion failed');
            else console.log("user_photo deleted");
          })
        }
      }
    }

    await prisma.user.update({
      where: {
        id: parseInt(req.query.id)
      },
      // @ts-ignore
      data
    });

    res.status(200).json({ message: `user updated Successfully` });
    // res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};
