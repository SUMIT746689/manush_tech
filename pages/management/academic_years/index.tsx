import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/AcademicYears/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { schoolsApi } from 'src/mocks/schools';
import Results from 'src/content/Management/AcademicYears/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { DataSaverOnRounded } from '@mui/icons-material';
function Managementschools() {
  // const isMountedRef = useRefMounted();
  const [datas, setDatas] = useState<Project[]>([]);
  const [editData, setEditData] = useState<Project>(null);

  const { data,reFetchData, error } = useClientFetch('/api/academic_years');

  useEffect(() => {
    if (data?.success)
      setDatas(data.data);
  }, [data, error]);

 
  return (
    <>
      <Head>
        <title>Academic Years - Management</title>
      </Head>
      <PageTitleWrapper>
        {/* @ts-ignore */}
        <PageHeader
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
          <Results
            sessions={datas}
            setEditData={setEditData}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="academic_years">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
