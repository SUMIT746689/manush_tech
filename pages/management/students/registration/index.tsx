import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Grid, Typography } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'next-i18next';
import StudentForm from '@/components/Student/StudentForm';

function ManagementClasses() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Registration - Student</title>
      </Head>

      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Registration - Student')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the app students registration can be managed from this page'
              )}
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <StudentForm />

      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="student">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
