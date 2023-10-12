import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

async function patch(req, res, refresh_token) {
  try {
    const { name, body } = req.body;
    const {id} = req.query;
    console.log({id})

    if(!refresh_token.school_id) throw new Error('invalid user')
    if (!name && !body) throw new Error("provide required data for update")

    const data = {};
    if(name) data["name"] = name;
    if(body) data["body"] = body;

    const response = await prisma.smsTemplate.update({
      // @ts-ignore
      where: {id: Number(id)},
      data
    })

    return res.json({ data: response, success: true });
    // else throw new Error('Invalid to find school');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(patch)