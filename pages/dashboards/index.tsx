import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import DashboardReportsContent from 'src/content/DashboardPages/reports';
import { SSRHTTPClient } from 'repositories/base';
import prisma from '@/lib/prisma_client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
import StudentDashboardReportsContent from '@/content/DashboardPages/reports/student_dashboard';

export async function getServerSideProps(context: any) {

  let blockCount: object = {};
  try {
    // const client = SSRHTTPClient(context)
    // const res = await client.get(`${process.env.NEXT_PUBLIC_BASE_API}/api/dashboard`)
    // blockCount = res.data;

    const cookie = context.req.headers.cookie.startsWith('refresh_token=') ? context.req.headers.cookie.replace('refresh_token=', '') : null;

    const refresh_token: any = refresh_token_varify(cookie);

    // if (refresh_token) return {hasError: true}
    console.log({ refresh_token })

    console.log({ cookie: cookie });

    if (refresh_token.role.title === 'SUPER_ADMIN') {
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
    }

    if (refresh_token.role.title === 'ADMIN') {
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
    }

    if (refresh_token.role.title === 'STUDENT') {
      // blockCount['class'] = await prisma.student.F({
      // where: {
      // refresh_token.id
      // }
      // })
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
      blockCount['role'] = 'student';

    }


  } catch (err) {
    console.log(err)
  }
  return {
    props: { blockCount },
  }
}

function DashboardReports({ blockCount }) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      {
        blockCount.role === "student" ? <StudentDashboardReportsContent blockCount={blockCount} />
        :
        <DashboardReportsContent blockCount={blockCount} />
      }

    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;
