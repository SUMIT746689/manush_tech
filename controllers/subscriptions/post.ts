import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const { school_id, subscription_id, end_date } = req.body;
    console.log(req.body);

    if (!school_id || !subscription_id)
      throw new Error('provided all required datas');


    // await prisma.subscription.updateMany({
    //   where: { school_id: parseInt(school_id) },
    //   data: {
    //     is_active: false
    //   }
    // });

    //     const prev_subscription = await prisma.subscription.findFirst({
    //       where: {
    //         id: Number(subscription_id)
    //       },
    //       select: {
    //         start_date: true,
    //         end_date: true
    //       }
    //     })
    //     const end = new Date(end_date);
    //     const start = new Date(prev_subscription.start_date)

    // console.log({start,end});

    await prisma.subscription.update({
      where: {
        id: Number(subscription_id)
      },
      data: {
        end_date: new Date(end_date),
        is_active: true,
        Subscription_history: {
          create: {
            edited_at: new Date(),
            edited_by: refresh_token.id
          }
        }
        // package: {
        //   update: {
        //     //@ts-ignore
        //     duration:  (end - start)/ (1000 * 60 * 60 * 24)
        //   }
        // }
      }
    });

    res.status(201).json({ success: 'created successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
}
