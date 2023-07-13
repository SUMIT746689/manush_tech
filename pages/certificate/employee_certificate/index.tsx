import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/Certificate/GenerateEmployee/Results';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';

const Packages = () => {
  const { data: roles } = useClientDataFetch('/api/role/school_roles');
  const { data: templates } = useClientDataFetch('/api/certificate_templates?user_type=employee');
  console.log({roles,templates})
  return (
    <>
      <Head>
        <title>Employee Certificate Generate</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          <Result roles={roles} templates={templates} />
        </Grid>

        <Footer />
      </PageBodyWrapper>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name="employee_certificate" >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
