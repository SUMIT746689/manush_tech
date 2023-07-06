import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function post(req, res) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');
    console.log({ refresh_token });

    const { name } = req.body;

    if (!name && !refresh_token.school_id) throw new Error('provide valid data');
    const response = await prisma.room.create({
      data: {
        name,
        school_id: refresh_token.school_id
      }
    });

    if (response) return res.json({ success: true });
    else throw new Error('Invalid to create room');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
