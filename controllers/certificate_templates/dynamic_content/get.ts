import { PrismaClient, Prisma } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

async function get(req, res, refresh_token) {
  try {
    const where = {
      school_id: Number(refresh_token.school_id)
    }
    
    //  rawQuery = 
    const response = Prisma.StudentInformationScalarFieldEnum;
    const response2 = Prisma.StudentScalarFieldEnum;
    // const response = await prisma.certificateTemplate.findMany({
    //   where
    // })
    
    const total = {...response,...response2} ;
    let data = [] ;
    
    for (const [key, value] of Object.entries(total)) {
      console.log(`${key}: ${value}`);
      if(!key.includes('id')) data.push(`{${value}}`)
    }

    
    res.json({ data, success: true });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(get)