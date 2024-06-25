import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
  try {
    const { sections, student_id } = req.body;
    const { school_id } = refresh_token;

    if (!student_id || !Array.isArray(sections)) throw new Error('student field is required');
    sections.forEach(({ section_id }) => {
      if (!section_id) throw new Error('subject or teacher not founds ');
    })

    const section_ids = sections.map(sec => ({ id: sec.section_id }));
    await prisma.student.update({
      where: { id: student_id, student_info: { school_id } },
      data: {
        batches: {
          connect: section_ids
        }
      }
    })

    return res.status(200).json({ message: "success" })
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)