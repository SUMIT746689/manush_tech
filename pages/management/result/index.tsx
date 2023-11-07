import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Result/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Card, Grid } from '@mui/material';
import Results from 'src/content/Management/Result/Results';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

function Managementschools() {
  const [editExam, setEditExam] = useState(null);

  const [result, setResult] = useState(null);

  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [classes, setClasses] = useState([]);

  const [studentList, setStudentList] = useState(null);
  const [examSubjectList, setExamSubjectList] = useState(null);
  const [sections, setSections] = useState(null);
  const [exams, setExams] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectClasses, setSelectClasses] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExamSubject, setSelectedExamSubject] = useState(null);
  const [academicYearList, setAcademicYearList] = useState([])
  useEffect(() => {
    axios
      .get(`/api/academic_years`)
      .then((res) => {
        setAcademicYearList(res.data?.data?.map((i) => {
          return { label: i.title, id: i.id };
        }))
      })
  }, [])

  useEffect(() => {
    axios
      .get(`/api/class`)
      .then((res) => setClasses(res?.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedSection && academicYear) {
      axios
        .get(
          `/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection.id}`
        )
        .then((res) =>
          setStudentList(
            res.data?.map((i) => {
              return {
                label: `${i.class_registration_no} (${i?.student_info?.first_name})`,
                id: i.id
              };
            })
          )
        )
        .catch((err) => console.log(err));

      axios
        .get(
          `/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${selectedSection.id}`
        )
        .then((res) =>
          setExams(
            res.data?.map((i) => {
              return {
                label: i.title,
                id: i.id
              };
            })
          )
        )
        .catch((err) => console.log(err));
    }
  }, [selectedSection, academicYear]);

  const handleSearchResult = () => {
    axios
      .get(
        `/api/result/?section_id=${selectedSection.id}&exam_id=${selectedExam.id}`
      )
      .then((res) => setResult(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (selectClasses && selectClasses.has_section) {
      setSelectedSection(null);
    }
    setSelectedExam(null);
    setSelectedExamSubject(null);
  }, [selectClasses]);

  useEffect(() => {
    setSelectedExamSubject(null);
  }, [selectedExam]);

  useEffect(() => {
    setSelectedStudent(null);
    setSelectedExam(null);
  }, [selectedSection]);
  console.log({result})
  return (
    <>
      <Head>
        <title>Result - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          classes={classes}
          selectClasses={selectClasses}
          setSelectClasses={setSelectClasses}
          editExam={editExam}
          setEditExam={setEditExam}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setStudentList={setStudentList}
          setExams={setExams}
          setSections={setSections}
          sections={sections}
          studentList={studentList}
          exams={exams}
          examSubjectList={examSubjectList}
          setExamSubjectList={setExamSubjectList}
          setSelectedExam={setSelectedExam}
          selectedExam={selectedExam}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          selectedExamSubject={selectedExamSubject}
          setSelectedExamSubject={setSelectedExamSubject}
        />
      </PageTitleWrapper>

      <Grid sx={{ minHeight: "calc(100vh - 330px )" }}>
        <Results
          result={result ? result?.sections_result : []}
          classes={classes}
          selectClasses={selectClasses}
          setSelectClasses={setSelectClasses}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setSections={setSections}
          sections={sections}
          exams={exams}
          setSelectedExam={setSelectedExam}
          selectedExam={selectedExam}
          handleSearchResult={handleSearchResult}
          academicYear={academicYear}
          academicYearList={academicYearList}
          pdf={false}
        />
      </Grid>
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="result">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
