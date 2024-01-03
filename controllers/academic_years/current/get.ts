// import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { dcrypt } from 'utilities_api/hashing';

async function get(req, res, refresh_token) {
    try {
        const { id } = req.query;
        const { school_id } = refresh_token;
        const { academic_year: academic_year_cookie } = req.cookies;

        let dcrypt_cookie: any = [null, null];

        if (!academic_year_cookie) throw Error(" academic year not found")
        dcrypt_cookie = dcrypt(academic_year_cookie)

        const [err, academic_year_cookie_data] = dcrypt_cookie;

        // if (!school_id) throw new Error('unauthorized user')

        // const findAcademic = await prisma.academicYear.findFirstOrThrow({
        //     where: { school_id },
        //     orderBy: {
        //         id: 'desc'
        //     },
        //     take: 1
        // });
        if (err) throw Error(err);
        res.status(200).json({ success: true, data: academic_year_cookie_data })
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(get);