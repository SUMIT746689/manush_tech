import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function post(req, res) {
  try {
    //user verify start
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    // user verify end

    const { id } = req.query;
    const { name } = req.body;

    if (!name && !refresh_token.school_id)
      throw new Error('provide valid data');
    const response = await prisma.room.updateMany({
      where: {
        AND: [{ id: Number(id) }, { school_id: refresh_token.school_id }]
      },
      data: {
        name
      }
    });

    if (response) return res.json({ success: true });
    else throw new Error('Invalid to update room');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
