import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { handleConvBanNum } from 'utilities_api/convertBanFormatNumber';
import { logFile } from 'utilities_api/handleLogFile';
import { handleNumberOfSmsParts } from 'utilities_api/handleNoOfSmsParts';
import { verifyIsUnicode, verifyNumeric } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { id, school_id } = refresh_token;

    const { sms_text, contacts } = req.body;

    if (!sms_text || !contacts)
      throw new Error('sms_text/contacts fields missing');

    const currentDate = new Date().getTime();
    const sms_shoot_id = [String(school_id), String(currentDate)].join('_');

    const resSchool = await prisma.school.findFirst({
      where: { id: school_id },
      include: { SmsGateway: true }
    });

    const { SmsGateway } = resSchool;
    const { id: smsGatewayId, details } = SmsGateway[0] || {};
    const { sender_id, is_masking } = <any>details || {};
    if (!smsGatewayId || !sender_id)
      throw new Error('sms gateway or sender id not founds ');

    //verify number
    const isNumeric = verifyNumeric(contacts);
    if (!isNumeric)
      throw new Error('contact number only allowed string of numeric values');
    const { number, err } = handleConvBanNum(contacts);
    console.log({ number, err });
    if (err) throw new Error(err);

    const school_name = resSchool.name;

    // verify sms type
    const isUnicode = verifyIsUnicode(sms_text || '');
    const sms_type = isUnicode ? 'unicode' : 'text';

    const charges_per_sms = resSchool.masking_sms_price;

    // calculate number of sms parts
    const number_of_sms_parts = handleNumberOfSmsParts({
      isUnicode,
      textLength: sms_text.length
    });

    // const resStudent = await prisma.studentInformation.findFirst({ where: { user_id: id }, select: { id: true } });

    await prisma
      .$transaction([
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
            contacts: number,
            pushed_via: 'gui',
            // // status: status,
            // // route_id: 1,
            // // coverage_id: 1,
            charges_per_sms,
            total_count: 1,
            number_of_sms_parts
          }
        }),
        prisma.school.update({
          where: { id: school_id },
          data: {
            masking_sms_count: is_masking
              ? { decrement: number_of_sms_parts }
              : undefined,
            // @ts-ignore
            non_masking_sms_count: !is_masking
              ? { decrement: number_of_sms_parts }
              : undefined
          }
        })
      ])
      .then((response) => {
        return res.status(200).json({ success: true });
      })
      .catch((err) => {
        logFile.error(err.message);
        console.log({ err });
        return res.status(404).json({ error: err.message });
      });
    // res.json({ data: response, success: true });
  } catch (err) {
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post);
