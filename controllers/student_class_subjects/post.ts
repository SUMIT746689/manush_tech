import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
  try {
    const { subjects, student_id } = req.body;
    const { school_id } = refresh_token;

    if (!student_id || !Array.isArray(subjects)) throw new Error('student field is required');
    subjects.forEach(({ subject_id }) => {
      if (!subject_id) throw new Error('subject or teacher not founds ');
    })

    const subject_ids = subjects.map(sub => ({ id: sub.subject_id }));

    await prisma.student.update({
      where: { id: student_id, student_info: { school_id } },
      data: {
        subjects: {
          connect: {
            id: subject_ids[0].id
          }
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