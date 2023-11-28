import Head from 'next/head';
import { useState, useEffect } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Departments/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import Results from 'src/content/Management/Departments/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
function ManagementDepartments() {
  // const isMountedRef = useRefMounted();
  const [datas, setDatas] = useState([]);
  const [editData, setEditData] = useState(null);

  const { data, reFetchData, error } = useClientFetch('/api/departments');

  useEffect(() => {
    if (data?.success) setDatas(data.data);
  }, [data, error]);

  return (
    <>
      <Head>
        <title>Department - Management</title>
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
          <Results datas={datas} setEditData={setEditData} reFetchData={reFetchData} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementDepartments.getLayout = (page) => (
  <Authenticated name="holiday">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementDepartments;
