import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import DashboardReportsContent from 'src/content/DashboardPages/reports';
import prisma from '@/lib/prisma_client';
import StudentDashboardReportsContent from '@/content/DashboardPages/reports/student_dashboard';
import TeacherDashboardReportsContent from '@/content/DashboardPages/reports/teacher_dashboard';
import dayjs from 'dayjs';
// import { useEffect } from 'react';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import AdminDashboardContent from '@/content/DashboardPages/reports/admin_dashboard/index';

export async function getServerSideProps(context: any) {
  let blockCount: any = { holidays: [] };
  try {

    const refresh_token: any = serverSideAuthentication(context);
    console.log({ refresh_token })
    if (!refresh_token) return { redirect: { destination: '/login' } };
    const updateHolidays = async () => {
      const resHolidays = await prisma.holiday.findMany({
        where: { school_id: refresh_token.school_id }
      });

      blockCount.holidays = resHolidays.map(holiday => ({
        title: holiday.title,
        date: dayjs(holiday.date).format('YYYY-MM-DD')
      }))
    }

    switch (refresh_token.role.title) {
      case 'ASSIST_SUPER_ADMIN':
        blockCount['schools'] = { count: await prisma.school.count() };
        blockCount['admins'] = {
          count: await prisma.user.count({
            where: {
              role: {
                title: 'ADMIN'
              }
            }
          })
        };

        const resSubscription = await prisma.subscription.findMany({
          where: {
            is_active: true
          },
          select: {
            school: {
              select: {
                name: true
              }
            },
            end_date: true
          }
        });

        blockCount.holidays = resSubscription.map(sub => ({
          title: `${sub?.school?.name} subscription ending`,
          date: dayjs(sub.end_date).format('YYYY-MM-DD'),
        }));
        break;

      case 'ADMIN':
        blockCount['role'] = 'admin';
        blockCount['students'] = {
          count: await prisma.student.count({
            where: { student_info: { school_id: refresh_token?.school_id } }
          })
        };
        const school = await prisma.school.findFirst({
          where: {
            id: refresh_token?.school_id,
          },
          include: {
            subscription: {
              include: {
                package: true
              }
            },
            Notice: {
              orderBy: { created_at: 'desc' }
            }
          }
        });
        blockCount['domain'] = school?.domain || '';
        blockCount['teachers'] = {
          count: await prisma.teacher.count({
            where: { school_id: refresh_token?.school_id, deleted_at: null }
          })
        };
        blockCount["school"] = school;
        blockCount["banners"] = await prisma.banners.findFirst({});

        await updateHolidays();
        break;

      case 'TEACHER':
        blockCount['role'] = 'teacher';
        blockCount['teacher'] = await prisma.teacher.findFirst({
          where: { user_id: refresh_token.id, deleted_at: null },
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            department: {
              select: {
                title: true
              }
            }
          }
        })
        blockCount['notices'] = await prisma.notice.findMany({ where: { school_id: refresh_token.school_id } });
        blockCount["banners"] = await prisma.banners.findFirst({});

        await updateHolidays();
        break;

      case 'STUDENT':
        blockCount['role'] = 'student';
        blockCount['student'] = await prisma.student.findFirst({
          where: {
            student_info: { user_id: refresh_token.id, school_id: refresh_token.school_id }
          },
          select: {
            class_roll_no: true,
            section: {
              select: {
                name: true,
                class: true,
              }
            },
            student_info: {
              select: {
                first_name: true,
                middle_name: true,
                last_name: true,
              }
            }
          }

        });
        blockCount['notices'] = await prisma.notice.findMany({ where: { school_id: refresh_token.school_id } });
        blockCount["banners"] = await prisma.banners.findFirst({});

        await updateHolidays();
        break;

      default:
      // return { redirect: {destination: '/status/404'}}
    }

  } catch (err) {
    console.log(err)
  }
  const parseJson = JSON.parse(JSON.stringify(blockCount));

  return { props: { blockCount: parseJson } }
}

function DashboardReports({ blockCount }) {

  switch (blockCount?.role) {
    case 'teacher':
      return (
        <>
          <Head> <title>Teacher Dashboard</title> </Head>
          <TeacherDashboardReportsContent blockCount={blockCount} />
        </>
      )
    case 'student':
      return (
        <>
          <Head><title>Student Dashboard</title></Head>
          <StudentDashboardReportsContent blockCount={blockCount} />
        </>
      )
    case 'admin':
      return (
        <>
          <Head><title>Dashboard</title></Head>
          <AdminDashboardContent blockCount={blockCount} />
        </>
      )
    default:
      return (
        <>
          <Head><title>Dashboard</title></Head>
          <DashboardReportsContent blockCount={blockCount} />
        </>
      )
  }
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;
