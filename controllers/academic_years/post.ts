import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res,refresh_token) {
  try {
    const { title } = req.body;

    if (!title) throw new Error('provide valid data');
    
      const user = await prisma.user.findFirst({
        where: { id: refresh_token.id }
      });
      if(!user.school_id) throw new Error('school id not provided');
      // @ts-ignore
      const response = await prisma.academicYear.create({
        data: {
          title,
          school_id: user.school_id
        }
      });
      if (!response) throw new Error('Invalid to create school');
      res.json({ success: true });
      
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)