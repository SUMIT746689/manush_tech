import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsUnicode } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    console.log({ refresh_token })
    const { id, school_id } = refresh_token;

    const { sms_text, contacts } = req.body;

    const currentDate = new Date().getTime();
    console.log({ sms_text })
    const sms_shoot_id = [String(school_id), String(currentDate)].join("_");

    const resSchool = await prisma.school.findFirst({ where: { id: school_id }, include: { SmsGateway: true } });
    // console.log({ resSchool })
    const { SmsGateway } = resSchool;
    const { id: smsGatewayId, details } = SmsGateway[0] || {};
    const { sender_id, is_masking } = <any>details;
    if (!smsGatewayId || !sender_id) throw new Error('sms gateway or sender id not founds ');
    const school_name = resSchool.name;
    const isUnicode = verifyIsUnicode(sms_text || '');
    const sms_type = isUnicode ? 'unicode' : 'text';
    const charges_per_sms = resSchool.masking_sms_price;
    const sms_text_length = isUnicode ? sms_text?.length * 2 : sms_text?.length;
    const number_of_sms_parts = sms_text_length <= 160 ? 1 : Math.ceil(sms_text_length / 153);

    const resStudent = await prisma.studentInformation.findFirst({ where: { user_id: id } });

    await prisma.$transaction([
      prisma.tbl_queued_sms.create({
        data: {
          sms_shoot_id,
          user_id: parseInt(id),
          school_id,
          school_name,
          sender_id: smsGatewayId,
          sender_name: sender_id,
          sms_type,
          sms_text,
          // // sender_id: 1,
          // // sender_name: "",
          submission_time: new Date(currentDate),
          contacts,
          pushed_via: 'gui',
          // // status: status,
          // // route_id: 1,
          // // coverage_id: 1,
          charges_per_sms,
          total_count: 1,
          number_of_sms_parts
          // // is_black_list: 2,
          //fail_count: 3,
          //priority: 4
        }
      }),
      prisma.tbl_sent_sms.create({
        data: {
          sms_shoot_id,
          user_id: parseInt(id),
          school_id,
          school_name,
          sender_id,
          sms_type,
          sms_text,
          // // sender_id: 1,
          // // sender_name: "",
          submission_time: new Date(currentDate),
          contacts,
          pushed_via: '',
          // // status: status,
          // // route_id: 1,
          // // coverage_id: 1,
          charges_per_sms,
          total_count: 1,
          number_of_sms_parts
          // // is_black_list: 2,
          //fail_count: 3,
          //priority: 4
        }
      }),
      prisma.school.update({
        where: { id: school_id },
        data: {
          masking_sms_count: is_masking ? { decrement: 1 } : undefined,
          // @ts-ignore
          non_masking_sms_count: !is_masking ? { decrement: 1 } : undefined
        }
      })
    ])
      .then(response => { return res.status(200).json({ success: true }) })
      .catch(err => {
        logFile.error(err.message)
        console.log({ err })
        return res.status(404).json({ error: err.message })
      })
    // res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)