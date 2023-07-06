import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function get(req: any, res: any) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);
  
    if (!refresh_token) throw new Error('invalid user');
  
    const response = await prisma.package.findMany({});    
     
    res.status(200).json({ data: response, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
