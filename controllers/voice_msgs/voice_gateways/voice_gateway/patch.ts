import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function patch(req, res, refresh_token) {
  try {
    const { title, details, is_active } = req.body;
    const { id } = req.query;
    const { school_id } = refresh_token;
    if (!school_id) throw new Error('invalid user')
    if (!title && !details) throw new Error("provide required data for update")

    const data = {};
    if (title) data["title"] = title;
    if (details) data["details"] = details;
    if (is_active) data["is_active"] = is_active;


    const response = await prisma.voiceGateway.update({
      where: {
        id: Number(id),
        school_id
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