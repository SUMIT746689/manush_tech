import { useContext, useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Discount/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Discount/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

function ManagementClasses() {
  const [editSection, setEditSection] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

  const { data: discount, reFetchData } = useClientFetch(`/api/discount?academic_year_id=${academicYear?.id}`);

  console.log("discount__", discount);

  return (
    <>
      <Head>
        <title>Discount - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSection={editSection}
          setEditSection={setEditSection}
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
          <Results setEditSection={setEditSection} users={discount || []} />
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
