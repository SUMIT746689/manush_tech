import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function post(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { school_id, package_id } = req.body;

    if (!school_id || !package_id)
      throw new Error('provided all required datas');

    const resPackage = await prisma.package.findFirst({
      where: { id: package_id }
    });

    if (!resPackage) throw new Error('Package not founds');

    await prisma.subscription.updateMany({
      where: { school_id: parseInt(school_id) },
      data: {
        is_active: false
      }
    });
    const start_date = new Date(Date.now());
    const end_date = new Date(Date.now());
    end_date.setDate(end_date.getDate() + resPackage.duration);

    const response = await prisma.subscription.create({
      data: {
        school_id,
        package_id,
        start_date,
        end_date,
        is_active: true
      }
    });

    if (!response) throw new Error('failed to update');
    res.status(201).json({ success: 'created successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
