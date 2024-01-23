import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {
    const { title, details, id } = req.body;

    if (!title || !details) throw new Error("provide valid data")

    const { sender_id } = details;

    const smsType = verifyIsMasking(sender_id);

    details['is_masking'] = smsType ? true : false;
    
    const query = {
      title: title,
      details: details,
    };

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