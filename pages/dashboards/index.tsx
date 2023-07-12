import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import DashboardReportsContent from 'src/content/DashboardPages/reports';
import { SSRHTTPClient } from 'repositories/base';
import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
import StudentDashboardReportsContent from '@/content/DashboardPages/reports/student_dashboard';
import TeacherDashboardReportsContent from '@/content/DashboardPages/reports/teacher_dashboard';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: any) {

  let blockCount: any = { holidays: [] };
  try {
    // const client = SSRHTTPClient(context)
    // const res = await client.get(`${process.env.NEXT_PUBLIC_BASE_API}/api/dashboard`)
    // blockCount = res.data;

    const cookie = context.req.headers.cookie.startsWith('refresh_token=') ? context.req.headers.cookie.replace('refresh_token=', '') : null;

    const refresh_token: any = refresh_token_varify(cookie);

    // if (refresh_token) return {hasError: true}
    if (!refresh_token) return blockCount;
    console.log({ refresh_token })

    console.log({ cookie: cookie });

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
      case 'SUPER_ADMIN':
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
        blockCount['students'] = {
          count: await prisma.student.count({
            where: { student_info: { school_id: refresh_token?.school_id } }
          })
        };
        blockCount['teachers'] = {
          count: await prisma.teacher.count({
            where: { school_id: refresh_token?.school_id }
          })
        };
        await updateHolidays();
        break;

      case 'TEACHER':
        blockCount['role'] = 'teacher';
        blockCount['teacher'] = await prisma.teacher.findFirst({
          where: { user_id: refresh_token.id },
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
        await updateHolidays();
        break;

      default:

    }

  } catch (err) {
    console.log(err)
  }
  const stringify = JSON.stringify(blockCount);
  const parseJson = JSON.parse(stringify);

  return {
    props: { blockCount: parseJson },
  }
}

function DashboardReports({ blockCount }) {
  const router = useRouter();

  useEffect(() => {
    // router.reload()
  }, [])

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
