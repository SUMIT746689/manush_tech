import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from '@/lib/prisma_client';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST'){
    console.log(req.body);

    // await prisma.school

    res.status(200).end()
    return
  }

  res.status(405).end("method not allowed")
}