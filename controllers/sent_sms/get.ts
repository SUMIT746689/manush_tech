import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function get(req, res, refresh_token) {
  try {
  
    const response = await prisma.smsCampaigns.findMany({
      where: {
        school_id: Number(refresh_token.school_id)
      },
      include: {
        smsGateway: true,
        // smsCampaignDetails: true
      }
    })

  res.json({ data: response, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)