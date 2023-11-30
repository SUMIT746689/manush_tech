import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export default async function deleteRoom(req, res,refresh_token) {
  try {
    
    const id = Number(req.query.id) ;
    
    await prisma.department.delete({
        where: {
            id: id,
            school_id: refresh_token?.school_id
        },
    })
    res.status(200).json({ message: 'Department deleted successfully' })
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
