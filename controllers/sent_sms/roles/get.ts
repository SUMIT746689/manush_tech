import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {

    const response = await prisma.role.findMany({
      where: {
        title: { 
          not: 'SUPER_ADMIN'
        } 
      },
      // select: { title: true }
    })
    // const role = response.length > 0 ? response.map(role=>{role}) : [];
    res.json({ data: response, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)