import Head from 'next/head';

import { useState, useEffect, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/StudentClassSubjects/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/StudentClassSubjects/Results';
import { useClientDataFetch, useClientFetch } from 'src/hooks/useClientFetch';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

function ManagementFees() {
  // const isMountedRef = useRefMounted();
  const [editData, setEditData] = useState<Project>(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { data, error, reFetchData } = useClientDataFetch(`/api/student_class_subjects`);
  // const {} = useClientFetch(`/api/`)
  const { data: classData, error: classError } = useClientFetch('/api/class');
  console.log({data})
  return (
    <>
      <Head>
        <title>Student Class Subjects - Management</title>
      </Head>
      <PageTitleWrapper>
        {/* @ts-ignore */}
        <PageHeader
          name="Fees"
          classData={
            classData?.map((i) => ({
              label: i.name,
              value: i.id
            })) || []
          }
          feesHeads={[]}
          editData={editData}
          seteditData={setEditData}
          reFetchData={reFetchData}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 2 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      // spacing={3}
      >
        <Grid item xs={12}>
          <Results sessions={data} setEditData={setEditData} reFetchData={reFetchData} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementFees.getLayout = (page) => (
  <Authenticated name="fee">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementFees;
