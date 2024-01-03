
import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const id = async (req, res, refresh_token) => {
  try {
    
    const id = Number(req.query.id);
    
    await prisma.teacher.update({
      where: {
        id: id,
        school_id: refresh_token?.school_id,
      },
      data: {
        deleted_at: new Date()
      }
    })
    res.status(200).json({ message: 'Teacher delete successfully !!' });

  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
};

export default id;
