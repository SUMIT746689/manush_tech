import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

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

    const { name, phone, email, address, admin_ids, currency, domain,
      main_balance, masking_sms_price, non_masking_sms_price,
      masking_sms_count, non_masking_sms_count,
       package_price, package_duration, package_student_count,is_std_cnt_wise
    } = req.body;

    if (!name || !phone || !email || !address) throw new Error('provide valid data');
    const admins = admin_ids.map((id) => ({ id }));
    // const response = await prisma.school.create({
    //   data: {
    //     name,
    //     phone,
    //     email,
    //     address,
    //     currency,
    //     domain,
    //     main_balance: main_balance ?? undefined,
    //     masking_sms_price: masking_sms_price ?? undefined,
    //     non_masking_sms_price: non_masking_sms_price ?? undefined,
    //     masking_sms_count: masking_sms_count ?? undefined,
    //     non_masking_sms_count: non_masking_sms_count ?? undefined,
    //     admins: { connect: admins }
    //   }
    // });



    const start_date = new Date(Date.now());
    const end_date_provided = new Date(Date.now());
    end_date_provided.setDate(end_date_provided.getDate() + package_duration);

   const response = await prisma.subscription.create({
      data: {
        school: {
          create: {
            name,
            phone,
            email,
            address,
            currency,
            domain,
            main_balance: main_balance ?? undefined,
            masking_sms_price: masking_sms_price ?? undefined,
            non_masking_sms_price: non_masking_sms_price ?? undefined,
            masking_sms_count: masking_sms_count ?? undefined,
            non_masking_sms_count: non_masking_sms_count ?? undefined,
            admins: { connect: admins }
          }
        },
        package: {
          create: {
            price: Number(package_price),
            duration: Number(package_duration),
            student_count: Number(package_student_count),
            is_std_cnt_wise 
          }
        },
        start_date,
        end_date: end_date_provided,
        is_active: true
      }
    })
    if (!response) throw new Error('Failed to create school');
    // const userSddSchool = await prisma.user.update({
    //   where: { id: admin_id },
    //   data: { school_id: response.id }
    // });
    // if (!userSddSchool) throw new Error('Failed to add school in user');
    res.status(200).json({ success: true, message: 'Successfully created school' });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(postSchool);
