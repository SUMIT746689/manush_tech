import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyNumeric } from 'utilities_api/verify';

async function patch(req, res, refresh_token) {
  try {
    const { role } = refresh_token;
    const { details } = req.body;
    const { id } = req.query;

    if (!details) throw new Error("provide required data for update")
    if (role?.title !== "ASSIST_SUPER_ADMIN") throw new Error("permission denied");

    const { sender_id } = details;

    const isNumeric = verifyNumeric(sender_id);
    if (!isNumeric) throw new Error("sender id required valid numbers")
    const update_sender_id = sender_id.length === 11 ? 88 + sender_id : sender_id;

    const data = {};
    if (update_sender_id) data["details"] = { sender_id: update_sender_id };
    // if (is_active) data["is_active"] = is_active;


    const response = await prisma.voiceGateway.update({
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