import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Routine/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { schoolsApi } from 'src/mocks/schools';
import Results from 'src/content/Management/Routine/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { useAuth } from '@/hooks/useAuth';
import ExampRoutine from '@/content/Management/Routine/ExampRoutine';
function Routine() {

  const { user }: any = useAuth();

  // const permissions = user?.permissions ? user.permissions : null;
  // const filter =permissions ? permissions.filter((permission: any) => permission?.group === 'routine') : null;
  // console.log({ user });
  // console.log({ filter });
  // const haveCreatePermission = filter.find((permission: any) => permission.value === 'create_routine')

  return (
    <>
      <Head>
        <title>Routine</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title={'Exam routine'} />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4, minHeight: 'calc(100vh - 304px) !important' }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}

      >
        <Grid item xs={12}>
          <ExampRoutine />

        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Routine.getLayout = (page) => (
  <Authenticated name="routine">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Routine;
