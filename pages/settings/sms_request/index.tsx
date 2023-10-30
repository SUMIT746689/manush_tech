import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import Request from '@/content/SmsRequest/Request';
import ActiveSms from '@/content/SmsRequest/AvailableSms';
import PageBodyWrapper from '@/components/PageBodyWrapper';

const Packages = () => {
  const { data: packages } = useClientFetch('/api/packages');
  return (
    <>
      <Head>
        <title>Sms Request</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          <Grid sx={{ maxWidth: 500, pt: 4 }}>
            <ActiveSms />
          </Grid>

          <Grid sx={{ maxWidth: 500, pt: 4 }}>
            <Request packages={packages} />
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
