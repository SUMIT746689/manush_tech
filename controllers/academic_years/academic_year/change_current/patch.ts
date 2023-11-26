import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { serialize } from 'cookie';
import { encrypt } from 'utilities_api/hashing';

async function patch(req, res, refresh_token) {
    try {
        const { id } = req.query;
        const { school_id } = refresh_token;

        if (!school_id) throw new Error('unauthorized user')
        
        const findAcademic = await prisma.academicYear.findFirstOrThrow({ where: { id: parseInt(id), school_id } })

        const cookies = [];
        const academic_year_cookie_datas = { id: findAcademic.id, title: findAcademic.title, school_id: findAcademic.school_id }
        const encryptData = encrypt(academic_year_cookie_datas);

        cookies.push(
            serialize('academic_year', encryptData, {
                path: '/',
                maxAge: new Date(993402300000000).getTime(),
                secure: process.env.NODE_ENV === 'production'
            })
        )
        res.setHeader('Set-Cookie', cookies);
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(patch);