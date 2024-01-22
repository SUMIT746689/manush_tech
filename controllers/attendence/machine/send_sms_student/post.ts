import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
  try {
    const { class_id, section_id, academic_year_id } = req.query;
    console.log({ class_id, section_id, academic_year_id });

    if (!class_id || !academic_year_id) {
      logFile.error("required field is not found")
      return res.status(400).json({ "error": " required field is not found" });
    }

    await prisma.tbl_student_sent_sms_queue.create({
      data: {
        class_id: parseInt(class_id),
        section_id: section_id ? parseInt(section_id) : null,
        school_id: parseInt(refresh_token.school_id),
        academic_year_id: parseInt(academic_year_id)
      }
    })

    return res.json({ message: "successfully sending messages...", success: true });

  } catch (err) {
    logFile.error(err.message)
    console.log({ err: err.message });
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)