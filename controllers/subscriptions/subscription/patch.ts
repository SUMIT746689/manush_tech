import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function patch(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { title, price, duration } = req.body;
    const data = {};

    const { school_id, package_id, start_date, end_date, is_active } = JSON.parse(req.body);

    if (!school_id && !package_id && !start_date && !end_date && !is_active) throw new Error('provide nothing to update');

    // data[school_id] = school_id;
    // data[package_id] = package_id;
  

    const response = await prisma.subscription.update({
      where: {
        id: parseInt(req.query.id)
      },
      data
    });

    if (!response) throw new Error('failed to update');
    res.status(200).json({ success: 'updated successfully' });
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
