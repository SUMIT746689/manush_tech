import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Period/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { DialogTitle, Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
function PeriodManagement() {
  const { t }: { t: any } = useTranslation();
  return (
    <>
      <Head>
        <title>Period - Management</title>
      </Head>
      {/* <PageTitleWrapper >
        <DialogTitle
          sx={{
            px: 3,
            py: 0
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add new period')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new period')}
          </Typography>
        </DialogTitle>
      </PageTitleWrapper> */}

      <Grid sx={{ minHeight: 'calc(100vh - 233px)' }}>
        <PageHeader />
      </Grid>


      <Footer />
    </>
  );
}

PeriodManagement.getLayout = (page) => (
  <Authenticated name="period">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default PeriodManagement;
