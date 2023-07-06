import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Sessions/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { schoolsApi } from 'src/mocks/schools';
import Results from 'src/content/Management/Sessions/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
function Managementschools() {
  // const isMountedRef = useRefMounted();
  const [sessions, setSessions] = useState<Project[]>([]);
  const [editSession, setEditSession] = useState<Project>(null);

  const { data, reFetchData, error } = useClientFetch('/api/sessions');

  useEffect(() => {
    if (data?.success) setSessions(data.sessions);
  }, [data, error]);

  return (
    <>
      <Head>
        <title>Teacher - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSession={editSession}
          setEditSession={setEditSession}
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
          <Results
            sessions={sessions}
            editSession={editSession}
            setEditSession={setEditSession}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="session">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
