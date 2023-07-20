import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

const postSchool = async (req, res, authenticate_user) => {
  try {
    const authenticate_user_Info = await prisma.user.findFirst({
      where: { id: authenticate_user.id },
      select: {
        role: true
      }
    });

    if (authenticate_user_Info.role.title !== 'SUPER_ADMIN')
      throw new Error('Your role have no permissions');

    const { name, phone, email, address, admin_ids, currency,domain } = req.body;

    if (!name || !phone || !email || !address) throw new Error('provide valid data');
    const admins = admin_ids.map((id) => ({ id }));
    const response = await prisma.school.create({
      data: {
        name,
        phone,
        email,
        address,
        currency,
        domain,
        admins: { connect: admins }
      }
    });
    if (!response) throw new Error('Failed to create school');
    // const userSddSchool = await prisma.user.update({
    //   where: { id: admin_id },
    //   data: { school_id: response.id }
    // });
    // if (!userSddSchool) throw new Error('Failed to add school in user');
    res
      .status(200)
      .json({ success: true, message: 'Successfully created school' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(postSchool);
