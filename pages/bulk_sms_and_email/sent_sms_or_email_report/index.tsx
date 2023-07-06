import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/BulkSmsAndEmail/SmsOrEmailReport/Results';

const Packages = () => {
  // const { data: sent_sms } = useClientFetch('/api/sent_sms');
  return (
    <>
      <Head>
        <title>Send Sms or Email</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          <Result />
        </Grid>


        <Footer />
      </PageBodyWrapper>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
