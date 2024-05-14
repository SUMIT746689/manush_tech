import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/FeesHeads/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/FeesHeads/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editSubject, setEditSubject] = useState(null);

  const { data: subjects, reFetchData: reFetchSubjects } = useClientFetch(`/api/fees_heads`);

  return (
    <>
      <Head>
        <title>Fees Heads - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSubject={editSubject}
          setEditSubject={setEditSubject}
          classList={[]}
          reFetchSubjects={reFetchSubjects}
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
            setEditSubject={setEditSubject}
            classList={[]}
            users={subjects || []}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated requiredPermissions={["create_fees_heads", "show_fees_heads"]}>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
