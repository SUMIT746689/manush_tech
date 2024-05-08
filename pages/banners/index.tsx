import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import RightBanner from '@/content/Management/Banners/RightBanner';
import LeftBanner from '@/content/Management/Banners/LeftBanner';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';

const Packages = () => {
  const { data, reFetchData, error } = useClientFetch('/api/banners');
  console.log({ data });
  const { banners } = data || {};
  const { left_banners, right_banners } = banners || {};
  return (
    <>
      <Head>
        <title>Banners - Management</title>
      </Head>

      <PageTitleWrapper>
        <PageHeaderTitleWrapper
          name={'Banners'}
          handleCreateClassOpen={false}
          actionButton={' '}
        />
      </PageTitleWrapper>

      <Grid
        display="grid"
        gridTemplateColumns="1fr 1fr"
        columnGap={1}
        mx={1}
        minHeight={'calc(100vh - 330px)'}
      >
        <LeftBanner refetchBanner={reFetchData} banners={left_banners || []} />
        <RightBanner
          refetchBanner={reFetchData}
          banners={right_banners || []}
        />
      </Grid>

      <Footer />
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name="banner">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
