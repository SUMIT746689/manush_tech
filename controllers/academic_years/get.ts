import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

async function get(req, res,refresh_token) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });

    if (!user.school_id) throw new Error('provide valid data');
    
    // @ts-ignore
    const response = await prisma.academicYear.findMany({
      where: { school_id: user.school_id }
    });

    if (response) return res.json({ data: response, success: true });
    else throw new Error('Invalid to find school');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)