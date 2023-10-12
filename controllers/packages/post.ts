import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { title, price, duration,student_count } = JSON.parse(req.body);

    if (!title || !price || !duration || !student_count) throw new Error('provided all required datas');
    const response = await prisma.package.create({
      data: {
        title: title,
        price: parseFloat(price),
        duration: parseInt(duration),
        student_count: parseInt(student_count)
      }
    });

    if (!response) throw new Error('failed to update');
    res.status(201).json({ success: 'created successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
