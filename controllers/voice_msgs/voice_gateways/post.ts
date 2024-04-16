import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyIsMasking, verifyNumeric } from 'utilities_api/verify';

async function post(req, res, refresh_token) {
  try {

    const { admin_panel_id, role } = refresh_token;
    const { school_id, details, id } = req.body;

    if (role?.title !== "ASSIST_SUPER_ADMIN") throw new Error("permission denied")
    if (!school_id || !details) throw new Error("provide valid data")

    const findSchool = await prisma.school.findFirst({ where: { id: school_id, admin_panel_id } })
    if (!findSchool) throw new Error("invalid school founds");

    const isAlreadyCreateGateways = await prisma.voiceGateway.findFirst({ where: { id: school_id } })
    if(isAlreadyCreateGateways) throw new Error("this school already have a voice sms gateway")

    const { sender_id } = details;

    const query = {
      title: 'mram',
      details: {},
    };

    const isNumeric = verifyNumeric(sender_id);
    if (!isNumeric) throw new Error("sender id required valid numbers")
    const update_sender_id = sender_id.length === 11 ? 88 + sender_id : sender_id;

    // query.details['is_masking'] = type ? true : false;
    query.details['sender_id'] = update_sender_id || undefined;

    const response = await prisma.voiceGateway.create({
      data: {
        ...query,
        school_id
      }
    });

    return res.json({ data: response, success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)