import { PrismaClient } from '@prisma/client';
// @ts-ignore
const prisma = new PrismaClient();

export const deleteTeacher = async (req, res) => {
  const { id } = req.query;
  console.log({ id });
  // // return res.json({ id });
  // await prisma.teacher.delete({
  //   where: { id: Number(id) },
  // });



  res.status(200).json({ message: 'is working' });
};
