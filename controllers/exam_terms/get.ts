import prisma from '@/lib/prisma_client';
import { academicYearVerify, authenticate } from 'middleware/authenticate';

// @ts-ignore
async function get(req, res, refresh_token, academic_year) {
  try {
    console.log({ refresh_token, academic_year })
    const { school_id } = refresh_token;
    const { id: academic_year_id } = academic_year;
    if (!school_id) throw new Error('invalid user');

    const response = await prisma.examTerm.findMany({
      where: {
        school_id,
        deleted_at: null,
        academic_year_id
      }
    });

    if (response) return res.json({ success: true, data: response });
    else throw new Error('Invalid to create school');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(academicYearVerify(get));