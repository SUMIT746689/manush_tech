import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Results from '@/content/Management/PendingSmsRequest/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Project } from '@/models/project';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';

const Packages = () => {
 
  const [editData, setEditData] = useState<Project>(null);

  const { data, reFetchData, error } = useClientFetch('/api/buy_sms_requests');
  console.log({data})
  return (
    <>
      {/* <div>
        <Link href={'/packages/create'}>Create</Link>
      </div> */}

      <Head>
        <title>Pending Packages - Management</title>
      </Head>
      <Grid display="flex" justifyContent="space-between" flexDirection="column"
      sx={{height:"calc( 100vh - 80px)"}}
      >
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
              sessions={data || []}
              reFetchData={reFetchData}
              setEditData={setEditData}
            />
          </Grid>
        </Grid>
        <Footer />
      </Grid>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name="package_request">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
