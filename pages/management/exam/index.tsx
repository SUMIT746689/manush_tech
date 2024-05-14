import Head from 'next/head';

import { useState, useEffect, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Exam/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import Results from 'src/content/Management/Exam/Results';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useClientDataFetch } from '@/hooks/useClientFetch';

function Managementschools() {
  // const isMountedRef = useRefMounted();
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);

  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [classes, setClasses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { data: examTerms } = useClientDataFetch('/api/exam_terms');

  const getExam = () => {
    axios
      .get(
        `/api/exam?school_id=${user?.school_id}&academic_year=${academicYear?.id}`
      )
      .then((res) => {
        setExams(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (academicYear?.id) {
      getExam();
    }
  }, [academicYear]);

  useEffect(() => {
    axios
      .get(`/api/class?school_id=${user?.school_id}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));

    axios.get('/api/rooms').then((res) => {
      setRooms(
        res.data.rooms.map((i) => ({
          label: i.name,
          id: i.id
        }))
      );
    });
  }, []);

  return (
    <>
      <Head>
        <title>Exam - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          classes={classes}
          rooms={rooms}
          editExam={editExam}
          setEditExam={setEditExam}
          getExam={getExam}
          examTerms={
            examTerms?.map((examTerm) => {
              return { id: examTerm.id, label: examTerm.title };
            }) || []
          }
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: { xs: 1, sm: 3 } }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item xs={12}>
          <Results exams={exams} setEditExam={setEditExam} />
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
