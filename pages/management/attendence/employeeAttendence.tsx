import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import Results from 'src/content/Management/Attendence/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import {
  Autocomplete, Box, Card, Checkbox, Divider, Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, TextField, Typography, Button, useTheme, CircularProgress, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, Fragment, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

import dayjs, { Dayjs } from 'dayjs';
import { TableVirtuoso } from 'react-virtuoso';

import useNotistick from '@/hooks/useNotistick';
import { ClassAndSectionSelect } from '@/components/Attendence';
import PropTypes from 'prop-types';
import {  MobileDatePicker } from '@mui/lab';


const columns = [
  {
    width: 10,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 10,
    label: 'User Id',
    dataKey: 'user_id',

  },

  {
    width: 80,
    label: 'attendence',
    dataKey: 'attendence',

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

function rowContent(_index, row, selectedSection, selectedDate, students, setStudents, attendenceValue, setattendenceValue) {
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
                selectedSection={selectedSection}
                selectedDate={selectedDate}
                user_id={row.user_id}
                remark={row['remark']}
              />
            </>
            : row[column.dataKey]
          }


        </TableCell>
      ))}
    </Fragment>
  );
}

const AttendenceSwitch = ({ attendence, remark, selectedSection, selectedDate, user_id }) => {
  const { user } = useAuth();
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
      handleUpdateApi(e.target.value, null)
    }

  }

  const handleUpdateApi = (e, remarkValue) => {
    const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';
    console.log({ remark });

    axios.patch(`/api/attendance/employee?school_id=${user?.school_id}&user_id=${user_id}&date=${date}&status=${e}`, { remark: remarkValue })
      .then(() => {
        setAttendenceValue(e)
      })
      .catch(err => console.log(err))
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
          <FormControlLabel value="half_holiday" control={<Radio />} label="Half Holiday" />
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
              if (attendenceValue && remarkValue.trim().length > 0) {
                console.log(attendenceValue, remarkValue);

                handleUpdateApi(attendenceValue, remarkValue)
                setRemarkValue(null)
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
  { label: 'All Half holiday', id: 'half_holiday' },
  { label: 'All Holiday', id: 'holiday' }
]
function Attendence() {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [targetRoleEmployees, setTargetRoleEmployees] = useState([]);
  const [students, setStudents] = useState(null);
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [attendenceValue, setattendenceValue] = useState({ label: 'Not Taken', id: 'notTaken' })
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth()



  useEffect(() => {
    axios.get(`/api/role`)
      .then(res => setRoleList(res.data))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (user && selectedRole && academicYear) {
      setStudents(null)
      axios.get(`/api/role/${selectedRole?.label}?school_id=${user?.school_id}`)
        .then(res => {
          setTargetRoleEmployees(res.data)
        })
        .catch(err => {
          showNotification(err?.response?.data?.message, 'error')
          console.log(err)
        })
    }
  }, [user, selectedRole, academicYear])


  const handleAttendenceFind = () => {
    if (selectedRole && selectedDate && academicYear) {
      setStudents(null)
      const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';

      axios.get(`/api/attendance/employee?school_id=${user?.school_id}&role_id=${selectedRole?.id}&date=${date}`)
        .then(response => {
          console.log("AttendenceHistory__", response.data);

          const temp = targetRoleEmployees?.map(i => {
            let attendance;
            let remark;
            const check = response.data?.find(j => j?.user_id == i.user_id)

            if (check) {
              attendance = check.status;
              if (check.remark) {
                remark = check.remark
              }
            }
            return {
              id: i.id,
              name: `${i.first_name} ${i.middle_name ? i.middle_name : ''} ${i.last_name ? i.last_name : ''}`,
              user_id: i.user_id,
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
  return (
    <>
      <Head>
        <title>Employee Attendence</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title={'Employee Attendence'} />
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

          <>
            <Card
              sx={{
                p: 1,
                mb: 3
              }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }} >
                <Grid item xs={6} sm={4} md={3} >
                  <Box p={1}>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}

                      <MobileDatePicker
                        label="Select Date"
                        inputFormat='dd/MM/yyyy'
                        value={selectedDate}
                        onChange={(newValue) => {
                          console.log(newValue);

                          setSelectedDate(newValue);
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    {/* </LocalizationProvider> */}
                  </Box>
                </Grid>

                {
                  selectedDate && <Grid item xs={6} sm={4} md={3} >
                    <Box p={1}>
                      <Autocomplete
                        sx={{
                          m: 0
                        }}
                        limitTags={2}
                        // getOptionLabel={(option) => option.id}
                        options={roleList.map(i => {
                          return {
                            label: i.title,
                            id: i.id,
                          }
                        })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            label={t('Select Role')}
                            placeholder={t('Role...')}
                          />
                        )}
                        onChange={(e, v) => setSelectedRole(v ? v : null)}
                      />
                    </Box>
                  </Grid>
                }


                {
                  selectedRole && <Grid item xs={6} sm={4} md={1} >
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
                        if (value && value.id !== 'notTaken') {
                          const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';
                          axios.post(`/api/attendance/employee?school_id=${user?.school_id}&role_id=${selectedRole?.id}&date=${date}&status=${value.id}`)
                            .then(() => {
                              // setStudents((init) => init.map(i => {
                              //   const data = {...i}
                              //   data['attendence']=e
                              //   return data;
                              // }))
                              setattendenceValue(value.id)
                              handleAttendenceFind()
                            })
                            .catch(err => console.log(err))

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
                  itemContent={(_index, row) => rowContent(_index, row, selectedRole, selectedDate, students, setStudents, attendenceValue, setattendenceValue)}
                />
              </Paper>



            </Grid>
          </>


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
