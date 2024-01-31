import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';
import { verifyNumeric } from 'utilities_api/verify';

async function patch(req, res, refresh_token) {
  try {
    const { id } = req.query;
    const { school_id } = refresh_token;
    if (!school_id) throw new Error('unauthorized user');
    console.log("verify", verifyNumeric(id))
    if (!verifyNumeric(id)) throw new Error('provide valid academic year id');

    const parseId = parseInt(id);

    const findAcademic = await prisma.academicYear.findFirst({
      where: { AND: [{ school_id }, { id: parseId }] }
    });

    if (!findAcademic) throw new Error('no academic years founds')

    const user = await prisma.academicYear.updateMany({
      where: { school_id },
      data: { curr_active: false }
    });

    const response = await prisma.academicYear.update({
      where: { id: parseId },
      data: {
        curr_active: true
      }
    });

    if (!response) throw new Error('Invalid to update current active academic year');
    res.json({ success: true });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch)