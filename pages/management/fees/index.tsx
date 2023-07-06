import Head from 'next/head';

import { useState, useEffect, useCallback, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Fees/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { schoolsApi } from 'src/mocks/schools';
import Results from 'src/content/Management/Fees/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { DataSaverOnRounded } from '@mui/icons-material';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
function ManagementFees() {
  // const isMountedRef = useRefMounted();
  const [datas, setDatas] = useState<Project[]>([]);
  const [editData, setEditData] = useState<Project>(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { data, error, reFetchData } = useClientFetch(`/api/fee?academic_year_id=${academicYear?.id}`);
  const { data: academicYearsData, error: sessionError } = useClientFetch(
    '/api/academic_years'
  );

  
  const { data: classData, error: classError } = useClientFetch('/api/class');

  useEffect(() => {
    if (data?.success) setDatas(data.data);
  }, [data, error]);

  return (
    <>
      <Head>
        <title>Fees - Management</title>
      </Head>
      <PageTitleWrapper>
        {/* @ts-ignore */}
        <PageHeader
          name="Fees"
          academicYearsData={
            academicYearsData?.success
              ? academicYearsData?.data?.map((i) => ({
                  label: i.title,
                  value: i.id
                }))
              : []
          }
          classData={
            classData?.map((i) => ({
              label: i.name,
              value: i.id
            })) || []
          }
          editData={editData}
          seteditData={setEditData}
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
          <Results sessions={datas} setEditData={setEditData} />
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
