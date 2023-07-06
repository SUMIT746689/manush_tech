import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageHeader from '@/content/BulkSmsAndEmail/EmailTemplate/PageHeader';
import Results from '@/content/BulkSmsAndEmail/EmailTemplate/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import PageTitleWrapper from '@/components/PageTitleWrapper';

const EmailTemplates = () => {
  const [editData, setEditData] = useState();
  const { data: emailTemplates, reFetchData } = useClientFetch('/api/email_templates');
  
  return (
    <>
      <Head>
        <title>Email Template</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          // justifyContent="center"
          gap={2}
          px={1}
        >
          <PageTitleWrapper>
            <PageHeader
              editData={editData}
              setEditData={setEditData}
              reFetchData={reFetchData}
            />
          </PageTitleWrapper>

          <Results
            sessions={emailTemplates?.data || []}
            setEditData={setEditData}
          />
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

EmailTemplates.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default EmailTemplates;
