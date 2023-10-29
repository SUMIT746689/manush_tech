import { authenticate } from 'middleware/authenticate';
import prisma from '@/lib/prisma_client';
import { verifyUser } from 'utilities_api/verify';


const patch = async (req: any, res: any, refresh_token) => {
  try {

    // if (!refresh_token.school_id) throw new Error('permission denied');
    const { user_id } = refresh_token;
    const isEligibleUser = await verifyUser(user_id, ['SUPER_ADMIN']);
    if (!isEligibleUser) throw new Error('permission denied');

    const { id, status } = req.query;

    const resBuySms = await prisma.requestBuySms.findFirst({
      where: { id: parseInt(id) }
    });

    if (status !== "approved") {
      await prisma.requestBuySms.update({
        where: { id: parseInt(id) },
        data: {
          status
        }
      });
      return res.status(201).json({ success: `update status = ${status} successfully` })
    }

    await prisma.$transaction([
      prisma.requestBuySms.update({
        where: { id: parseInt(id) },
        data: {
          status
        }
      }),
      prisma.school.update({
        where: { id: resBuySms.school_id },
        data: {
          masking_sms_count: { increment: resBuySms.masking_count || 0 },
          non_masking_sms_count: { increment: resBuySms.non_masking_count || 0 }
        }
      })
    ])
    res.status(201).json({ success: 'created successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};


export default authenticate(patch);
