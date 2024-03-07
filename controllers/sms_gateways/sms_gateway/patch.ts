import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking } from 'utilities_api/verify';

async function patch(req, res, refresh_token) {
  try {
    const { title, details } = req.body;
    const { sender_id, sms_api_key } = details || {};
    const { id } = req.query;
    const { role } = refresh_token;

    if (role?.title !== "ASSIST_SUPER_ADMIN") throw new Error('invalid user')
    if (!details) throw new Error("provide required data for update")

    const data = { details: undefined };
    if (details) data["details"] = details;
    
    if (details?.sender_id) {
      const smsType = verifyIsMasking(sender_id);
      const update_sender_id = !smsType && sender_id.length === 11 ? 88 + sender_id : sender_id;

      data.details['is_masking'] = smsType ? true : false;

      data.details["sender_id"] = update_sender_id;
    }
    if (sms_api_key) data.details["sms_api_key"] = sms_api_key;

    const response = await prisma.smsGateway.update({
      where: {
        id: Number(id),
      },
      data
    })
    return res.json({ data: response, success: true });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch)