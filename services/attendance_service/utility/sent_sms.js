import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import { customizeDateWithTime } from "./dateTime.js";
import { findMatches } from "./findMatches.js";
import { logFile } from "./handleLog.js";
import { verifyIsUnicode } from "./handleVerifyUnicode.js";

export const sentSms = (data, isAlreadyAttendanceEntry, studentDatas, user_id, submission_time) => {
    try {

        const { name, SmsGateway, masking_sms_count, non_masking_sms_count } = studentDatas?.student_info?.school ?? {};
        const { id: smsGatewayId, details } = Array.isArray(SmsGateway) && SmsGateway?.length > 0 ? SmsGateway[0] : {};
        const { sender_id, is_masking } = details ?? {};
        if (!sender_id) return logFile.error(`student sent sms, user_id(${user_id}) sender_id not founds`);
        if (!data.is_active) return logFile.error(`student sent sms, user_id(${user_id}) school_id(${studentDatas.student_info.school_id}) automatic attendance is not active`);
        if (!data.every_hit && isAlreadyAttendanceEntry?.id) return logFile.error(`student sent sms, user_id(${user_id}) school_id(${studentDatas.student_info.school_id}) every_hit(${data.every_hit}) already sent sms automatic attendance`);
        if (!studentDatas?.student_info?.phone) return logFile.error(`student sent sms, user_id(${user_id}) phone number not founds`)
        if (!data.body) return logFile.error(`student sent sms, user_id(${user_id}) sms body not found`)

        let body = data.body;
        const isUnicode = verifyIsUnicode(body);

        const allMatchesArray = findMatches(data.body);
        for (const element of allMatchesArray) {
            body = body.replaceAll(`#${element}#`, studentDatas[element] || studentDatas.student_info[element] || element === 'submission_time' && customizeDateWithTime(submission_time) || '')
        }
        body = body.replace(/ +(?= )/g, '');

        // verify no of parts a sms
        const bodyLength = isUnicode ? body.length * 2 : body.length;
        const number_of_sms_parts = bodyLength <= 160 ? 1 : Math.ceil(bodyLength / 153);
        if (masking_sms_count < number_of_sms_parts) return logFile.error(`student sent sms, user_id(${user_id}) school_id(${studentDatas.student_info.school_id}) masking sms count is ${masking_sms_count}`);

        const smsQTableHandlerDatas = {
            user_id,
            contacts: studentDatas.student_info.phone,
            sms_text: body,
            submission_time: Date.now(),
            school_id: studentDatas.student_info.school_id,
            school_name: name,
            sender_id: smsGatewayId,
            sender_name: sender_id,
            sms_type: isUnicode ? 'unicode' : 'text',
            index: user_id,
            number_of_sms_parts,
            charges_per_sms: 0,
            is_masking,
        };
        createSmsQueueTableHandler(smsQTableHandlerDatas);
    }
    catch (err) {
        console.log({ err })
    }
}