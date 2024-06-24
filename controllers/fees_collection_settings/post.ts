import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { authenticate } from 'middleware/authenticate';
// import { verifyIsUnicode } from 'utilities_api/verify';


async function post(req, res, refresh_token) {
    try {
        const { fees_collection_sms_body, is_fees_collection_sms_active } = req.body;

        const { school_id, name: username, id: user_id } = refresh_token;
        const resAlreadyCreated = await prisma.smsSettings.findFirst({
            where: { school_id },
            select: {
                id: true,
                updated_by: true
            }
        });

        if (!fees_collection_sms_body && typeof is_fees_collection_sms_active !== "boolean") throw new Error('body is required');

        // const fees_collection_sms_body_is_unicode = fees_collection_sms_body && verifyIsUnicode(fees_collection_sms_body);
        // const fees_collection_sms_body_format = typeof fees_collection_sms_body_is_unicode === "boolean" ? (fees_collection_sms_body_is_unicode ? 'unicode' : 'text') : undefined


        if (!resAlreadyCreated) {
            // if (!use_system_type) throw new Error('use_system_type field is required');

            await prisma.smsSettings.create({
                data: {
                    school_id,
                    updated_by: [{ username: username, user_id: user_id, body: { fees_collection_sms_body, is_fees_collection_sms_active }, date: new Date(Date.now()) }]
                }
            })
            return res.status(200).json({ success: true });
        }

        const updated_by = Array.isArray(resAlreadyCreated.updated_by) ? resAlreadyCreated.updated_by.slice(0, 19) : [];
        // @ts-ignore
        updated_by.unshift({ username: username, user_id: user_id, body: { fees_collection_sms_body, is_fees_collection_sms_active }, date: new Date(Date.now()) });
        
        await prisma.smsSettings.update({
            where: { id: resAlreadyCreated.id },
            data: { 
                fees_collection_sms_body,
                is_fees_collection_sms_active,
                updated_at: new Date(Date.now()),
                updated_by
            }
        })

        res.status(200).json({ success: true });
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)