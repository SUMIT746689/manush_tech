import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Autocomplete, Box, Button, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';

import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import prisma from '@/lib/prisma_client';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';

export async function getServerSideProps(context: any) {
  let student: any = null;
  let data: any = null;
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)
    if (!refresh_token_varify) return { props: { student } };

    if (refresh_token_varify.role.title === 'STUDENT') {
      student = await prisma.student.findFirst({
        where: {
          student_info: {
            user_id: Number(refresh_token_varify.id),
            school_id: refresh_token_varify.school_id
          }
        },
        select: {
          id: true,
          student_photo: true,
          section_id: true,
          class_registration_no: true,
          student_present_address: true,
          discount: true,
          student_info: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
              school: {
                select: {
                  name: true
                }
              }
            }
          },
          academic_year: true,
          section: {
            select: {
              id: true,
              name: true,
              class: {
                select: {
                  id: true,
                  name: true,
                  has_section: true,
                  fees: true,
                }
              }
            }

          },
          guardian_phone: true,
          class_roll_no: true
        }
      });

      data = {
        ...student.student_info,
        section_id: student.section.id,
        name: [student.student_info.first_name, student.student_info.middle_name, student.student_info.last_name].join(' '),
        class: student.section.class.name,
        section: student.section.class.has_section ? student.section.name : '',
        class_registration_no: student.class_registration_no,
        class_roll_no: student.class_roll_no,
        student_id: student.id
      };
    }
  }
  catch (error) {
    console.log({ error })
  }
  const parse = JSON.parse(JSON.stringify({ student, data }));
  return { props: parse }
}

function Managementschools({ data }) {

  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [result, setResult] = useState(null);
  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext)


  const [classes, setClasses] = useState([]);
  const [studentList, setStudentList] = useState(null);
  const [sections, setSections] = useState(null);
  const [exams, setExams] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null)

  const [finalResult, setFinalResult] = useState(null);

  const [selectedExamPercentageOptions, setSelectedExamPercentageOptions] = useState([]);



  const handleInputChange = (event, index) => {
    const newOptions = [...selectedExamPercentageOptions];
    newOptions[index].percentage = event.target.value;
    console.log("newOptions__", newOptions);

    setSelectedExamPercentageOptions(newOptions);
  };

  useEffect(() => {
    axios.get(`/api/class`)
      .then(res => setClasses(res?.data))
      .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    axios.get(`/api/exam/exam-list?school_id=${user?.school_id}&academic_year=${academicYear?.id}&section_id=${data?.section_id}`)
      .then(res => setExams(res.data?.map(i => {
        return {
          label: i.title,
          id: i.id
        }
      })))
      .catch(err => console.log(err))
  }, [data, academicYear])
  console.log({ exams, academicYear })

  const handleSearchResult = () => {
    if (selectedStudent) {
      axios.get(`/api/result/${selectedStudent.id}?exam_id=${selectedExam.id}`)
        .then(res => {
          setResult(res.data)
          setFinalResult(null)
          console.log(res.data);

        })
        .catch(err => console.log(err))
    }
  }

  const handleClassSelect = (event, newValue) => {

    console.log(newValue);
    setSelectedClass(newValue)
    if (newValue) {
      const targetClassSections = classes.find(i => i.id == newValue.id)
      setSections(targetClassSections?.sections?.map(i => {
        return {
          label: i.name,
          id: i.id
        }
      }))
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        })
      } else {
        setSelectedSection(null)
      }
    }
  }

  const handleFinalResultGenerate = () => {


    console.log("selectedExamPercentageOptions___", selectedExamPercentageOptions, "   ", selectedStudent);

    axios.get(`/api/result/${data?.student_id}/final-result?section_id=${data?.section_id}`)
      .then(res => {
        setResult(null)
        setFinalResult(res.data)


      }).catch((err) => {
        console.log(err);
      })
  }

  return (

    <>
      <Head>
        <title> Result - Management</title>
      </Head>
      <PageTitleWrapper >
        <Grid item>

          <Typography variant="h3" component="h3" gutterBottom>
            {t('Student Result')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your Results')}
          </Typography>
        </Grid>

      </PageTitleWrapper>

      <Card sx={{ pt: 1, px: 1, mb: 1, maxWidth: 1200,mx:'auto' }}>

        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: "1fr 1fr 1fr", md: "1fr 1fr 1fr 1fr 1fr" }}
          rowGap={1}
          columnGap={2}
          item
        >
          <UncontrolledTextFieldWrapper label="Name" value={data?.name || ''} />
          <UncontrolledTextFieldWrapper label="Class" value={data?.class || ''} />
          <UncontrolledTextFieldWrapper label="Section" value={data?.section || ''} />
          <AutoCompleteWrapper
            options={exams}
            value={selectedExam}
            label="select exam"
            placeholder="Name"
            handleChange={(e, v) => {
              setSelectedExam(v)
              if (!v) {
                setResult(null)
              }

            }}
          />

          <Grid>
            {
              selectedExam ?
                <ButtonWrapper handleClick={handleSearchResult}>Find single exam result</ButtonWrapper>
                :
                <ButtonWrapper handleClick={handleFinalResultGenerate} >Generate Final result</ButtonWrapper>
            }
          </Grid>
        </Grid>

      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 465px) !important' }}>
        <Grid
          sx={{ px: 4 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>

            {
              result &&
              <>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <h1>Exam Title: {result?.exam?.title}</h1>

                  <h2 >Student name : {result?.student?.student_info?.first_name} {result?.student?.student_info?.middle_name} {result?.student?.student_info?.last_name}</h2>
                  <h2>Class : {result?.student?.section?.class?.name}</h2>
                  <h2>Section : {result?.student?.section?.name}</h2>
                  <h2>Class roll : {result?.student?.class_roll_no}</h2>
                </Grid>


                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Subject Name')}</TableCell>
                      <TableCell>{t('Subject obtain marks')}</TableCell>
                      <TableCell>{t('Subject total marks')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result?.result_details?.map(i =>
                      <TableRow>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {i?.exam_details?.subject?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {i?.mark_obtained}
                          </Typography>
                        </TableCell>
                        <TableCell><Typography noWrap variant="h5">
                          {i?.exam_details?.subject_total?.toFixed(2)}
                        </Typography></TableCell>
                      </TableRow>

                    )}
                  </TableBody>
                </Table>

              </>
            }
            {
              finalResult && <>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <h1>Final result</h1>

                  <h2>Student name : {finalResult?.student?.student_info?.first_name} {finalResult?.student?.student_info?.middle_name} {finalResult?.student?.student_info?.last_name}</h2>
                  <h2>Class : {finalResult?.student?.section?.class?.name}</h2>
                  <h2>Section : {finalResult?.student?.section?.name}</h2>
                  <h2>Class roll : {finalResult?.student?.class_roll_no}</h2>
                </Grid>

                <h2 className=' text-center font-bold'>Total mark: {finalResult?.termWiseTotalMark?.reduce(
                  (accumulator, currentValue) => accumulator + currentValue?.calculatedTotalMark, 0
                ).toFixed(2)}</h2>

                {
                  finalResult?.termWiseTotalMark?.map(i => <>
                    <Box sx={{ fontWeight: 'bold' }}>
                      Total mark counted from {i?.title} exam : {i?.calculatedTotalMark?.toFixed(2)}
                    </Box>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('Subject Name')}</TableCell>
                          <TableCell>{t('Counted mark')}</TableCell>
                          <TableCell>{t('Subject total')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {i?.result?.map(j =>
                          <TableRow>
                            <TableCell>
                              <Typography noWrap variant="h5">
                                {j?.subject_name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography noWrap variant="h5">
                                {j?.singleSubjectCalculetedMark}
                              </Typography>
                            </TableCell>
                            <TableCell><Typography noWrap variant="h5">
                              {j?.subject_total}
                            </Typography></TableCell>
                          </TableRow>

                        )}
                      </TableBody>
                    </Table>

                  </>)
                }
              </>
            }
          </Grid>
        </Grid>
      </Card>

      <Footer />
    </>

  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name='show_student_result'>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
