
import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function get(req: any, res: any,refresh_token) {
  try {

    if (!refresh_token || !refresh_token?.school_id) throw new Error('invalid user');

    const departments = await prisma.department.findMany({
      where: {
        school_id: refresh_token.school_id,
      }
    });
    // delete user['password'];
    res.status(200).json({ data: departments, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
