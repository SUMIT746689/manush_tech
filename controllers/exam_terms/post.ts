import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

async function post(req, res, refresh_token) {
  try {
    const { school_id } = refresh_token;
    if (!school_id) throw new Error('provide valid data');

    const { title, academic_year_id } = req.body;

    const response = await prisma.examTerm.create({
      data: {
        title,
        academic_year_id,
        school_id
      }
    });

    if (!response) throw new Error('Invalid to create room');
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post);