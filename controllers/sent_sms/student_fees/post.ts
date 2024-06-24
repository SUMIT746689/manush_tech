import prisma from '@/lib/prisma_client';
import { findMatches } from '@/utils/findMatches';
import { authenticate } from 'middleware/authenticate';
import { handleConvBanNum } from 'utilities_api/convertBanFormatNumber';
import { logFile } from 'utilities_api/handleLogFile';
import { handleNumberOfSmsParts } from 'utilities_api/handleNoOfSmsParts';
import { verifyIsUnicode, verifyNumeric } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { id, school_id } = refresh_token;

    const { sms_text, contacts, student_id, student_info_id, total_paid_amount, tracking_number } = req.body;

    if (!sms_text || !contacts || !student_id || !student_info_id) throw new Error('sms_text/contacts/student_id/student_info_id fields missing');
    const currentDate = new Date().getTime();
    const sms_shoot_id = [String(school_id), String(currentDate)].join('_');

    const resSchool = await prisma.school.findFirst({
      where: { id: school_id },
      include: {
        SmsGateway: true,
        smsSettings: true,
        student_list: {
          where: { id: student_info_id },
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            school_id: true,
            phone: true,
            gender: true,
            variance: {
              where: { academic_year: { curr_active: true } },
              select: {
                id: true,
                // guardian_phone: true,
                class_roll_no: true,
                section: {
                  select:
                  {
                    id: true,
                    name: true,
                    // std_entry_time: true,
                    // std_late_time: true,
                    // std_absence_time: true,
                    // std_exit_time: true,
                    class: {
                      select:
                        { name: true }
                    }
                  }
                },
              }
            }
          },
        }
      }

    });

    if (resSchool.student_list.length === 0) throw new Error("student not founds");

    const { smsSettings, masking_sms_count, non_masking_sms_count, SmsGateway } = resSchool;

    const { fees_collection_sms_body, is_fees_collection_sms_active } = smsSettings || {};
    if (!is_fees_collection_sms_active) throw new Error("fees collection sms is not active")
    if (!fees_collection_sms_body) throw new Error("fees collection sms body is empty")

    const { id: smsGatewayId, details } = SmsGateway[0] || {};
    const { sender_id, is_masking } = <any>details || {};
    if (!smsGatewayId || !sender_id) throw new Error('sms gateway or sender id not founds ');

    const studentInfoDatas = JSON.parse(JSON.stringify(resSchool.student_list[0]));

    
    //verify number
    const isNumeric = verifyNumeric(contacts);
    if (!isNumeric) throw new Error('contact number only allowed string of numeric values');
    const { number, err } = handleConvBanNum(contacts);
    if (err) throw new Error(err);
    
    const school_name = resSchool.name;
    
    studentInfoDatas["relation_with_guardian"] = studentInfoDatas?.gender ? studentInfoDatas.gender === "male" ? 'son' : 'daughter' : ''
    
    let body = fees_collection_sms_body;
    const allMatchesArray = findMatches(body);

    for (const element of allMatchesArray) {
      // @ts-ignore
      body = body.replaceAll(`#${element}#`, studentInfoDatas[element] || studentInfoDatas.variance[element] || element === 'total_paid_amount' && total_paid_amount || element === 'tracking_number' && tracking_number || '')
    }
    body = body.replace(/ +(?= )/g, '');
    const isUnicode = verifyIsUnicode(body);

    // verify no of parts a sms
    const sms_available_count = is_masking ? masking_sms_count : non_masking_sms_count;
    const number_of_sms_parts = handleNumberOfSmsParts({ isUnicode, textLength: body.length });
    if (sms_available_count < number_of_sms_parts) throw new Error(`${is_masking ? 'masking' : 'non masking'} sms count is ${sms_available_count}`);

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
            sms_type: isUnicode ? 'unicode' : 'text',
            sms_text: body,
            // // sender_id: 1,
            // // sender_name: "",
            submission_time: new Date(currentDate),
            contacts: number,
            pushed_via: 'fees collect gui',
            // // status: status,
            // // route_id: 1,
            // // coverage_id: 1,
            charges_per_sms: 0,
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
