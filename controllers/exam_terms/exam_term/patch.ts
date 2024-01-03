import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function patch(req, res, refresh_token) {
  try {
    const { school_id } = refresh_token;
    if (!school_id) throw new Error('invalid user');

    // user verify end
    const { id } = req.query;
    const { title } = req.body;

    if (!title) throw new Error('provide valid data');

    const response = await prisma.examTerm.update({
      where: {
        id: parseInt(id),
        // school_id
      },
      data: {
        title
      }
    });

    if (!response) throw new Error('Invalid to update exam term');
    res.json({ success: true });
    
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch);