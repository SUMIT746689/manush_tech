import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { authenticate } from 'middleware/authenticate';
import { verifyIsUnicode } from 'utilities_api/verify';


async function post(req, res, refresh_token) {
    try {
        const { body, is_active, every_hit, academic_year_id } = req.body;
        const { school_id } = refresh_token;

        const resAlreadyCreated = await prisma.autoAttendanceSentSms.findFirst({
            where: { school_id }
        });


        if (!body) throw new Error('body is required');
        const isUnicode = verifyIsUnicode(body);

        if (!resAlreadyCreated) {
            const sss = await prisma.autoAttendanceSentSms.create({
                data: {
                    body,
                    is_active,
                    every_hit,
                    school_id,
                    academic_year_id,
                    body_format: isUnicode ? 'unicode' : 'text'
                }
            })
            return res.status(200).json({ success: true });
        }

        await prisma.autoAttendanceSentSms.update({
            where: { id: resAlreadyCreated.id },
            data: {
                body: body || undefined,
                is_active: is_active ?? undefined,
                every_hit: every_hit ?? undefined,
                academic_year_id: academic_year_id || undefined,
                body_format: isUnicode ? 'unicode' : 'text'
            }
        })

        res.status(200).json({ success: true });
    } catch (err) {
        logFile.error(err.message)
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
}

export default authenticate(post)