import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { serialize } from 'cookie';
import { encrypt } from 'utilities_api/hashing';
import { makeCookie } from 'utilities_api/handleCookies';
import { logFile } from 'utilities_api/handleLogFile';

async function patch(req, res, refresh_token) {
    try {
        const { id } = req.query;
        const { school_id } = refresh_token;

        if (!school_id) throw new Error('unauthorized user')

        const findAcademic = await prisma.academicYear.findFirstOrThrow({ where: { id: parseInt(id), school_id } })

        const cookies = [];
        const academic_year_cookie_datas = { id: findAcademic.id, title: findAcademic.title, school_id: findAcademic.school_id }
        const encryptData = encrypt(academic_year_cookie_datas);
        // const maxAge = new Date();
        // maxAge.setFullYear(2070);
        const maxAge = 15456432416531;
        console.log({ maxAge })
        cookies.push(makeCookie(serialize, 'academic_year', encryptData, maxAge))

        res.setHeader('Set-Cookie', cookies);
        res.status(200).json({ success: true })
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(patch);