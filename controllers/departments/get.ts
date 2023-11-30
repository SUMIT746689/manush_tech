
import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function get(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token || !refresh_token.school_id) throw new Error('invalid user');
    console.log({ refresh_token });

    //@ts-ignore
    const departments = await prisma.department.findMany({
      where: {
        school_id: refresh_token.school_id,
        deleted_at: null
      }
    });
    // delete user['password'];
    res.status(200).json({ data: departments, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
