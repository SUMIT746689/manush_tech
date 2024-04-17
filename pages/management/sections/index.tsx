import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Sections/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Sections/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editSection, setEditSection] = useState(null);
  const { data: sections, reFetchData } = useClientFetch(`/api/section`);
  const { data: classes } = useClientFetch(`/api/class`);

  return (
    <>
      <Head>
        <title>Section - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSection={editSection}
          setEditSection={setEditSection}
          reFetchData={reFetchData}
          classList={
            classes?.map((i) => {
              return {
                label: i.name,
                value: i.id
              };
            }) || []
          }
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
          <Results setEditSection={setEditSection} users={sections || []} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="section">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
