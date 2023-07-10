import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Leave/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Leave/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementLeave() {

  const { data: leave, reFetchData } = useClientFetch(`/api/leave`);

  return (
    <>
      <Head>
        <title>Leave - Management</title>
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
          <Results users={leave || []} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementLeave.getLayout = (page) => (
  <Authenticated name="">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementLeave;
