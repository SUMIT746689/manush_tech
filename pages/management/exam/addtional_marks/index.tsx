import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/ExamAddtionalMark/PageHeader';
import Footer from 'src/components/Footer';
import { Card, Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/ExamAddtionalMark/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
// import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
// import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
// import axios from 'axios';

function ManagementClasses() {
  const [editSubject, setEditSubject] = useState(null);

  const { data: subjects } = useClientFetch(`/api/exam/addtional_marks`);
  const { data: addlmarkingCats } = useClientFetch(`/api/addtional_marking_categories`);
  const { data: exams,reFetchData } = useClientFetch(`/api/exam?with_addtional_mark=true`);
  // const [selectedExam, setSelectedExam] = useState(null);
  // const [selectedExamAddlMarks, setSelectedExamAddlMarks] = useState();
  // const [isLoading, setIsLoading] = useState(false);
 
  // const handleSearchAddlMarks = async () => {
  //   setIsLoading(true);
  //   console.log("hi.....")
  //   const { value } = selectedExam;
  //   const {data} = await axios.get(`/api/exam/addtional_marks?exam_id=${value}`);
  //   console.log({data})
  //   setTimeout(() => { setIsLoading(false) }, 2000)
  // }
  return (
    <>
      <Head>
        <title>Exam Addtional Marks - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          editSubject={editSubject}
          setEditSubject={setEditSubject}
          classList={
            []
          }
          exams={
            exams?.map((i) => {
              return {
                label: i.title,
                value: i.id
              };
            }) || []
          }
          addlmarkingCats={addlmarkingCats?.map((i) => {
            return {
              label: i.title,
              value: i.id
            };
          }) || []
          }

          reFetchSubjects={reFetchData}
        />
      </PageTitleWrapper>

      {/* <Card sx={{ mb: 1, pt: 1, px: 1, maxWidth: 600, mx: 'auto', display: "grid", gridTemplateColumns: "1fr 100px", columnGap: 1 }} >
        <AutoCompleteWrapper
          minWidth="100%"
          value={selectedExam}
          options={
            exams?.map((i) => {
              return { label: i.title, value: i.id };
            }) || []}
          label="Select Exam"
          placeholder={"select a exam..."}
          handleChange={(event, value) => setSelectedExam(value)}
        />
        <SearchingButtonWrapper disabled={!selectedExam || isLoading} handleClick={handleSearchAddlMarks} isLoading={isLoading}>
          Search
        </SearchingButtonWrapper>
      </Card > */}


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
            setEditSubject={setEditSubject}
            classList={
              []
            }
            users={exams || []}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="subject">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
