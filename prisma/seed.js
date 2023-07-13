import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const hash = await bcrypt.hash('a', Number(process.env.SALTROUNDS));



  // const superadmin = await prisma.user.create({
  //   data: {
  //     username: 'a',
  //     password: hash,
  //     role: 1
  //   }
  // });

  const createAdminPermission = await prisma.permission.create({
    data: { name: 'create admin', value: 'create_admin', group: 'admin' }
  });

  const createAdminPermissionforSchool = await prisma.permission.create({
    data: { name: 'create school', value: 'create_school', group: 'school' }
  });
  const createPakcagePermissionforSchool = await prisma.permission.create({
    data: { name: 'List Package', value: 'list_package', group: 'package' }
  });
  const pendingPakcagePermissionforSchool = await prisma.permission.create({
    data: { name: 'List Pending Packages', value: 'list_pending_packages', group: 'pending_package' }
  });

  const create_user_permission = await prisma.permission.create({
    data: { name: 'create user', value: 'create_user', group: 'user' }
  });
  const createSuperAdminRole = await prisma.role.create({
    data: {
      title: "SUPER_ADMIN",
      permissions: {
        connect: [
          { id: createAdminPermission.id },
          { id: createAdminPermissionforSchool.id },
          { id: createPakcagePermissionforSchool.id },
          { id: pendingPakcagePermissionforSchool.id },
          { id: create_user_permission.id },
        ]
      }
    }
  })


  //create a super_admin user 
  await prisma.user.create({
    data: {
      username: 'a',
      password: hash,
      user_role_id: createSuperAdminRole.id,
      role_id: createSuperAdminRole.id
    }
  });

  await prisma.permission.createMany({
    data: [

      { name: 'create academic years', value: 'create_academic_yaers', group: 'academic_years' },
      { name: 'create student', value: 'create_student', group: 'student' },
      { name: 'create gurdian', value: 'create_gurdian', group: 'guardian' },
      { name: 'create stuff', value: 'create_stuff', group: 'stuff' },
      { name: 'create accountant', value: 'create_accountant', group: 'accountant' },
      { name: 'create librarian', value: 'create_librarian', group: 'librarian' },
      { name: 'create receptionist', value: 'create_receptionist', group: 'receptionist' },
      { name: 'create teacher', value: 'create_teacher', group: 'teacher' },
      { name: 'create class', value: 'create_class', group: 'class' },
      { name: 'create section', value: 'create_section', group: 'section' },
      { name: 'create subject', value: 'create_subject', group: 'subject' },
      { name: 'create session', value: 'create_session', group: 'session' },
      { name: 'create period', value: 'create_period', group: 'period' },
      { name: 'create routine', value: 'create_routine', group: 'routine' },
      { name: 'create fee', value: 'create_fee', group: 'fee' },
      {
        name: 'student fee collect',
        value: 'student_fee_collect',
        group: 'student_fee_collect'
      },
      { name: 'create room', value: 'create_room', group: 'room' },
      { name: 'create exam', value: 'create_exam', group: 'exam' },
      { name: 'create student attendence', value: 'create_student_attendence', group: 'attendence' },
      { name: 'create exam attendence', value: 'create_exam_attendence', group: 'attendence' },
      { name: 'create employee attendence', value: 'create_employee_attendence', group: 'attendence' },
      { name: 'create collect fee', value: 'create_collect_fee', group: 'collect_fee' },
      { name: 'create holiday', value: 'create_holiday', group: 'holiday' },
      { name: 'create result', value: 'create_result', group: 'result' },
      { name: 'create department', value: 'create_department', group: 'department' },
      { name: 'create certificate template', value: 'create_certificate_template', group: 'certificate_template' },
      { name: 'create student certificate', value: 'show_student_certificate', group: 'student_certificate' },
      { name: 'create employee certificate', value: 'show_employee_certificate', group: 'employee_certificate' },
      { name: 'academic', value: 'academic', group: 'academic' },
      { name: 'teacher', value: 'teacher', group: 'teacher' },
      { name: 'accounts', value: 'accounts', group: 'accounts' },
      { name: 'front end', value: 'front_end', group: 'front_end' },
      { name: 'package request', value: 'package_request', group: 'package_request' },
      { name: 'create grade', value: 'create_grade', group: 'grade' },
      { name: 'view grade', value: 'view_grade', group: 'grade' },
      { name: 'create report', value: 'create_report', group: 'report' },
      { name: 'create bulk sms & email', value: 'create_bulk_sms_&_email', group: 'bulk_sms_&_email' },
      { name: 'create leave', value: 'create_leave', group: 'leave' },
      { name: 'view holiday', value: 'view_holiday', group: 'holiday' },
      { name: 'create notice', value: 'create_notice', group: 'notice' },
    ]
  });

  const permissions = await prisma.permission.findMany({
    where: {
      NOT: [
        {
          value: 'create_admin'
        },
        {
          value: 'create_school'
        },
        {
          value: 'list_package'
        },
        {
          value: 'list_pending_packages'
        }
      ]
    }
  });


  // Dummy Things create
  const hashPassword = await bcrypt.hash('admin', Number(process.env.SALTROUNDS));

  const createAdminRole = await prisma.role.create({
    data: {
      title: "ADMIN",
      permissions: {
        connect: permissions.map((permission) => ({
          id: permission.id
        }))
      }
    }
  })

  const admin = await prisma.user.create({
    data:
    {
      username: 'admin',
      password: hashPassword,
      user_role_id: createAdminRole.id,
      role_id: createAdminRole.id
    }
  });

  const school = await prisma.school.create({
    data: {
      name: 'My School and College',
      phone: '01773456789',
      email: 'admin@email.com',
      address: 'Gulshan-1,Dhake',
      currency: 'BDT',
      admins: { connect: { id: admin.id } }
    }
  });

  const createPackage = await prisma.package.create({
    data: {
      title: 'Monthly',
      price: 1000,
      duration: 30,
      student_count: 10
    }
  });

  const end_date = new Date(Date.now());
  end_date.setDate(end_date.getDate() + createPackage.duration);

  await prisma.subscription.create({
    data: {
      school_id: school.id,
      package_id: createPackage.id,
      start_date: new Date(Date.now()),
      end_date,
      is_active: true
    }
  });

  const createDepartment = await prisma.department.create({
    data: {
      title: 'Science',
      school_id: school.id
    }
  });

  const teacherPermissions = []
  for (const i of permissions) {
    if (i.value == 'create_exam' || i.value == 'create_result' || i.value == 'create_attendence' ||
      i.value == 'create_leave' || i.value == 'view_holiday' || i.value == 'view_grade' ||
      i.value == 'create_student_attendence' || i.value == 'create_exam_attendence'
    ) {
      teacherPermissions.push({ id: i.id })
    }
  }


  const createTeacherRole = await prisma.role.create({
    data: {
      title: "TEACHER",
      permissions: {
        connect: teacherPermissions
      }
    }
  })

  await prisma.teacher.create({
    data: {
      first_name: 'Sume',
      national_id: '653216532123',
      gender: 'female',
      date_of_birth: new Date('1/1/1996'),
      permanent_address: 'Khilgaon, Dhaka-1219',
      present_address: 'Khilgaon, Dhaka-1219',
      joining_date: new Date(),
      resume: '',
      school: { connect: { id: school.id } },
      department: { connect: { id: createDepartment.id } },
      user: {
        create: {
          username: 'Sume',
          password: hashPassword,
          user_role_id: createTeacherRole.id,
          role_id: createTeacherRole.id,
          school_id: school.id
        }
      }
    }
  });

  const createAcademicYear = await prisma.academicYear.create({
    data: {
      title: '2023',
      school_id: school.id
    }
  });

  const createClass = await prisma.class.create({
    data: {
      name: 'Nine',
      code: '901',
      school_id: school.id,
      has_section: true
    }
  });

  const createSection = await prisma.section.create({
    data: {
      name: 'A',
      class_id: createClass.id,
    }
  });

  await prisma.group.create({
    data: {
      title: 'Science',
      class_id: createClass.id
    }
  });

  // const createPermissionForStudentRole = await prisma.permission.create({ data: { name: 'show routine', value: 'show_routine', group: 'routine' } })
  const createStudentRole = await prisma.role.create({
    data: {
      title: "STUDENT",
      permissions: {
        connectOrCreate: [
          { name: 'show student fee', value: 'show_student_fee', group: 'student_fee_payment' },
          { name: 'student fee payment history', value: 'student_fee_payment_history', group: 'student_fee_payment_history' },
          { name: 'show student class routine', value: 'show_student_class_routine', group: 'class_routine' },
          { name: 'show student certificate', value: 'show_student_certificate', group: 'student_certificate' },
      
        ]
      }
    }
  })

  const studentInformation = await prisma.studentInformation.create({
    // @ts-ignore
    data: {
      first_name: 'Mehedi',
      admission_no: '874965132',
      admission_date: new Date(Date.now()),
      admission_status: 'waiting',
      date_of_birth: new Date('10/10/2010'),
      gender: 'male',
      phone: '01650324165',
      email: 'students@email.com',
      national_id: '89657410685412',

      school: {
        connect: { id: school.id }
      },
      user: {
        create: {
          username: 'Mehedi',
          password: hashPassword,
          user_role_id: createStudentRole.id,
          role_id: createStudentRole.id,
          school_id: school.id
        }
      }
    }
  });

  await prisma.student.create({
    data: {
      class_roll_no: '01',
      class_registration_no: '654312',
      discount: parseFloat(0),
      section: {
        connect: { id: createSection.id }
      },
      academic_year: {
        connect: { id: createAcademicYear.id }
      },
      student_info: {
        connect: { id: studentInformation.id }
      }
    }
  });


  // role
  // 1=superadmin, 2=admin, 3=teacher, 4=student, 5=gurdian, 6=staff, 7=accountant, 8=librarian, 9=receptionist
  await prisma.role.createMany({
    data: [
      { title: "GURDIAN" },
      { title: "STAFF" },
      { title: "ACCOUNTANT" },
      { title: "LIBRARIAN" },
      { title: "RECEPTIONIST" }
    ]
  })
}



seed().main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
