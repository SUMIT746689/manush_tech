import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Request from '@/content/PackageRequest/Request';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import ActivePackage from '@/content/PackageRequest/ActivePackage';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';
import { useRouter } from 'next/router'
import useNotistick from '@/hooks/useNotistick';
import { useEffect } from 'react';

export async function getServerSideProps(context: any) {
  let school;
  try {

    const refresh_token: any = serverSideAuthentication(context);
    if (!refresh_token) return { redirect: { destination: '/login' } };

    school = await prisma.subscription.findFirst({
      where: {
        school_id: refresh_token?.school_id,
        is_active: true
      },
      include: {
        package: true
      }
    })
    if (school?.package?.is_std_cnt_wise) {

      const student_cnt = await prisma.student.aggregate({
        where: {
          student_info: {
            school_id: refresh_token?.school_id,
            user: {
              deleted_at: null
            }
          },
        },
        _count: {
          id: true
        }
      })

      school.package.price = student_cnt._count.id * school?.package?.price
    }

  } catch (err) {
    console.log(err)
  }
  const parseJson = JSON.parse(JSON.stringify(school));

  return { props: { school: parseJson } }
}
const Packages = ({ school }) => {
  const { showNotification } = useNotistick()
  console.log({ school });
  const router = useRouter()

  useEffect(() => {
    router?.query?.message && showNotification(router?.query?.message)
  }, [])

  return (
    <>
      <Head>
        <title>Payment Request</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          <Grid sx={{ maxWidth: 500, pt: 4 }}>
            <ActivePackage school={school} />
          </Grid>

          <Grid sx={{ maxWidth: 500, pt: 4 }}>
            <Request school={school} />
          </Grid>
        </Grid>

        <Footer />
      </PageBodyWrapper>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name="teacher">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
