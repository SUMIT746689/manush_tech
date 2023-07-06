import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

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
      if (response) return res.json({ success: true });
      else throw new Error('Invalid to create school');
    
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)