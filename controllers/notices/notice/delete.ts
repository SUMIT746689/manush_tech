import { authenticate } from 'middleware/authenticate';
import path from 'path';
import prisma from '@/lib/prisma_client';
import fs from 'fs';


async function Delete(req, res, refresh_token) {
    try {
        const { id, file_url } = req.query;

        if (refresh_token.role.title !== 'ADMIN') {
            throw new Error('Permission denied !')
        }


        await prisma.$queryRaw`DELETE FROM notices WHERE school_id = ${refresh_token.school_id} and id = ${Number(id)} `

        if (file_url) {
            const filePath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, file_url);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.log('prev File failed');
                    else console.log("prev File deleted !");
                })
            }
        }

        res.json({ data: 'Notice Deleted successfully !', success: true });
        res.end()

    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(Delete)