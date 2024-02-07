import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { sentSms } from '../postContent/postContent';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsUnicode, verifyNumeric } from 'utilities_api/verify';
import { handleNumberOfSmsParts } from 'utilities_api/handleNoOfSmsParts';
import { handleConvBanNum } from 'utilities_api/convertBanFormatNumber';


async function post(req, res, refresh_token) {
    try {
        const { sms_gateway_id, recipient_type, body: custom_body, msisdn } = req.body;
        const { school_id, id } = refresh_token;

        if (!sms_gateway_id) throw new Error("required sms gateway")
        if (!recipient_type) throw new Error("required valid datas")
        if (!msisdn) throw new Error('msisdn field is required')

        const data = {
            sms_gateway_id,
            school: { connect: { id: refresh_token.school_id } }
        }

        // response from sms gateway response
        const smsGatewayRes = prisma.smsGateway.findFirst({ where: { school_id: school_id, id: sms_gateway_id } })

        // school information
        const schoolInfoRes = prisma.school.findFirst({ where: { id: school_id }, select: { name: true } })

        // school information
        const userRes = prisma.user.findFirst({ where: { id: parseInt(id) }, select: { username: true } })

        const resQueries = await Promise.all([smsGatewayRes, schoolInfoRes, userRes])

        const { details }: any = resQueries[0];
        const { sender_id, sms_api_key: api_key, is_masking } = details ?? {};
        if (!sender_id) throw new Error("sender_id missing");

        const date = Date.now();
        const sms_shoot_id = String(id) + "_" + String(date)
        const { name: school_name } = resQueries[1];
        const { username } = resQueries[2];

        const isUnicode = verifyIsUnicode(custom_body || '');
        const number_of_sms_parts = handleNumberOfSmsParts({ isUnicode, textLength: custom_body.length })

        const contactsArr = msisdn.trim().split(/[. \n]+/);
        const finalContactsArr = [];
        contactsArr.forEach((contact: string) => {
            const isNumeric = verifyNumeric(contact);
            if (!isNumeric) return;
            const { number, err } = handleConvBanNum(contact);
            if (!err) finalContactsArr.push(number);
        });

        if (finalContactsArr.length === 0) throw new Error('provide valid msisdn');

        const sentSmsData = {
            sms_shoot_id,
            school_id,
            school_name,
            user_id: id,
            user_name: username,
            sender_id: sms_gateway_id,
            sender_name: sender_id,
            pushed_via: "gui",
            sms_type: isUnicode ? 'unicode' : 'text',
            sms_text: custom_body,
            submission_time: new Date(),
            sms_gateway_status: "pending",
            number_of_sms_parts,
            contacts: finalContactsArr.join(','),
            total_count: finalContactsArr.length
            // campaign_id,
            // campaign_name,
        }


        // users sending sms handle 
        sentSms(sentSmsData, is_masking);

        // throw new Error("invalid recipient type ")
        return res.json({ message: 'success' });

    } catch (err) {
        logFile.error(err.message)
        console.log({ err: err.message })
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)