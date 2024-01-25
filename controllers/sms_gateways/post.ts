import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { details, id } = req.body;

    if (
      // !title || 
      !details
    ) throw new Error("provide valid data")

    const { sender_id, sms_api_key } = details;

    const query = {
      title: 'mram',
      details: {},
    };

    const smsType = verifyIsMasking(sender_id);
    const update_sender_id = !smsType && sender_id.length === 11 ? 88 + sender_id : sender_id;

    query.details['is_masking'] = smsType ? true : false;
    query.details['sender_id'] = update_sender_id || undefined;
    query.details['sms_api_key'] = sms_api_key || undefined;


    const response = await prisma.smsGateway.upsert({
      where: {
        id: id
      },
      update: query,
      create: {
        ...query,
        is_active: true,
        school_id: Number(refresh_token.school_id)
      }
    })

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)