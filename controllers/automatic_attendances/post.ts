import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { authenticate } from 'middleware/authenticate';
import { verifyIsUnicode } from 'utilities_api/verify';


async function post(req, res, refresh_token) {
    try {
        const { present_body, late_body, absence_body, admission_body, is_active, every_hit, use_system_type, url, url_params,is_auto_admission_sms } = req.body;
        const { school_id } = refresh_token;

        const resAlreadyCreated = await prisma.autoAttendanceSentSms.findFirst({
            where: { school_id }
        });

        if (!present_body && !late_body && !absence_body) throw new Error('body is required');

        const presentBodyIsUnicode = present_body && verifyIsUnicode(present_body);
        const present_body_format = typeof presentBodyIsUnicode === "boolean" ? (presentBodyIsUnicode ? 'unicode' : 'text') : undefined

        const lateBodyIsUnicode = late_body && verifyIsUnicode(late_body);
        const late_body_format = typeof lateBodyIsUnicode === "boolean" ? (lateBodyIsUnicode ? 'unicode' : 'text') : undefined

        const absenceBodyIsUnicode = absence_body && verifyIsUnicode(absence_body);
        const absence_body_format = typeof absenceBodyIsUnicode === "boolean" ? (absenceBodyIsUnicode ? 'unicode' : 'text') : undefined

        const admissionBodyIsUnicode = admission_body && verifyIsUnicode(admission_body);
        const admission_body_format = typeof admissionBodyIsUnicode === "boolean" ? (admissionBodyIsUnicode ? 'unicode' : 'text') : undefined

        const external_api_info = {
            url,
            url_params
        }
        console.log({absence_body})

        if (!resAlreadyCreated) {
            if (!use_system_type) throw new Error('use_system_type field is required');

            const sss = await prisma.autoAttendanceSentSms.create({
                data: {
                    present_body,
                    present_body_format,
                    late_body,
                    late_body_format,
                    absence_body,
                    absence_body_format,
                    admission_body,
                    admission_body_format,
                    is_active,
                    every_hit,
                    school_id,
                    use_system_type,
                    external_api_info,
                    is_auto_admission_sms
                    // academic_year_id,
                    // body_format: isUnicode ? 'unicode' : 'text'
                }
            })
            return res.status(200).json({ success: true });
        }

        await prisma.autoAttendanceSentSms.update({
            where: { id: resAlreadyCreated.id },
            data: {
                present_body: present_body || undefined,
                present_body_format,
                late_body: late_body || undefined,
                late_body_format,
                absence_body: absence_body || undefined,
                absence_body_format,
                admission_body: admission_body || undefined,
                admission_body_format,
                is_active: is_active ?? undefined,
                every_hit: every_hit ?? undefined,
                use_system_type: use_system_type ?? undefined,
                external_api_info,
                is_auto_admission_sms
                // academic_year_id: academic_year_id || undefined,
            }
        })

        res.status(200).json({ success: true });
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)