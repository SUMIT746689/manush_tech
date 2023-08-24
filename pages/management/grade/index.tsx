import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from '@/content/Management/Grade/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import Results from '@/content/Management/Grade/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
function Managementrooms() {
  const [grade, setGrade] = useState([]);
  const [editGrade, setEditGrade] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { data, reFetchData, error } = useClientFetch(`/api/grade?academic_year_id=${academicYear?.id}`);
  const auth = useAuth();

  useEffect(() => {
    if (data) setGrade(data);
  }, [data, error]);

  const create_grade = auth?.user?.permissions?.find((i:any) => i?.value == 'create_grade')
  return (
    <>
      <Head>
        <title>Gradeing system - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          contentPermission={{
            create_grade
          }}
          editGrade={editGrade}
          setEditGrade={setEditGrade}
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
            grade={grade}
            editGrade={editGrade}
            setEditGrade={setEditGrade}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementrooms.getLayout = (page) => (
  <Authenticated name='grade'>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementrooms;
