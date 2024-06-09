import Head from 'next/head';
import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Grid, Typography } from '@mui/material';
import { AutoCompleteWrapperWithDebounce } from '@/components/AutoCompleteWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { useClientFetch } from 'src/hooks/useClientFetch';
import React, { ChangeEvent, useState, useContext, useEffect, useRef } from 'react';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import { getFile } from '@/utils/utilitY-functions';
import { useReactToPrint } from 'react-to-print';
import { Translate } from '@mui/icons-material';
import useNotistick from '@/hooks/useNotistick';

const AdmitCard = () => {
  const { showNotification } = useNotistick();
  const { data: classData, error: classError } = useClientFetch('/api/class');
  const [sections, setSections] = useState<Array<any>>([]);
  const [classes, setClasses] = useState<Array<any>>([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [exams, setExams] = useState<Array<any>>([]);
  const [initExamInfo, setInitExamInfo] = useState<Array<any>>([]);
  const [studentInfo, setStudentInfo] = useState<Array<any>>([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [displayStudent, setDisplayStudent] = useState<Array<any>>([]);
  const [showPrint, setShowPrint] = useState<Boolean>(false);
  const [schoolInformation, setSchoolInformation] = useState(null);

  const { user } = useAuth();
  const printPageRef = useRef();

  // fetch exam related data code start
  const getExam = () => {
    axios
      .get(`/api/exam?school_id=${user?.school_id}&academic_year=${academicYear?.id}`)
      .then((res) => {
        setInitExamInfo(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (academicYear?.id) {
      getExam();
    }
  }, [academicYear]);

  // fetch exam related data code start

  const studentList = (student) => {
    let studentInfo = '';

    if (student?.student_info?.first_name) {
      studentInfo += student?.student_info?.first_name;
    }
    if (student?.class_roll_no) {
      studentInfo += '|' + student?.class_roll_no;
    }
    if (student?.student_info?.student_id) {
      studentInfo += '|' + student?.student_info?.student_id;
    }

    return studentInfo;
  };
  // fetch student related data code start
  const getStudentInfo = (section, exam) => {
    axios
      .get(
        // `/api/student/with-exam-information?section_id=${section?.id}&academic_year_id=${academicYear?.id}&class_id=${selectedClass?.id}&exam_id=${exam?.id}`
        `/api/student/?section_id=${section?.id}&academic_year_id=${academicYear?.id}`
      )
      .then((res) => {
        const studentListArr = res?.data?.map((i) => {
          return {
            label: studentList(i),
            id: i.id,
            name: i?.student_info?.first_name
          };
        });

        setStudentInfo([
          {
            label: 'Select all',
            id: null,
            name: ''
          },
          ...studentListArr
        ]);
      })
      .catch((err) => console.log(err));
  };
  // fetch student related data code end

  const handleExamList = (event: ChangeEvent<HTMLInputElement>, newValue) => {
    if (newValue) {
      setSelectedExam(newValue);
      // call student api here
      getStudentInfo(selectedSection, newValue);
    } else {
      setStudentInfo([]);
      // setExams([]);
      setSelectedExam(null);
      setSelectedStudent(null);
    }
  };

  const handleClassSelect = (event: ChangeEvent<HTMLInputElement>, newValue) => {
    if (newValue) {
      const targetClassSections = classData.find((i) => i.id == newValue.id);
      setSelectedClass(newValue);
      setSections(
        targetClassSections?.sections?.map((i) => {
          return {
            label: i.name,
            id: i.id
          };
        })
      );
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        });
      } else {
        setSelectedSection(null);
      }
    } else {
      setSections([]);
      // setStudents([]);
      setSelectedSection(null);
      setExams([]);
      setSelectedExam(null);
      setStudentInfo([]);
      setSelectedStudent(null);
    }
  };

  const handleSectionSelect = (event: ChangeEvent<HTMLInputElement>, newValue) => {
    setSelectedSection(newValue);

    if (newValue) {
      const targetExams = initExamInfo.filter((i) => i.section_id == newValue.id);

      if (targetExams.length > 0) {
        setExams(
          targetExams?.map((i) => {
            return {
              label: i.title,
              id: i.id
            };
          })
        );
      } else {
        setStudentInfo([]);
        setExams([]);
        setSelectedExam(null);
        setSelectedStudent(null);
      }
    } else {
      setStudentInfo([]);
      setExams([]);
      setSelectedExam(null);
      setSelectedStudent(null);
    }
  };

  const handleStudentSelect = (event: ChangeEvent<HTMLInputElement>, newValue) => {
    // setSelectedStudent

    if (newValue) {
      // setSelectedStudent({
      //   label: newValue?.name,
      //   id: newValue?.id
      // });
      setSelectedStudent(newValue);
    } else {
      setSelectedStudent(null);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  const handlePrint = useReactToPrint({
    content: () => printPageRef.current
  });

  const handleClickStudentInfo = debounce(() => {
    if (!selectedClass) {
      showNotification('Please select a class before proceeding', 'error');
      return;
    }
    if (!selectedSection) {
      showNotification('Please select a section before proceeding', 'error');
      return;
    }
    if (!selectedExam) {
      showNotification('Please select an exam before proceeding.', 'error');
      return;
    }
    if (!selectedStudent) {
      showNotification('Please select an student before proceeding.', 'error');
      return;
    }

    // let groupStudentArr = [selectedStudent?.id];

    // if (!selectedStudent?.id) {
    //   groupStudentArr = studentInfo
    //     ?.map((item) => {
    //       return item.id;
    //     })
    //     ?.filter((item) => {
    //       return item !== null;
    //     });
    // }

    console.log('Hello studentinfor is here ');
    console.log(studentInfo);

    if (selectedStudent?.id && studentInfo.length > 0) {
      const singleUser = studentInfo?.find((item) => item?.id === selectedStudent?.id);

      if (singleUser) {
        setDisplayStudent([{ ...singleUser }]);
        setShowPrint(true);
      }
    } else if (!selectedStudent?.id && studentInfo.length > 0) {
      setDisplayStudent([...studentInfo]);
      setShowPrint(true);
    } else {
      setDisplayStudent([]);
      setShowPrint(false);
      showNotification('There are no students included in this exam.', 'error');
      return;
    }
  }, 1000);

  const userName = (student) => {
    let fullName = '';

    if (student?.student_info?.first_name) {
      fullName += student?.student_info?.first_name + ' ';
    }
    if (student?.student_info?.middle_name) {
      fullName += student?.student_info?.middle_name + ' ';
    }
    if (student?.student_info?.last_name) {
      fullName += student?.student_info?.last_name + ' ';
    }
    return fullName;
  };

  // school logo
  useEffect(() => {
    axios
      .get(`/api/front_end/`)
      .then((res) => {
        setSchoolInformation(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // const isEmptyObject = (obj) => {
  //   return Object.entries(obj).length === 0;
  // };

  const handleClickPrint = (event: ChangeEvent<HTMLInputElement>, newValue) => {
    if (showPrint && displayStudent?.length > 0) {
      handlePrint();
      // setShowPrint(false);
    }
  };

  return (
    <>
      <Head>
        <title>Student Admit_Card</title>
      </Head>

      {/* searching part code start */}
      <Grid px={4} mt={3} display="grid" gridTemplateColumns="1fr" rowGap={{ xs: 1, md: 0 }} mx={1} minHeight="fit-content">
        {/* split your code start */}
        <Grid
          sx={{
            borderRadius: 10,
            overflow: 'hidden',
            //border: (themes) => `1px dashed ${themes.colors.primary.dark}`,
            backgroundColor: '#fff'
          }}
        >
          {/* <Grid
            sx={{
              borderRadious: 0,
              background: (themes) => themes.colors.primary.dark,
              py: 1,
              px: 1,
              color: 'white',
              fontWeight: 700,
              textAlign: 'left'
            }}
          >
            Search
          </Grid> */}

          <Grid px={2} pt="9px">
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                columnGap: '20px',
                rowGap: '0',
                flexWrap: 'wrap'
              }}
            >
              {/* Class field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={
                    classData?.map((i) => {
                      return {
                        label: i.name,
                        id: i.id,
                        has_section: i.has_section
                      };
                    }) || []
                  }
                  value={undefined}
                  label="Select Class"
                  placeholder="select a class"
                  handleChange={handleClassSelect}
                />
              </Grid>

              {/* Section field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={sections}
                  value={selectedSection}
                  label="Select Section"
                  placeholder="select a section"
                  handleChange={handleSectionSelect}
                />
              </Grid>
              {/* Exam field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={
                    exams
                    // exams?.map((i) => {
                    //   return {
                    //     label: i?.title,
                    //     id: i?.section_id,
                    //     section: i?.section?.has_section
                    //   };
                    // }) || []
                  }
                  value={selectedExam}
                  label="Select Exam"
                  placeholder="select an exam"
                  handleChange={handleExamList}
                />
              </Grid>

              {/* Student list */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={studentInfo || []}
                  value={selectedStudent}
                  label="Select Student"
                  placeholder="select a student"
                  handleChange={handleStudentSelect}
                />
              </Grid>
              {/* Search button */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1,
                  position: 'relative',
                  display: 'flex',
                  gap: 1
                }}
              >
                <Grid
                  sx={{
                    flexGrow: 1
                  }}
                >
                  <SearchingButtonWrapper isLoading={false} handleClick={handleClickStudentInfo} disabled={false} children={'Search'} />
                </Grid>
                <Grid
                  sx={{
                    flexGrow: 1
                  }}
                >
                  <SearchingButtonWrapper
                    isLoading={false}
                    handleClick={handleClickPrint}
                    disabled={showPrint && displayStudent.length > 0 ? false : true}
                    children={'Print'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* split your code end */}
      </Grid>
      {/* searching part code end */}

      {/* Admit card design code part start */}

      <Grid
        mx={1}
        px={4}
        minHeight="fit-content"
        mt={1}
        sx={{
          backgroundColor: '#fff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '4vh',
          mt: '10px'
          // py: '4vh'
        }}
        ref={printPageRef}
      >
        {displayStudent?.map((item) => {
          return (
            <Grid sx={{ border: '7px solid #f50519', height: '44vh', my: '1vh' }}>
              <Grid
                sx={{
                  border: '7px solid #03fc13',
                  height: '100%',
                  my: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Grid sx={{ width: '100%' }}>
                  <Grid px={3} mt={3} width={'100%'} display="grid" height="120px" gridTemplateColumns="120px 1fr 120px">
                    {/* school logo */}
                    <Grid alignSelf="end" width="80px">
                      {schoolInformation?.header_image ? (
                        <Image
                          src={getFile(schoolInformation?.header_image)}
                          width={100}
                          height={100}
                          alt="school logo"
                          style={{ position: 'relative', bottom: 0 }}
                        />
                      ) : (
                        ''
                      )}
                    </Grid>

                    {/* info */}
                    <Grid width="100%">
                      <Typography variant="h3" textAlign={'center'}>
                        {user?.school?.name}
                      </Typography>

                      <Typography variant="body1" textAlign={'center'}>
                        {user?.school?.address}
                      </Typography>

                      <Grid
                        mt={1}
                        mx="auto"
                        sx={{
                          backgroundColor: '#0a696e',
                          color: '#fff',
                          padding: '5px 50px',
                          textTransform: 'uppercase',
                          borderRadius: '20px',
                          width: 'fit-content',
                          border: '1px solid #000'
                        }}
                      >
                        Admit Card
                      </Grid>
                    </Grid>

                    {/* student photo */}
                    <Grid alignSelf="end" width="80px">
                      {item?.student_photo ? (
                        <Image src={getFile(item?.student_photo)} width={100} height={100} alt="user photo" />
                      ) : (
                        <Image src={'/default_user_photo.jpg'} width={100} height={100} alt="user photo" />
                      )}
                    </Grid>
                  </Grid>

                  {/* Table */}
                  <Grid mt={3} mb={4} mx={1}>
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                      <Table sx={{ minWidth: 650, maxWidth: 'calc(100%-10px)' }} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              style={{
                                border: '1px solid black',
                                textTransform: 'capitalize'
                              }}
                            >
                              Name: {userName(item)}
                            </TableCell>
                            <TableCell
                              colSpan={2}
                              style={{
                                border: '1px solid black',
                                textTransform: 'capitalize'
                              }}
                            >
                              Exam/Assesment Name: {selectedExam?.label && item ? selectedExam?.label : ''}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell component="th" scope="row" align="left" style={{ border: '1px solid black' }}>
                              Student Id: {item?.student_info?.student_id ? item?.student_info?.student_id : ''}
                            </TableCell>

                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Class: {item?.section?.class?.name}
                            </TableCell>
                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Section: {item?.section?.name}
                            </TableCell>
                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Group: {item?.group?.title}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell component="th" scope="row" align="left" style={{ border: '1px solid black' }}>
                              Shift:{' '}
                            </TableCell>

                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Roll: {item?.class_roll_no ? item?.class_roll_no : ''}
                            </TableCell>
                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Year: {item?.academic_year?.title}
                            </TableCell>
                            <TableCell align="left" style={{ border: '1px solid black' }}>
                              Mobile: {item?.student_info?.phone}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid
                    mb={3}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 160px'
                    }}
                  >
                    <Grid>
                      <Typography variant="body1" textAlign="center">
                        ................................
                      </Typography>

                      <Typography variant="body1" textAlign="center">
                        Principle
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="body1" textAlign="center">
                        ................................
                      </Typography>

                      <Typography variant="body1" textAlign="center">
                        Class Teacher
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      {/* Admit Card desing code part end */}
    </>
  );
};

AdmitCard.getLayout = (page) => (
  <Authenticated requiredPermissions={['create_admit_card', 'show_admit_card']}>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default AdmitCard;
