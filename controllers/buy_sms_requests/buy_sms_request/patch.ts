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
    await prisma.$transaction(async (tx) => {
      await tx.requestBuySms.update({
        where: { id: parseInt(id) },
        data: {
          status
        }
      })
      const resSchool = await tx.school.update({
          where: { id: resBuySms.school_id },
          data: {
            masking_sms_count: { increment: resBuySms.masking_count || 0 },
            non_masking_sms_count: { increment: resBuySms.non_masking_count || 0 },
          }
        })
        if(!resSchool) throw new Error("failed to find school")
        await tx.smsTransaction.create({
          data: {
            masking_count: resSchool.masking_sms_count + (resBuySms.masking_count || 0),
            non_masking_count: resSchool.non_masking_sms_count + (resBuySms.non_masking_count || 0),
            prev_masking_count: resSchool.masking_sms_count,
            prev_non_masking_count: resSchool.non_masking_sms_count,
            school_id: resBuySms.school_id
          }
        })
    })
    res.status(201).json({ success: 'created successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};


export default authenticate(patch);
