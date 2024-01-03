import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';
import fs from 'fs';
import path from 'path';
import { logFile } from 'utilities_api/handleLogFile';


const delete_ = async (req: any, res: any, refresh_token) => {
    try {

        if (refresh_token.school_id) throw new Error('permission denied');
        // const {user_id} = refresh_token;
        // console.log({ refresh_token });
        const { image_name } = req.query;

        const datas = path.join(process.cwd(), `${process.env.FILESFOLDER}`, image_name);
        fs.unlinkSync(datas)

        const response = await prisma.banners.findFirst({});
        const { banners } = response || {};
        // @ts-ignore
        const { right_banners, left_banners } = banners || {};
        const right_banners_ = right_banners.filter(banner => banner.url !== image_name)

        await prisma.banners.update({
            where: { id: response.id },
            data: {
                banners: {
                    left_banners,
                    right_banners: right_banners_
                }
            }
        })

        res.status(200).json({ success: 'deleted successfully' });

    } catch (err) {
        logFile.error(err.message);
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
};




export default authenticate(delete_);
