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
      package_price, package_duration, package_student_count, is_std_cnt_wise,
      voice_sms_balance,
      voice_sms_price,
      voice_pulse_size,
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
            voice_sms_balance,
            voice_sms_price,
            voice_pulse_size,
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
              connect: { id: admin_panel_id }
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
    });

    await prisma.academicYear.create({ data: { title: String((new Date()).getFullYear()), school_id: response.school_id, curr_active: true } });
    await createClassesWithSections(response.school_id);
    // await prisma.section.create({
    //   data: {
    //     name: "default-One",
    //     class: {
    //       create:
    //         { name: "One", code: "001", has_section: false, school_id: response.school_id, }
    //     }
    //   },
    //   // [
    //   //   { name: "Two", code: "002", has_section: false, school_id: response.school_id },
    //   //   { name: "Three", code: "003", has_section: false, school_id: response.school_id },
    //   //   { name: "Four", code: "004", has_section: false, school_id: response.school_id },
    //   //   { name: "Five", code: "005", has_section: false, school_id: response.school_id },
    //   //   { name: "Six", code: "006", has_section: false, school_id: response.school_id },
    //   //   { name: "Seven", code: "007", has_section: false, school_id: response.school_id },
    //   //   { name: "Eight", code: "008", has_section: false, school_id: response.school_id },
    //   //   { name: "Nine", code: "009", has_section: false, school_id: response.school_id },
    //   //   { name: "Ten", code: "010", has_section: false, school_id: response.school_id },
    //   // ]
    // });

    await prisma.accounts.create({
      data: {
        title: "Default", account_number: "0001", description: "This is a default bank accdount", balance: 0, school_id: response.school_id, is_dafault: true,
        payment_method: {
          createMany: {
            data: [
              { title: "cash" },
              { title: "card" }
            ]
          }
        }
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


const createClassesWithSections = async (school_id) => {
  // cls sec one
  await prisma.section.create({
    data: {
      name: "default-One",
      class: {
        create:
          { name: "One", code: "001", has_section: false, school_id, }
      }
    }
  });
  // cls sec two
  await prisma.section.create({
    data: {
      name: "default-Two",
      class: {
        create:
          { name: "Two", code: "002", has_section: false, school_id, }
      }
    }
  });
  // cls sec three
  await prisma.section.create({
    data: {
      name: "default-Three",
      class: {
        create:
          { name: "Three", code: "003", has_section: false, school_id, }
      }
    }
  });
  // cls sec four
  await prisma.section.create({
    data: {
      name: "default-Four",
      class: {
        create:
          { name: "Four", code: "004", has_section: false, school_id, }
      }
    }
  });
  // cls sec five
  await prisma.section.create({
    data: {
      name: "default-Five",
      class: {
        create:
          { name: "Five", code: "005", has_section: false, school_id, }
      }
    }
  });
  // cls sec six
  await prisma.section.create({
    data: {
      name: "default-Six",
      class: {
        create:
          { name: "Six", code: "006", has_section: false, school_id, }
      }
    }
  });
  // cls sec seven
  await prisma.section.create({
    data: {
      name: "default-Seven",
      class: {
        create:
          { name: "Seven", code: "007", has_section: false, school_id, }
      }
    }
  });
  // cls sec eight
  await prisma.section.create({
    data: {
      name: "default-Eight",
      class: {
        create:
          { name: "Eight", code: "008", has_section: false, school_id, }
      }
    }
  });
  // cls sec nine
  await prisma.section.create({
    data: {
      name: "default-Nine",
      class: {
        create:
          { name: "Nine", code: "009", has_section: false, school_id, }
      }
    }
  });
  // cls sec ten
  await prisma.section.create({
    data: {
      name: "default-Ten",
      class: {
        create:
          { name: "Ten", code: "010", has_section: false, school_id, }
      }
    }
  });
}