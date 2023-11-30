
import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

const id = async (req, res, refresh_token) => {
  try {
    
    await prisma.user.findFirstOrThrow({
      where: {
        role: {
          id: refresh_token?.role?.id,
          title: 'ADMIN'
        }
      }
    })
    
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
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(id);
