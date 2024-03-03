import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { details, id } = req.body;

    let isAleadyHaveVoiceGateway = false;

    if (id) {
      const resVoiceGateway = await prisma.voiceGateway.findFirst({ where: { id } });
      if (!resVoiceGateway) throw new Error("invalid id field");
      isAleadyHaveVoiceGateway = true;
    }

    if (!details) throw new Error("provide valid data")

    const { sender_id, api_key } = details;

    const query = {
      title: 'mram',
      details: {},
    };

    const type = verifyIsMasking(sender_id);
    const update_sender_id = !type && sender_id.length === 11 ? 88 + sender_id : sender_id;

    query.details['is_masking'] = type ? true : false;
    query.details['sender_id'] = update_sender_id || undefined;
    query.details['api_key'] = api_key || '';

    if (isAleadyHaveVoiceGateway) {
      const response = await prisma.voiceGateway.update({
        where: {
          id
        },
        data: query,
      });

      return res.json({ data: response, success: true });
    };
    console.log({ query })
    const response = await prisma.voiceGateway.create({
      data: {
        ...query,
        school_id: Number(refresh_token.school_id)
      }
    });

    return res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)