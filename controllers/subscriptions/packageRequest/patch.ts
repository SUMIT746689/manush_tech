import { PrismaClient } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();
const patchHandle = async (req, res) => {
  try {
    const { status, id, school_id, package_id } = req.body;

    if (!status || !id || !school_id || !package_id)
      throw new Error('provide require datas');

      //d-active all activate subscriptions
      await prisma.subscription.updateMany({
        where: { school_id: parseInt(school_id) },
        data: {
          is_active: false
        }
      });
    
      const data = {};

    if (status === 'declined') data['status'] = 'declined';

    if (status === 'approved') {
      data['status'] = 'approved';

      await prisma.subscription.updateMany({
        where: { school_id: parseInt(school_id) },
        data: {
          is_active: false
        }
      });

      const resPackage = await prisma.package.findFirst({
        where: { id: package_id }
      });

      const start_date = new Date(Date.now());
      const end_date = new Date(Date.now());
      end_date.setDate(end_date.getDate() + resPackage.duration);

      const response = await prisma.subscription.create({
        data: {
          school_id,
          package_id,
          start_date,
          end_date,
          is_active: true
        }
      });
      if (!response) throw new Error(`Could not create subscription `);
    }
    const subscriptionUpdate = await prisma.requestPackage.update({
      where: { id: id },
      data
    });
    if (subscriptionUpdate) return res.json({ success: true });
    else throw new Error('failed to update request package');
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(patchHandle);
