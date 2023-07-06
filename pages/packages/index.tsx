import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Results from '@/content/Management/Packages/Results';
import PageHeader from '@/content/Management/Packages/PageHeader';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Project } from '@/models/project';
import { Grid } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const Packages = () => {
  const [datas, setDatas] = useState<Project[]>([]);
  const [editData, setEditData] = useState<Project>(null);

  const { data, reFetchData, error } = useClientFetch('/api/packages');
  
  return (
    <>
      {/* <div>
        <Link href={'/packages/create'}>Create</Link>
      </div> */}

      <Head>
        <title>Packages - Management</title>
      </Head>
      <PageTitleWrapper>
        {/* @ts-ignore */}
        <PageHeader
          name="Packages"
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
          <Results sessions={data?.success ? data.data: [] } setEditData={setEditData} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name="package">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
