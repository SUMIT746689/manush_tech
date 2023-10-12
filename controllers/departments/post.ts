import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function post(req, res) {
  try {
    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');
    console.log({ refresh_token });

    
    if (req.body.title && refresh_token.school_id) {
      
      await prisma.department.create({
        data:{
          title:req.body.title,
          school_id: refresh_token.school_id
        }
      });

      res.status(200).json({ success: true, message: 'Department created successfully !' });
    }
    else {
      throw new Error('provide all valid information');
    }

  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
