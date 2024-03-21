import prisma from '@/lib/prisma_client';
import { certificateTemplateFolder, fileUpload } from '@/utils/upload';
import { readFileSync } from 'fs';
import { authenticate } from 'middleware/authenticate';
import path from 'path';
import { handleConvBanNum } from 'utilities_api/convertBanFormatNumber';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
    try {

        const { id: auth_user_id, name: auth_user_name, school_id } = refresh_token;
        if (!school_id) throw new Error("Invalid User");

        const uploadFolderName = "voice_templates";

        await certificateTemplateFolder(uploadFolderName);

        const fileType = ['audio/wav', 'audio/x-wav'];

        const filterFiles = {
            voice_file: fileType,
        }

        const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });

        if (files && error)
            // @ts-ignore
            for (const [key, value] of Object.entries(files)) fs.unlink(value.filepath, (err) => { if (err) console.log({ err }) })

        if (error) throw new Error(error);

        const { gateway_id, msisdn } = fields;
        const { voice_file } = files;

        if (!gateway_id || !msisdn || !voice_file) throw new Error("provide all required datas");

        const findGateway = await prisma.voiceGateway.findFirst({ where: { id: parseInt(gateway_id), school_id } });
        console.log({ findGateway });

        //@ts-ignore
        if (!findGateway || !findGateway?.details?.sender_id || typeof findGateway?.details?.is_masking !== "boolean") throw new Error("sms gateway/serder_id/is_masking not founds")

        const { details: { sender_id, is_masking } }: any = findGateway

        const formData = new FormData();
        const blob = new Blob([readFileSync(voice_file.filepath)]);

        const dateNow = new Date()
        const createUniqueMagId = String(auth_user_id) + String(dateNow.getTime());

        const arrContacts = msisdn.split(',');
        const finalContacts = [];
        arrContacts.forEach(element => {
            const element_ = element.trim();
            const { number, err } = handleConvBanNum(element_);
            if (err) return;
            finalContacts.push(number);
        });

        if (finalContacts.length === 0) throw new Error("no valid contact founds");


        // create tbl_sent_vocie_sms
        const respCreateVoiceSms = await prisma.tbl_sent_voice_sms.create({
            data: {
                message_id: createUniqueMagId,
                send_by_user_id: auth_user_id,
                send_by_user_name: auth_user_name,
                voice_url: path.join(uploadFolderName, voice_file?.newFilename),
                contacts: msisdn,
                // duration:,
                sender_id,
                pushed_via: "voice_recipient",
                // is_masking,
                status: 2,
                school_id
            }
        });


        const total_contact_count = finalContacts.length;

        formData.set("message_id", createUniqueMagId)
        formData.set("receivers", finalContacts.join(','))
        formData.set("total_contact_count", String(total_contact_count))
        formData.set("type", total_contact_count > 1 ? "single" : "group")

        formData.set("audio_file", blob, voice_file.newFilename)
        formData.set("duration", "3")
        // formData.set("sender_id", "8809677602858")
        formData.set("sender_id", sender_id)
        formData.set("base_url", "http://msg.elitbuzz-bd.com")

        // console.log(formData)
        const resp = await fetch(process.env.voice_sms_api,
            {
                headers: { 'Authorization': 'Bearer PktcjYCSqYgM6zR1uhozUmd0unVr5LnB' },
                method: "POST",
                body: formData,
            }
        );
        const respJson = await resp.json();
        // console.log(respJson);
        // if (respJson.code !== 200) throw new Error(respJson.data);

        const respUpdateVoiceSms = await prisma.tbl_sent_voice_sms.update({
            where: { id: respCreateVoiceSms.id },
            data: {
                status: respJson?.code === 200 ? 0 : 3,
                logs: respJson.data
            }
        });

        if (respJson.code !== 200) throw new Error(respJson.data);

        return res.json({ data: respJson.data, success: true });

    } catch (err) {
        console.log({ err: err.message })
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)