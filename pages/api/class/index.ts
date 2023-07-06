import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

const index = async (req, res) => {
  try {
    const { method } = req;

    if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

    const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

    if (!refresh_token) throw new Error('invalid user');

    const user = await prisma.user.findFirst({
      where: { id: refresh_token.id }
    });

    switch (method) {
      case 'GET':

        if (!user) {
          return res.status(400).json({ message: 'user not found!' })
        }
        const classes = await prisma.class.findMany({
          where: {
            school_id: user.school_id
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
            school_id: user.school_id
          }
        })
        if (isExists) {
          throw new Error('This class is already exists !')
        }
        const newClass = await prisma.class.create({
          data: {
            name,
            code: req.body.code,
            school_id: user.school_id
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

export default index;
