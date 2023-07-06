import Head from 'next/head';
import { useState, useEffect, useContext, forwardRef, Fragment } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Autocomplete, Box, Button, Card, Divider, TableBody, Grid, Paper, TextField, TableContainer, TableHead, Typography, TableRow, TableCell, Table, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'next-i18next';
import useNotistick from '@/hooks/useNotistick';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import { ClassAndSectionSelect, VirtuosoTable } from '@/components/Attendence';
import { TableVirtuoso } from 'react-virtuoso';

const allAttandenceOptions = [
  { label: 'Not Taken', id: 'notTaken' },
  { label: 'All Present', id: 'present' },
  { label: 'All Absent', id: 'absent' },
  { label: 'All Late', id: 'late' }
]
const columns = [
  {
    width: 30,
    label: 'name',
    dataKey: 'name',
  },
  {
    width: 20,
    label: 'class roll no',
    dataKey: 'class_roll_no',

  },

  {
    width: 60,
    label: 'attendence',
    dataKey: 'attendence',

  },
  {
    width: 60,
    label: 'Guardian Phone',
    dataKey: 'guardian_phone',

  },
];
function fixedHeaderContent() {
  return (
    <TableRow >
      {columns.map((column) => (
        <TableCell

          key={column.dataKey}
          variant="head"
          align={'center'}
          // style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}<br />

        </TableCell>
      ))}
    </TableRow>
  );
}
const VirtuosoTableComponents = {
  Scroller: forwardRef((props, ref) => (
    // @ts-ignore
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  // @ts-ignore
  TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function rowContent(_index, row, setSectionAttendence) {
  return (

    <Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={'center'}

        >
          {column.dataKey == 'attendence' ?
            <>
              <AttendenceSwitch
                attendence={row['attendence']}
                student_id={row.id}
                remark={row['remark']}
                setSectionAttendence={setSectionAttendence}
              />
            </>
            : row[column.dataKey]
          }


        </TableCell>
      ))}
    </Fragment>
  );
}
const AttendenceSwitch = ({ attendence, remark, student_id, setSectionAttendence }) => {
  const { user } = useAuth();
  const [attendenceValue, setAttendenceValue] = useState(attendence);
  const [remarkValue, setRemarkValue] = useState(remark);
  const { showNotification } = useNotistick()
  useEffect(() => {
    setAttendenceValue(attendence)
  }, [attendence])

  useEffect(() => {
    if (!remark) {
      setRemarkValue('')
    } else {
      setRemarkValue(remark)
    }

  }, [remark])

  const handleUpdate = (e) => {
    if (e) {
      setAttendenceValue(e.target.value)
      handleUpdateApi(e.target.value)
    }

  }

  const handleUpdateApi = (e) => {

    console.log("remarkValue__", remarkValue);

    setSectionAttendence(prev => {

      const temp = {
        student_id,
        status: e,
      }
      if (remarkValue) {
        temp['remark'] = remarkValue
      }
      const isExistIndex = prev.findIndex(i => i?.student_id == student_id)
      console.log("isExistIndex__", isExistIndex);

      if (isExistIndex < 0) {
        return [...prev, temp]
      }
      else {
        prev[isExistIndex] = temp
        console.log("prev__", prev);

        return [...prev]

      }

    })
    // axios.patch(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&student_id=${student_id}&status=${e}${remarkValue ? `&remark=${remarkValue}` : ''}`)
    //   .then(() => {
    //     setAttendenceValue(e)
    //   })
    //   .catch(err => console.log(err))
  }


  return (
    <>
      {/* <Switch checked={value} onChange={handleUpdate} /> */}

      <FormControl sx={{
        marginRight: 1
      }}>
        <RadioGroup
          row
          name="attendance"
          value={attendenceValue}
          onChange={handleUpdate}
          sx={{
            display: 'flex',
            flexWrap: 'nowrap'
          }}
        >
          <FormControlLabel value="present" control={<Radio />} label="Present" />
          <FormControlLabel value="absent" control={<Radio />} label="Absent" />
          <FormControlLabel value="late" control={<Radio />} label="Late" />

          <TextField
            size='small'
            sx={{
              width: '100px',
              height: '20px',
              p: 0
            }}
            variant="outlined"
            value={remarkValue}
            onChange={(e) => {
              setRemarkValue(e.target.value)

            }}
            onBlur={(e) => {
              if (attendenceValue && remarkValue !== '') {
                //  console.log(attendenceValue, remarkValue);


                handleUpdateApi(attendenceValue)
                // setRemarkValue(null)
              }
            }}
            label="Remarks"
            type='text'
          />
        </RadioGroup>
      </FormControl>



    </>
  );
};
function Attendence() {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [targetsectionStudents, setTargetsectionStudents] = useState([]);
  const [students, setStudents] = useState(null);
  const [classes, setClasses] = useState([]);
  // const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [attendenceValue, setattendenceValue] = useState({ label: 'Not Taken', id: 'notTaken' })
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth()
  const [examlist, setExamlist] = useState(null)
  const [selectedForAll, setSelectedForAll] = useState(null)

  const [sectionAttendence, setSectionAttendence] = useState([])

  useEffect(() => {
    axios.get(`/api/class?school_id=${user?.school_id}`)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    console.log("students__", students);

  }, [students])


  useEffect(() => {
    setSelectedExam(null);

    if (user && selectedSection && academicYear) {
      setStudents(null)
      axios.get(`/api/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&academic_year_id=${academicYear?.id}`)
        .then(res => {
          setTargetsectionStudents(res.data)
        })
        .catch(err => {
          showNotification(err?.response?.data?.message, 'error')
          console.log(err)
        })
      axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${selectedSection?.id}`)
        .then(res => {
          setExamlist(res.data?.map(i => {
            return {
              label: i.title,
              id: i.id
            }
          }))
        }).catch(err => {
          showNotification(err?.response?.data?.message, 'error')
          console.log(err)
        })
    }
  }, [user, selectedSection, academicYear])


  const handleAttendenceFind = () => {
    if (selectedSection && academicYear) {
      setStudents(null)

      axios.get(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&exam_id=${selectedExam?.id}`)
        .then(response => {
          console.log("AttendenceHistory__", response.data);

          const temp = targetsectionStudents?.map(i => {
            let attendance;
            let remark;
            const check = response.data?.find(j => j?.student_id == i.id)

            if (check) {
              attendance = check.status;
              if (check.remark) {
                remark = check.remark
              }
            }
            return {
              id: i.id,
              name: `${i.student_info.first_name} ${i.student_info.middle_name ? i.student_info.middle_name : ''} ${i.student_info.last_name ? i.student_info.last_name : ''}`,
              class_roll_no: i.class_roll_no,
              guardian_phone: i.guardian_phone,
              attendence: attendance,
              remark: remark
            }
          })
          console.log("student attende__", temp);

          setStudents(temp);


        }).catch(err => {
          console.log(err)
          // showNotification(err.message, 'error')
          showNotification(err?.response?.data?.message, 'error')
        })
    }
  }
  const handleSubmit = () => {
    const date = dayjs(new Date('0')).format('YYYY-MM-DD');

    if (selectedForAll) {
      axios.post(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&status=${selectedForAll.id}&exam_id=${selectedExam?.id}`)
        .then(() => {
          // setStudents((init) => init.map(i => {
          //   const data = {...i}
          //   data['attendence']=e
          //   return data;
          // }))
          handleAttendenceFind()
          setSelectedForAll(null)

          setSectionAttendence([])
        })
        .catch(err => console.log(err))
    }
    else {
      axios.post(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&exam_id=${selectedExam?.id}`, {
        sectionAttendence
      })
        .then(() => {
          // setStudents((init) => init.map(i => {
          //   const data = {...i}
          //   data['attendence']=e
          //   return data;
          // }))
          handleAttendenceFind()
          setSelectedForAll(null)

          setSectionAttendence([])
        })
        .catch(err => console.log(err))
    }
  }
  return (
    <>
      <Head>
        <title>Students Exam Attendence</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title={'Students Exam Attendence'} />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Card
            sx={{
              p: 1,
              mb: 3
            }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }} >
              <Grid item  >
                <Box p={1}>
                  <ClassAndSectionSelect
                    flag={true}
                    classes={classes}
                    selectedDate={null}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                  />
                </Box>
              </Grid>
              {
                examlist && <Grid item xs={6} sm={4} md={3} >
                  <Box p={1}>
                    <Autocomplete
                      fullWidth
                      sx={{
                        mr: 10
                      }}
                      limitTags={2}
                      options={examlist}
                      value={selectedExam}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label={t('Exams')}
                          placeholder={t('Select Exam...')}
                        />
                      )}
                      onChange={(e, value) => setSelectedExam(value)}
                    />
                  </Box>
                </Grid>
              }

              {
                selectedSection && selectedExam && <Grid item xs={6} sm={4} md={1} >
                  <Box p={1}>
                    <Button variant="contained" size='medium'
                      onClick={() => handleAttendenceFind()}>Find</Button>
                  </Box>
                </Grid>
              }

            </Grid>
          </Card>

          <Divider />

          <Grid container spacing={0} sx={{ minHeight: 'calc(100vh - 450px) !important' }} justifyContent={'flex-end'} >
            <Paper style={{ height: 400, width: '100%' }}>

              {
                students && students.length > 0 &&
                <Grid sx={{
                  display: 'flex',
                  justifyContent: 'end',
                }}>
                  <Autocomplete
                    fullWidth
                    size='medium'
                    sx={{
                      maxWidth: '300px',
                      paddingTop: 2

                    }}
                    limitTags={2}
                    // getOptionLabel={(option) => option.id}
                    options={allAttandenceOptions}
                    value={selectedForAll}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={t('Select For Everyone')}
                        placeholder={t('Everyone...')}
                      />
                    )}
                    onChange={(e, value: any) => {
                      if (value) {
                        if (value.id !== 'notTaken') {
                          setSelectedForAll(value)
                        }
                        else {
                          setSelectedForAll(null)
                        }

                      }



                    }}
                  />
                </Grid>
              }


              {/* <VirtuosoTable
                examFlag={true}
                selectedExam={selectedExam}
                columns={columns}
                students={students}
                selectedSection={selectedSection}
                selectedDate={null}
                
              /> */}
              <TableVirtuoso
                data={students || []}
                // @ts-ignore
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={(_index, row) => rowContent(_index, row, setSectionAttendence)}
              />
            </Paper>
          </Grid>

          <Grid container justifyContent="flex-end">
            <Button onClick={handleSubmit} variant='contained' >
              submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Attendence.getLayout = (page) => (
  <Authenticated name="attendence">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Attendence;
