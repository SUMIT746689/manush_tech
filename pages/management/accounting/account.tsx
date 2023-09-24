import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Account/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Account/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editClass, setEditClass] = useState(null);
  const { data: classes, reFetchData } = useClientFetch(`/api/account`);

  return (
    <>
      <Head>
        <title>Account - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          accounts={classes?.map(i => ({
            label: i.title,
            id: i.id
          })) || []}
          editClass={editClass}
          reFetchData={reFetchData}
          setEditClass={setEditClass}
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
          <Results users={classes || []} setEditClass={setEditClass} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="class">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
