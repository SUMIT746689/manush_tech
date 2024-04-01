// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Grid, Typography } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'next-i18next';
// import { useRouter } from 'next/router';
import StudentForm from '@/components/Student/StudentForm';

function ManagementClasses() {
  // const isMountedRef = useRefMounted();
  // const [classes, setClasses] = useState([]);
  // const [classesFlag, setClassesFlag] = useState(false);
  const { t }: { t: any } = useTranslation();

  // const [activeStep, setActiveStep] = useState(0);
  // const [totalFormData, setTotalFormData] = useState({});

  // const router = useRouter();
  // const getClasses = useCallback(async () => {
  //   try {
  //     axios.get(`/api/student`).then((res) => {
  //       if (isMountedRef()) {
  //         // console.log('ref__', res.data);

  //         setClasses(res.data);
  //       }
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getClasses();
  // }, [getClasses]);

  // console.log({ totalFormData });

  // const handleCreateClassClose = () => {
  //   router.push('/management/students');
  // };

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
