import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fsp from 'fs/promises';
import path from 'path';

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
  const pendingSmsPermissionforSchool = await prisma.permission.create({
    data: { name: 'Pending Buy Sms', value: 'pending_buy_sms', group: 'pending_sms' }
  });
  const administratorPermission = await prisma.permission.create({
    data: { name: 'administrator', value: 'administrator', group: 'administrator' }
  });

  const create_user_permission = await prisma.permission.create({
    data: { name: 'create user', value: 'create_user', group: 'user' }
  });

  const createBanners = await prisma.permission.create({
    data: { name: 'create banner', value: 'create_banner', group: 'banner' }
  });

  const package_payment_history = await prisma.permission.create({
    data: { name: 'package payment history', value: 'package_payment_history', group: 'package_payment_history' }
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
          { id: pendingSmsPermissionforSchool.id },
          { id: administratorPermission.id },
          { id: createBanners.id },
          { id: package_payment_history.id },
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
      { name: 'create staff', value: 'create_staff', group: 'staff' },
      { name: 'create accountant', value: 'create_accountant', group: 'accountant' },
      { name: 'create librarian', value: 'create_librarian', group: 'librarian' },
      { name: 'create receptionist', value: 'create_receptionist', group: 'receptionist' },
      { name: 'create teacher', value: 'create_teacher', group: 'teacher' },
      { name: 'create class', value: 'create_class', group: 'class' },
      { name: 'create section', value: 'create_section', group: 'section' },
      { name: 'create subject', value: 'create_subject', group: 'subject' },
      { name: 'create session', value: 'create_session', group: 'session' },
      { name: 'create period', value: 'create_period', group: 'period' },

      // { name: 'create routine', value: 'create_routine', group: 'routine' },
      { name: 'show class routine', value: 'show_class_routine', group: 'class_routine' },
      { name: 'show exam routine', value: 'show_exam_routine', group: 'exam_routine' },

      { name: 'create fee', value: 'create_fee', group: 'fee' },
      { name: 'show fee', value: 'show_fee', group: 'fee' },
      { name: 'collect fee', value: 'collect_fee', group: 'collect_fee' },
      // { name: 'student fee payment', value: 'student_fee_payment', group: 'student_fee_payment' },
      // { name: 'student fee payment history', value: 'student_fee_payment_history', group: 'student_fee_payment_history' },


      { name: 'create room', value: 'create_room', group: 'room' },
      { name: 'create exam', value: 'create_exam', group: 'exam' },

      { name: 'create student attendence', value: 'create_student_attendence', group: 'attendence' },
      { name: 'create exam attendence', value: 'create_exam_attendence', group: 'attendence' },
      { name: 'create employee attendence', value: 'create_employee_attendence', group: 'attendence' },

      { name: 'create holiday', value: 'create_holiday', group: 'holiday' },

      { name: 'create result', value: 'create_result', group: 'result' },
      { name: 'show section wise', value: 'show_section_wise_result', group: 'result' },
      { name: 'show student wise', value: 'show_student_wise_result', group: 'student_wise_result' },

      { name: 'create department', value: 'create_department', group: 'department' },
      { name: 'create certificate template', value: 'create_certificate_template', group: 'certificate_template' },
      { name: 'show student certificate', value: 'show_student_certificate', group: 'student_certificate' },
      { name: 'show teacher certificate', value: 'show_teacher_certificate', group: 'teacher_certificate' },
      { name: 'show employee certificate', value: 'show_employee_certificate', group: 'employee_certificate' },

      { name: 'academic', value: 'academic', group: 'academic' },

      { name: 'teacher', value: 'teacher', group: 'teacher' },
      { name: 'accounts', value: 'accounts', group: 'accounts' },
      { name: 'front end', value: 'front_end', group: 'front_end' },
      { name: 'package request', value: 'package_request', group: 'package_request' },
      { name: 'create grade', value: 'create_grade', group: 'grade' },
      { name: 'view grade', value: 'view_grade', group: 'grade' },
      { name: 'create report', value: 'create_report', group: 'report' },
      { name: 'create sms gateway', value: 'create_sms_gateway', group: 'sms_gateway' },
      { name: 'create bulk sms & email', value: 'create_bulk_sms_&_email', group: 'bulk_sms_&_email' },
      { name: 'create leave', value: 'create_leave', group: 'leave' },
      { name: 'view holiday', value: 'view_holiday', group: 'holiday' },
      { name: 'create notice', value: 'create_notice', group: 'notice' },
      { name: 'create discount', value: 'create_discount', group: 'discount' },
      { name: 'show note', value: 'show_note', group: 'note' },
      { name: 'create note', value: 'create_note', group: 'note' },
      { name: 'update note', value: 'update_note', group: 'note' },
      { name: 'create syllabus', value: 'create_syllabus', group: 'syllabus' },
      { name: 'show syllabus', value: 'show_syllabus', group: 'syllabus' },
      { name: 'home work', value: 'homework', group: 'homework' },
      { name: 'student auto sent sms', value: 'modify_student_auto_sent_sms', group: 'student_auto_sent_sms' },
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
        },
        {
          value: 'package_payment_history'
        }
      ]
    },
    select: {
      id: true,
      value: true
    }
  });

  // Dummy Things create
  const hashPassword = await bcrypt.hash('admin', Number(process.env.SALTROUNDS));

  const createAdminRole = await prisma.role.create({
    data: {
      title: "ADMIN",
      permissions: {
        connect: permissions.map(({ id }) => ({ id }))
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

  const teacherPermissions = [];

  for (const i of permissions) {
    if (['create_exam', 'show_exam_routine', 'show_class_routine', 'create_result', 'create_attendence',
      'create_leave', 'view_holiday', 'view_grade', 'create_student_attendence',
      'create_exam_attendence', 'show_teacher_certificate', 'homework', 'create_note', 'update_note', 'create_syllabus', 'show_syllabus'].includes(i.value)
    ) {
      teacherPermissions.push({ id: i.id })
    }
  }
  console.log({ teacherPermissions })

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
      // school_id:  school.id,
      school: {
        connect: {
          id: school.id
        }
      },
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
  const studentPermissions = []
  for (const i of permissions) {
    if (['show_student_certificate', 'homework', 'show_class_routine', 'show_exam_routine', 'create_leave', 'show_syllabus'].includes(i.value)) {
      studentPermissions.push({ id: i.id })
    }
  }

  const createStudentRole = await prisma.role.create({
    data: {
      title: "STUDENT",
      permissions: {
        create: [
          { name: 'student fee payment', value: 'student_fee_payment', group: 'student_fee_payment' },
          { name: 'student fee payment history', value: 'student_fee_payment_history', group: 'student_fee_payment_history' },
          { name: 'show student exam attendence', value: 'show_student_exam_attendence', group: 'show_student_exam_attendence' },
          { name: 'show student result', value: 'show_student_result', group: 'show_student_result' },

        ],
        connect: studentPermissions
      }
    }
  }
  )

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
      class_registration_no: (Date.now().toString() + Math.random().toString()).substring(0, 11),
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

  await prisma.gradingSystem.createMany({
    data: [
      { lower_mark: 0, upper_mark: 32, point: 0, grade: 'F', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 33, upper_mark: 39, point: 1, grade: 'D', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 40, upper_mark: 49, point: 2, grade: 'C', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 50, upper_mark: 59, point: 3, grade: 'B', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 60, upper_mark: 69, point: 3.5, grade: 'A-', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 70, upper_mark: 79, point: 4, grade: 'A', school_id: school.id, academic_year_id: createAcademicYear.id },
      { lower_mark: 80, upper_mark: 100, point: 5, grade: 'A+', school_id: school.id, academic_year_id: createAcademicYear.id },
    ]
  })


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
  try {
    await fsp.readdir(path.join(process.cwd(), `${process.env.FILESFOLDER}`));
  } catch (error) {
    await fsp.mkdir(path.join(process.cwd(), `${process.env.FILESFOLDER}`));
  }
}



seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
