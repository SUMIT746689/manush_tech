import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


// @ts-ignore
const patch = async (req, res, refresh_token) => {
  try {
    const { school_id } = refresh_token;
    const { title, frequency } = req.body;
    const { id } = req.query
    console.log({ id })
    if (!title && !frequency) throw new Error("required fields not founds")

    const data = {};
    if (title) data['title'] = title;
    if (frequency) data['frequency'] = frequency;

    console.log({ title, frequency, data })
    const resp = await prisma.feesHaed.update({
      where: { id: parseInt(id) },
      data: {
        title,
        frequency,
        school_id
      }
    });
    console.log({ resp })
    res.status(200).json({ success: 'fees head updated successfully' });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(patch);
