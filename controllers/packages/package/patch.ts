import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function patch(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { price, duration,student_count } = req.body;
    const data = {};

    if (!price && !duration && !student_count) throw new Error('provide nothing to update');

  
    if (price) data['price'] = parseInt(price);
    if (duration) data['duration'] = parseInt(duration);
    if (student_count) data['student_count'] = parseInt(student_count);
    
    const response = await prisma.package.update({
      where: {
        id: parseInt(req.query.id)
      },
      data
    });

    if (!response) throw new Error('failed to update');
    res.status(200).json({ success: 'updated successfully' });
  } catch (err) {
    logFile.error(err.message)
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
