import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageHeader from '@/content/BulkSmsAndEmail/SmsTemplate/PageHeader';
import Results from '@/content/BulkSmsAndEmail/SmsTemplate/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import PageTitleWrapper from '@/components/PageTitleWrapper';

const SmsTemplates = () => {
  const [editData, setEditData] = useState();
  const { data: packages, reFetchData } = useClientFetch('/api/sms_templates');
  console.log({ packages })
  return (
    <>
      <Head>
        <title>Sms Template</title>
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
            datas={packages?.data || []}
            setEditData={setEditData}
          />
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

SmsTemplates.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default SmsTemplates;
