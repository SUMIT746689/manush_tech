import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { school_id, package_id, end_date } = req.body;
    console.log(req.body);

    if (!school_id || !package_id)
      throw new Error('provided all required datas');

    const resPackage = await prisma.package.findFirst({
      where: { id: Number(package_id) }
    });

    if (!resPackage) throw new Error('Package not founds');

    // await prisma.subscription.updateMany({
    //   where: { school_id: parseInt(school_id) },
    //   data: {
    //     is_active: false
    //   }
    // });

    const prev_subscription = await prisma.subscription.findFirst({
      where: { school_id: parseInt(school_id) }
    })



    if (!prev_subscription) {
      const start_date = new Date(Date.now());

      let end_date_provided;
      if (end_date) {
        end_date_provided = new Date(end_date)
      }
      else {
        end_date_provided = new Date(Date.now());
        end_date_provided.setDate(end_date_provided.getDate() + resPackage.duration);
      }

      await prisma.subscription.create({
        data: {
          school_id,
          package_id,
          start_date,
          end_date: end_date_provided,
          is_active: true
        }
      });
    }
    else {
      if (prev_subscription.package_id !== Number(package_id)) throw new Error('Can not assign another package');

      await prisma.subscription.update({
        where: {
          id: prev_subscription.id
        },
        data: {
          school_id,
          end_date: new Date(end_date),
          is_active: true
        }
      });
    }
    res.status(201).json({ success: 'created successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
}
