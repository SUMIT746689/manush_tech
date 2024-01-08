import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";
import { findMatches } from "./findMatches.js";
import { logFile } from "./handleLog.js";

export const sentSms = (data, isAlreadyAttendanceEntry, studentDatas, user_id) => {
    try {

        const { details } = Array.isArray(studentDatas.student_info?.school?.SmsGateway) && studentDatas.student_info?.school?.SmsGateway?.length > 0 ? studentDatas.student_info?.school?.SmsGateway[0] : {};
        const { sender_id } = details ?? {};
        if (0) return logFile.error({ "server": err.message })
        console.log({ details })
        if (!data.is_active) return;
        if (!data.every_hit && isAlreadyAttendanceEntry?.id) return;

        const allMatchesArray = findMatches(data.body);

        let body = data.body;
        for (const element of allMatchesArray) {
            body = body.replaceAll(`#${element}#`, studentDatas[element] || studentDatas.student_info[element] || '')
        }
        console.log({ body })
        const number_of_sms_parts = body.length <= 160 ? 1 : Math.ceil(body.length / 153)
        const resSmsGateWay = ''
        const smsQTableHandlerDatas = {
            user_id,
            contacts: studentDatas.guardian_phone,
            sms_text: body,
            submission_time: Date.now(),
            school_id: studentDatas.student_info.school_id,
            school_name: studentDatas.student_info.school.name,
            sender_id,
            sms_type: "masking",
            index: user_id,
            number_of_sms_parts,
            charges_per_sms
        };

        createSmsQueueTableHandler(smsQTableHandlerDatas);
    }
    catch (err) {
        console.log({ err })
    }
}