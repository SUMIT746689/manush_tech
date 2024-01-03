import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';


const get = async (req: any, res: any, refresh_token) => {
    try {

        if (refresh_token.school_id) throw new Error('permission denied');
        const { role } = refresh_token;
        if (role?.title !== 'SUPER_ADMIN') throw new Error('permission denied')
        // const {user_id} = refresh_token;
        // console.log({ refresh_token });

        const response = await prisma.banners.findFirst({});

        res.status(200).json(response);

    } catch (err) {
        logFile.error(err.message)
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
};




export default authenticate(get);
