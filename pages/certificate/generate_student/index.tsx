import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/Certificate/GenerateStudent/Results';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';

const Packages = () => {
  
  const { data: classes } = useClientFetch('/api/class');
  const { data: templates } = useClientDataFetch('/api/certificate_templates?user_type=student');
  
  return (
    <>
      <Head>
        <title>Student Certificate Generate</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          <Result classes={classes || []} templates={templates} />
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
