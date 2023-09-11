import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import {
  Grid,
  DialogActions,
  DialogContent,
  Box,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  Card
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useNotistick from '@/hooks/useNotistick';
import { MobileTimePicker } from '@mui/lab';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';

function PageHeader() {

  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [sections, setSections] = useState([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [bookedClass, setBookedClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const { user } = useAuth();

  const handleSubmitSuccess = () => {
    setStartTime(null);
    setEndTime(null);
    setBookedClass(null);
    setSelectedRoom(null);
    setSelectedTeacher(null);

  };

  const handleCreateUserSuccess = () => {
    showNotification('The period was created successfully')
  };
  useEffect(() => {
    axios
      .get(`/api/teacher?school_id=${user?.school_id}`)
      .then((res) =>
        setTeachers(
          res.data?.map((i) => {
            return { label: i.user.username, id: i.id };
          })
        )
      )
      .catch((err) => console.log(err));

    axios
      .get(`/api/class?school_id=${user?.school_id}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`/api/rooms?school_id=${user?.school_id}`)
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => console.log(err));
  }, []);

  const handleClassSelect = (e, value, setFieldValue) => {
    setSelectedClass(value)
    if (value?.id) {
      // for (const i of classes) {
      //   if (i.id == value.id) {
      //     setSections(
      //       i.sections?.map((j) => {
      //         return { label: j.name, id: j.id };
      //       })
      //     );
      //     break;
      //   }
      // }
      const selectedClass = classes.find(i => i.id == value.id);
      if (selectedClass) {
        if (selectedClass.has_section) {
          setSections(
            selectedClass?.sections?.map((j) => {
              return { label: j.name, id: j.id };
            })
          )
        } else {
          setFieldValue('section_id', selectedClass.sections[0].id);
        }

        axios.get(`/api/subject?class_id=${selectedClass.id}`)
          .then((res) => {
            console.log('sub__', res.data);

            setSubjectList(
              res.data?.map((i) => {
                return {
                  label: i.name,
                  id: i.id,
                };
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          day: undefined,
          room_id: undefined,
          start_time: undefined,
          end_time: undefined,
          section_id: undefined,
          subject_id: undefined,
          teacher_id: undefined
        }}
        validationSchema={Yup.object().shape({
          day: Yup.string().max(255).required(t('The day field is required')),
          room_id: Yup.number()
            .positive()
            .integer()
            .required(t('The room_id field is required')),
          start_time: Yup.string()
            .max(255)
            .required(t('The start_time field is required')),
          end_time: Yup.string()
            .max(255)
            .required(t('The end_time field is required')),
          section_id: Yup.number()
            .positive()
            .integer()
            .required(t('The section_id field is required')),
          teacher_id: Yup.number().positive().integer()
        })}
        onSubmit={async (
          _values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          const values = { ..._values, school_id: user?.school_id };
          axios
            .post(`/api/period`, values)
            .then(() => {
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateUserSuccess();
              setSelectedClass(null)
              setSelectedDay(null)
              handleSubmitSuccess();
            })
            .catch((err) => {
              console.log(err);
              showNotification(`${err?.response?.data?.message || 'Error'}`, 'error')
            });
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue
        }) => {
          return (
            <Grid display={"grid"} gridTemplateColumns={{ md: "1fr 1fr" }} sx={{}} mt={2} mx={1} gap={1}>

              <Card sx={{ ":nth-of-type": { order: 2 }, p: 1, justifyContent: 'center', borderRadius: 0.6, width: "100%" }}>
                <form onSubmit={handleSubmit}>
                  <DialogTitleWrapper name="period" editData={undefined} />
                  <DialogContent
                    dividers
                    sx={{
                      p: 4
                    }}
                  >
                    {/* <Grid container spacing={3}> */}
                    <Grid item >
                      <Grid container spacing={1}>
                        {/* Select class */}
                        <AutoCompleteWrapper
                          label={t('Class')}
                          placeholder={t('select a class...')}
                          minWidth="100%"
                          required={true}
                          options={classes?.map((i) => ({ label: i.name, id: i.id, has_section: i.has_section }))}
                          value={selectedClass}
                          handleChange={(e, v) => handleClassSelect(e, v, setFieldValue)}
                        />
                        {/* Select section */}
                        {
                          (selectedClass && selectedClass.has_section) ? (<>
                            <AutoCompleteWrapper
                              minWidth="100%"
                              required={true}
                              label={t('section')}
                              placeholder={t('Select Section...')}
                              options={sections}
                              value={undefined}
                              handleChange={(e, value) => setFieldValue('section_id', value?.id)}
                            />
                          </>
                          )
                            :
                            <EmptyAutoCompleteWrapper minWidth="100%" label="Section" placeholder="select a section..." value={undefined} options={[]} />
                        }

                        {/* Select subject */}
                        <AutoCompleteWrapper
                        required={true}
                          minWidth="100%"
                          label={t('Subject')}
                          placeholder={t('select a subject...')}
                          options={subjectList}
                          value={subjectList.find(i => i.id == values.subject_id) || null}
                          handleChange={(e, value) => {
                            setFieldValue('subject_id', value?.id);
                          }}
                        />
                        {/* Select room */}
                        <AutoCompleteWrapper
                          minWidth="100%"
                          required={true}
                          label={t('Room')}
                          placeholder={t('select a room...')}
                          options={rooms?.map((i) => ({ label: i.name, id: i.id }))}
                          value={selectedRoom}
                          handleChange={(e, value) => {
                            setSelectedRoom(value);
                            setFieldValue('room_id', value?.id);
                          }}
                        />

                        {/* Select day */}
                        <AutoCompleteWrapper
                          minWidth="100%"
                          required={true}
                          label={t('Select Day')}
                          placeholder="select a day..."
                          options={[
                            'Saturday',
                            'Sunday',
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday'
                          ]}
                          value={selectedDay}
                          //@ts-ignore
                          handleChange={(event, value) => {
                            setSelectedDay(value)
                            if (value) {
                              axios.get(`/api/period/${value}?school_id=${user?.school_id}`)
                                .then((res) => setBookedClass(res.data))
                                .catch((err) => console.log(err));
                              setFieldValue('day', value);
                            } else setBookedClass(value);

                          }}
                        />

                        {/* start_time */}
                        <Grid item xs={12} sm={6} md={6}>
                          <MobileTimePicker
                          
                            label="Start Time"
                            value={startTime}
                            onChange={(n) => {
                              const newValue = dayjs(n)
                              if (n) {
                                setFieldValue(
                                  'start_time',
                                  // @ts-ignore
                                  `1970-05-02 ${newValue.$H}:${newValue.$m}:00`
                                );
                                setStartTime(newValue);
                                //  console.log(newValue);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                required={true}
                                sx={{
                                  [`& fieldset`]: {
                                    borderRadius: 0.6,
                                  }
                                }}
                                size='small'
                                //   onKeyDown={(e) => {
                                //     e.preventDefault();
                                //  }}
                                {...params}
                              />
                            )}
                          />
                        </Grid>

                        {/* end_time */}
                        <Grid item xs={12} sm={6} md={6}>
                          <MobileTimePicker
                            label="End time"
                            value={endTime}
                            onChange={(n) => {
                              const newValue = dayjs(n)
                              if (n) {
                                setFieldValue(
                                  'end_time',
                                  //@ts-ignore
                                  `1970-05-02 ${newValue.$H}:${newValue.$m}:00`
                                );
                                setEndTime(newValue);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                required={true}
                                sx={{
                                  [`& fieldset`]: {
                                    borderRadius: 0.6,
                                  }
                                }}
                                size='small'
                                //   onKeyDown={(e) => {
                                //     e.preventDefault();
                                //  }}
                                {...params}
                              />
                            )}
                          />

                        </Grid>

                        {/* Select teacher */}
                        <AutoCompleteWrapper
                          minWidth={"100%"}
                          label="Select Teacher"
                          placeholder="Select a teacher..."
                          options={teachers}
                          value={selectedTeacher}
                          //@ts-ignore
                          handleChange={(event, value) => {
                            setSelectedTeacher(value);
                            setFieldValue('teacher_id', value?.id);
                          }}
                        />
                      </Grid>
                    </Grid>



                    {/* </Grid> */}
                  </DialogContent>

                  <DialogActionWrapper
                    titleFront={"Add New"}
                    title="Period"
                    handleCreateClassClose={handleSubmitSuccess}
                    errors={errors}
                    editData={undefined}
                    isSubmitting={isSubmitting}
                  />
                </form>
              </Card>
              {/* {
                bookedClass && ( */}
              <Grid item height="100%" width="full" overflow="auto" sx={{ ":nth-of-type": { order: 1 } }} >
                <TableContainer component={Paper} sx={{ minHeight: "100%", borderRadius: 0.6 }}>
                  <Table
                    sx={{ minWidth: 600 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Room</TableCell>
                        <TableCell align="center">Start Time</TableCell>
                        <TableCell align="center">End Time</TableCell>
                        <TableCell align="center">Teacher</TableCell>
                        <TableCell align="center">Teacher's Id</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookedClass?.map((row) => {
                        let start_time;
                        let end_time;

                        const tempStart_time = new Date(
                          row?.start_time
                        ).getHours();
                        const tempEnd_time = new Date(
                          row?.end_time
                        ).getHours();
                        if (tempStart_time > 12) {
                          start_time = `${tempStart_time - 12
                            } : ${new Date(
                              row?.start_time
                            ).getMinutes()} pm`;
                        } else {
                          start_time = `${tempStart_time} : ${new Date(
                            row?.start_time
                          ).getMinutes()} am`;
                        }
                        if (tempEnd_time > 12) {
                          end_time = `${tempEnd_time - 12} : ${new Date(
                            row?.end_time
                          ).getMinutes()} pm`;
                        } else {
                          end_time = `${tempEnd_time} : ${new Date(
                            row?.end_time
                          ).getMinutes()} am`;
                        }
                        let mark = {};
                        if (
                          selectedRoom &&
                          row.room.id == selectedRoom.id &&
                          row.room.id == selectedRoom.id
                        ) {
                          mark = {
                            color: 'white',
                            bgcolor: 'text.secondary'
                            // opacity:
                          };
                        } else {
                          mark = {
                            color: 'text.primary'
                          };
                        }
                        let markTeacher = {};
                        // { color: selectedTeacher ? (selectedTeacher.id == row?.teacher?.id ) ? 'error.main' : 'text.primary' : 'text.primary' }

                        if (
                          selectedTeacher &&
                          selectedTeacher.id == row?.teacher?.id &&
                          selectedRoom &&
                          row.room.id == selectedRoom.id &&
                          row.room.id == selectedRoom.id
                        )
                          markTeacher = {
                            bgcolor: 'warning.main'
                          };

                        let timeOverlap = {};
                        if (
                          startTime &&
                          //@ts-ignore
                          startTime.$H == tempStart_time &&
                          new Date(row?.start_time).getMinutes() ==
                          //@ts-ignore
                          startTime.$m &&
                          endTime &&
                          //@ts-ignore
                          endTime.$H == tempEnd_time &&
                          new Date(row?.end_time).getMinutes() ==
                          //@ts-ignore
                          endTime.$m
                        ) {
                          timeOverlap = {
                            bgcolor: 'error.main'
                          };
                        }

                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0
                              }
                            }}
                          >
                            <TableCell sx={mark}>
                              {row?.room?.name}
                            </TableCell>
                            <TableCell align="center" sx={timeOverlap}>
                              {start_time}
                            </TableCell>
                            <TableCell align="center" sx={timeOverlap}>
                              {end_time}
                            </TableCell>
                            <TableCell align="center" sx={markTeacher}>
                              {row?.teacher?.first_name}
                            </TableCell>
                            <TableCell align="center" sx={markTeacher}>
                              {row?.teacher?.id}
                            </TableCell>
                            {/* <TableCell >{row?.section?.class?.name}</TableCell> */}
                            {/* <TableCell>{row?.section?.name}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {/* )
              } */}
            </Grid>
          );
        }}
      </Formik >
    </>
  );
}

export default PageHeader;
