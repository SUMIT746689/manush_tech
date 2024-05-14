import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


// @ts-ignore
const post = async (req, res, refresh_token) => {
  try {
    const { title, frequency } = req.body;
    const { school_id } = refresh_token;

    if (!title || !frequency) throw new Error("required fields not founds")
    await prisma.feesHaed.create({
      data: {
        title,
        frequency,
        school_id
      }
    });

    res.status(200).json({ success: 'fees head created successfully' });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(post);
