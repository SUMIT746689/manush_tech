import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { school_id, details, id } = req.body;
    const { role, school_id: user_school_id } = refresh_token;
    
    if (
      // !title || 
      !details
    ) throw new Error("provide valid data")

    const { sender_id, sms_api_key } = details;
    const smsType = verifyIsMasking(sender_id);
    const update_sender_id = !smsType && sender_id.length === 11 ? 88 + sender_id : sender_id;

    const query = {
      title: 'mram',
      details: {},
    };

    query.details['is_masking'] = smsType ? true : false;
    query.details['sender_id'] = update_sender_id || undefined;


    switch (role?.title) {
      case "ASSIST_SUPER_ADMIN":
        if (!school_id) throw new Error("school id field is required");
        if (sms_api_key) query.details['sms_api_key'] = sms_api_key;

        const response_ = await prisma.smsGateway.create({
          data: {
            ...query,
            is_active: true,
            school_id
          }
        });
        return res.json({ data: response_, success: true });
        break;

      default:
        if (!user_school_id) throw new Error("school id not founds");
        let availableGateway = null;

        if (id) {
          await prisma.smsGateway.findFirst({ where: { id: id, school_id: user_school_id } })
            .then((res) => { if (res) availableGateway = res });
        };
      
        if (!availableGateway?.id) {
          const resp = await prisma.smsGateway.create({
            data: { ...query, is_active: true, school_id: user_school_id }
          });

          return res.json({ data: resp, success: true });
        }

        if (availableGateway?.details?.sms_api_key) query.details['sms_api_key'] = availableGateway.details.sms_api_key;
        const respUpdate = await prisma.smsGateway.update({
          where: { id },
          data: { ...query, is_active: true, school_id: user_school_id }
        });
        return res.json({ data: respUpdate, success: true });
    }

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)