import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/AddtionalMarkingCategory/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/AddtionalMarkingCategory/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editSubject, setEditSubject] = useState(null);

  const { data: addlMarkingCats, reFetchData: reFetchSubjects } = useClientFetch(`/api/addtional_marking_categories`);
  console.log({addlMarkingCats})
 
  return (
    <>
      <Head>
        <title>Addtional Marking Categories - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSubject={editSubject}
          setEditSubject={setEditSubject}
          classList={
            addlMarkingCats?.map((i) => {
              return {
                label: i.title,
                value: i.id
              };
            }) || []
          }
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
            users={addlMarkingCats || []}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="subject">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
