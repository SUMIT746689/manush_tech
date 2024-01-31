import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { authenticate } from 'middleware/authenticate';


async function get(req, res, refresh_token) {
    try {
        const { school_id } = refresh_token;

        const sss = await prisma.autoAttendanceSentSms.findFirst({
            where: { school_id },
            include: {
                academicYear: true
            }
        })
        res.status(200).json(sss);
    } catch (err) {
        logFile.error(err.message)
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
}

export default authenticate(get)