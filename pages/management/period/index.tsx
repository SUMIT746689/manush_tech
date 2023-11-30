import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Period/PageHeader';
import Result from 'src/content/Management/Period/Result';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {  Grid } from '@mui/material';
import { useState } from 'react';
import { useClientFetch } from '@/hooks/useClientFetch';
function PeriodManagement() {
  const { data,reFetchData, error } = useClientFetch('/api/period');
  const [editPeriod, setEditPeriod] = useState(null);
console.log("data__",data)
  return (
    <>
      <Head>
        <title>Period - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
         reFetchData={reFetchData}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Result
            periods={data || []}
            reFetchData={reFetchData}
            setEditPeriod={setEditPeriod}
          />
        </Grid>
      </Grid>



      <Footer />
    </>
  );
}

PeriodManagement.getLayout = (page) => (
  <Authenticated name="period">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default PeriodManagement;
