import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { fileUpload } from '@/utils/upload';
import prisma from '@/lib/prisma_client';

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req: any, res: any, refresh_token) => {
    try {

        if (refresh_token.school_id) throw new Error('permission denied');
        // const {user_id} = refresh_token;

        const uploadFolderName = "banners";
        const { id } = refresh_token;

        const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
        const filterFiles = {
            photo: fileType,
        }

        const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
        // console.log({ files, fields, error })
        if (error) throw new Error(error);

        const { banners } = files;

        if (!banners) return res.status(404).json({ message: 'file missing !!' });

        const uploaPaths: any = [];
        // @ts-ignore
        if (!Array.isArray(banners)) uploaPaths.push({ url: path.join(uploadFolderName, banners?.newFilename) })
        else uploaPaths.push(...banners?.map(banner => ({ url: path.join(uploadFolderName, banner?.newFilename) })))

        const resBanner = await prisma.banners.findFirst({});
        const bannersData = { right_banners: uploaPaths }

        if (resBanner) {
            // @ts-ignore
            if (resBanner.banners?.left_banners) bannersData["left_banners"] = resBanner.banners?.left_banners;
            // @ts-ignore
            if (resBanner.banners?.right_banners) bannersData.right_banners.push(...resBanner.banners?.right_banners);
            const response = await prisma.banners.update({
                where: { id: resBanner.id },
                data: {
                    banners: bannersData,
                    user: {
                        connect: { id }
                    }
                }
            })
            if (!response) throw new Error('failed to create');
            return res.status(200).json({ success: 'added successfully' });
        }

        const response = await prisma.banners.create({
            data: {
                banners: bannersData,
                user: {
                    connect: { id }
                }
            }
        })

        res.status(200).json({ success: 'created successfully' });

    } catch (err) {
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
};

export default authenticate(post);
