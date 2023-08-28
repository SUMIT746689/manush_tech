import prisma from '@/lib/prisma_client';
import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res,refresh_token) => {
  try {
    const { method } = req;


    switch (method) {
      case 'GET':
        const classes = await prisma.class.findMany({
          where: {
            school_id: refresh_token.school_id
          },
          include: {
            sections: {
              select: {
                id: true,
                name: true
              }
            },
            Group: true
          }
        });


        res.status(200).json(classes);
        break;
      case 'POST':
        const name = req.body.name.trim()
        const isExists = await prisma.class.findFirst({
          where: {
            name,
            school_id: refresh_token.school_id
          }
        })
        if (isExists) {
          throw new Error('This class is already exists !')
        }
        const newClass = await prisma.class.create({
          data: {
            name,
            code: req.body.code,
            school_id: refresh_token.school_id
            // has_section: true,
          }
        });
        const sectionName = req.body.section_name
          ? req.body.section_name
          : `default-${req.body.name}`;
        await prisma.section.create({
          data: {
            name: sectionName,
            class_id: newClass.id
          }
        });
        res.status(200).json({ message: 'class and section created successfull!!' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index);
