import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const postSchool = async (req, res, authenticate_user) => {
  try {
    const { admin_panel_id } = authenticate_user;
    const authenticate_user_Info = await prisma.user.findFirst({
      where: { id: authenticate_user.id },
      select: {
        role: true
      }
    });

    if (authenticate_user_Info.role.title !== 'ASSIST_SUPER_ADMIN')
      throw new Error('Your role have no permissions');

    const { name, phone, email, address, admin_ids, currency, domain,
      main_balance, masking_sms_price, non_masking_sms_price,
      masking_sms_count, non_masking_sms_count,
      package_price, package_duration, package_student_count, is_std_cnt_wise
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
            admins: { connect: admins },
            AutoAttendanceSentSms: {
              create: {
                body: 'dear parents, your child #first_name# #middle_name# #last_name# is punch time #submission_time#',
                is_active: false,
                every_hit: false,
                body_format: 'text'
              }
            },
            admin_panel: {
              connect: admin_panel_id
            }
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
    res.status(200).json({ success: true, message: 'Successfully created school' });

  } catch (err) {
    logFile.error(err.message)
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
};

export default authenticate(postSchool);
