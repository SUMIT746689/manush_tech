import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Group/PageHeader';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from 'src/content/Management/Group/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementGroups() {
  
  const [editGroup, setEditGroup] = useState(null);

  const {data:groups,reFetchData} = useClientFetch( `/api/group`)

  return (
    <>
      <Head>
        <title>Group - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSection={editGroup}
          setEditSection={setEditGroup}
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
          <Results setEditSection={setEditGroup} users={groups||[]} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementGroups.getLayout = (page) => (
  <Authenticated name="section">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementGroups;
