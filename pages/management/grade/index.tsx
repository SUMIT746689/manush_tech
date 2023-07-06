import Head from 'next/head';
import { useState, useEffect } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from '@/content/Management/Grade/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from '@/content/Management/Grade/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
function Managementrooms() {
  const [rooms, setRooms] = useState([]);
  const [editRooms, setEditRooms] = useState(null);
  const { data,reFetchData, error } = useClientFetch('/api/grad');

  useEffect(() => {
    if (data) setRooms(data);
  }, [data, error]);

  return (
    <>
      <Head>
        <title>Gradeing system - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editRooms={editRooms}
          setEditRooms={setEditRooms}
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
            rooms={rooms}
            editRooms={editRooms}
            setEditRooms={setEditRooms}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementrooms.getLayout = (page) => (
  <Authenticated name='room'>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementrooms;
