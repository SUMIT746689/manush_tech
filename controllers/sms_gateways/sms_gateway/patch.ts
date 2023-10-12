import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function patch(req, res, refresh_token) {
  try {
    const { title, details, is_active } = req.body;
    const { id } = req.query;
    console.log({ title, details, is_active });

    if (!refresh_token.school_id) throw new Error('invalid user')
    if (!title && !details && !is_active) throw new Error("provide required data for update")

    const data = {};
    if (title) data["title"] = title;
    if (details) data["details"] = details;
    if (is_active) data["is_active"] = is_active;

    // if (typeof is_active === 'boolean') {
    if (is_active) {
      const a = await prisma.smsGateway.updateMany({
        where: {
          // @ts-ignore
          school_id: Number(refresh_token.school_id),
          is_active: true,
        },
        data: { is_active: false }
      });
      console.log({ a })
    }
   
    const response = await prisma.smsGateway.update({
      where: {
        id: Number(id),
        // school: { id: Number(refresh_token.school_id) }
      }
      // @ts-ignore
      // AND: [
      //   { id: Number(id) },
      //   { school:{ id : Number(refresh_token.school_id)} }
      // ]
      // }
      ,
      data
    })

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch)