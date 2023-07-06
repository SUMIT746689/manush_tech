import Head from 'next/head';

import { useState, useEffect, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Exam/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import Results from 'src/content/Management/Exam/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { AuthConsumer } from 'src/contexts/JWTAuthContext';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

function Managementschools() {
  // const isMountedRef = useRefMounted();
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);
  const [singleExam, setSingleExam] = useState(null);

  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [classes, setClasses] = useState([]);

  const getExam = () => {
    axios
      .get(
        `/api/exam?school_id=${user?.school_id}&academic_year=${academicYear?.id}`
      )
      .then((res) => setExams(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (academicYear?.id) {
      getExam();
    }
  }, [academicYear]);

  useEffect(() => {
    axios.get(`/api/class?school_id=${user?.school_id}`)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));
  }, [])


  return (
    <>
      <Head>
        <title>Exam - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          classes={classes}
          editExam={editExam}
          setEditExam={setEditExam}
          getExam={getExam}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item xs={12}>
          <Results
            exams={exams}
            setEditExam={setEditExam}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="exam">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
