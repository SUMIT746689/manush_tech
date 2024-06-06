import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Teachers/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/TeacherFees/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';

function Managementschools() {
  const [editSchool, setEditSchool] = useState<Project>(null);

  const { data: teachers, setData: setTeachers, reFetchData, error } = useClientFetch('/api/teacher');
  const { data: departments, error: departmentError } = useClientFetch('/api/departments');

  return (
    <>
      <Head>
        <title>Teachers - Fees</title>
      </Head>
      <PageTitleWrapper>
        {/* <PageHeader
          editSchool={editSchool}
          setEditSchool={setEditSchool}
          departments={
            departments?.success
              ? departments.data?.map((i) => ({
                  label: i.title,
                  value: i.id
                }))
              : []
          }
          reFetchData={reFetchData}
        /> */}
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Results
            schools={teachers || []}
            setTeachers={setTeachers}
            editSchool={editSchool}
            setEditSchool={setEditSchool}
            reFetchData={reFetchData}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="teacher">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
