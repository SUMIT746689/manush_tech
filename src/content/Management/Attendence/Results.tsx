import PropTypes from 'prop-types';
import {
  Autocomplete, Box, Card, Checkbox, Grid, Divider, Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, TextField, Typography, Button, useTheme, CircularProgress, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, Fragment, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs, { Dayjs } from 'dayjs';
import { TableVirtuoso } from 'react-virtuoso';
import useNotistick from '@/hooks/useNotistick';
import { ClassAndSectionSelect } from '@/components/Attendence';

import { MobileDatePicker } from '@mui/lab';



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

function rowContent(_index, row, setSectionAttendence) {
  //  console.log("row__", row);

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
  const [attendenceValue, setAttendenceValue] = useState(attendence);
  const [remarkValue, setRemarkValue] = useState(remark);

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
          <FormControlLabel value="bunk" control={<Radio />} label="Bunk" />
          <FormControlLabel value="holiday" control={<Radio />} label="Holiday" />
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
              console.log("onblue", attendenceValue, remarkValue);
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


const allAttandenceOptions = [
  { label: 'Not Taken', id: 'notTaken' },
  { label: 'All Present', id: 'present' },
  { label: 'All Absent', id: 'absent' },
  { label: 'All Late', id: 'late' },
  { label: 'All Bunk', id: 'bunk' },
  { label: 'All Holiday', id: 'holiday' }
]
const Results = () => {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [targetsectionStudents, setTargetsectionStudents] = useState([]);
  const [students, setStudents] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionAttendence, setSectionAttendence] = useState([])

  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth()
  const [selectedForAll, setSelectedForAll] = useState(null)


  useEffect(() => {
    axios.get(`/api/class?school_id=${user?.school_id}`)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
  }, [])

  // useEffect(() => {
  //   console.log("sectionAttendence__", sectionAttendence);

  // }, [sectionAttendence])


  useEffect(() => {
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
    }
  }, [user, selectedSection, academicYear])


  const handleAttendenceFind = () => {
    if (selectedSection && selectedDate && academicYear) {
      setStudents(null)
      const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';

      axios.get(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}`)
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
    const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';

    if (selectedForAll) {
      axios.post(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&status=${selectedForAll.id}`)
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
      axios.post(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}`, {
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
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }} >
          <Grid item >
            <Box p={1}>
              <MobileDatePicker
                label="Select Date"
                inputFormat='dd/MM/yyyy'

                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Box>
          </Grid>
          <Grid item  >
            <Box p={1}>
              <ClassAndSectionSelect
                flag={false}
                classes={classes}
                selectedDate={selectedDate}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
            </Box>
          </Grid>
          {
            selectedSection && <Grid item xs={6} sm={4} md={1} >
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
            students && students.length > 0 && <Grid sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              pr:'10px'
            }}>
              <Autocomplete
                fullWidth
                size='medium'
                sx={{
                  maxWidth: '250px',
                  paddingTop: 2

                }}
                limitTags={2}
                // getOptionLabel={(option) => option.id}
                options={allAttandenceOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Select For Everyone')}
                    placeholder={t('Everyone...')}
                  />
                )}
                value={selectedForAll}
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
    </>
  );
};

Results.propTypes = {
  schools: PropTypes.array.isRequired
};

Results.defaultProps = {
  schools: []
};

export default Results;
