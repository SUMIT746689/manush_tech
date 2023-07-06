import PropTypes from 'prop-types';
import {
  Autocomplete, Box, Card, Grid, Divider, Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, TextField, Typography, Button,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
const Results = () => {
  const { t }: { t: any } = useTranslation();
  const [routine, setRoutine] = useState(null);
  const [slotHeader, setSlotHeader] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const { user } = useAuth()
  const routineRef = useRef()
  useEffect(() => {
    axios.get(`/api/class?school_id=${user?.school_id}`)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    console.log(routine);
  }, [routine])

  const handleClassSelect = (e, value) => {
    setSelectedClass(value)
    setSelectedSection(null)
    if (value) {
      const selectedClass = classes.find(i => i.id == value?.id);
      if (selectedClass) {
        if (selectedClass.has_section) {
          setSections(selectedClass?.sections?.map(j => { return { label: j.name, id: j.id } }))
        } else {
          setSelectedSection({ label: selectedClass?.sections[0]?.name, id: selectedClass?.sections[0]?.id })
        }
      }
    }
  }

  const TimeConverter = (start) => {

    const tempStart_time = new Date(start).getHours()

    if (tempStart_time > 12) {
      return `${tempStart_time - 12} : ${new Date(start).getMinutes()} pm`
    }
    else {
      return `${tempStart_time} : ${new Date(start).getMinutes()} am`
    }

  }

  const handleSectionSelect = (e, value) => {
    setSelectedSection(value)
  }
  const handleRoutineGenerate = () => {
    if (selectedSection) {
      axios.get(`/api/routine?section_id=${selectedSection?.id}&school_id=${user?.school_id}`)
        .then(res => {
          let routine = [];
          let index = 0;
          let uniqueDay = [];
          let timeSlot = [];

          for (let i of res.data) {

            let classSlot = [];
            const gotDay = uniqueDay.find(s => s == i.day);
            console.log("got__", gotDay);
            if (!gotDay) {
              for (let j of res.data) {
                if (i.day == j.day) {

                  classSlot.push({
                    start_time: TimeConverter(j?.start_time),
                    end_time: TimeConverter(j?.end_time),
                    room: j.room.name,
                    teacher: j.teacher.user.username,
                    section: j.section.name,
                    class: j.section.class.name
                  })
                }


              }
              uniqueDay.push(i.day)
              routine.push({ day: i.day, classSlot: classSlot })

            }
            const gotTime = timeSlot?.find(s =>
              s.start_time == (new Date(i?.start_time).getHours() * 60 + new Date(i?.start_time).getMinutes()) &&
              s.end_time == (new Date(i?.end_time).getHours() * 60 + new Date(i?.end_time).getMinutes())
            )
            if (!gotTime) {
              const start_time = TimeConverter(i?.start_time)
              const end_time = TimeConverter(i?.end_time)

              console.log(new Date(i?.start_time).getHours() + new Date(i?.start_time).getMinutes(), "  ", new Date(i?.end_time).getHours() + new Date(i?.end_time).getMinutes());

              timeSlot.push({
                start_time: new Date(i?.start_time).getHours() * 60 + new Date(i?.start_time).getMinutes(),
                actualStart_time: start_time,
                end_time: new Date(i?.end_time).getHours() * 60 + new Date(i?.end_time).getMinutes(),
                actualEnd_time: end_time
              })
            }
            index++;
          }
         

          timeSlot.sort((a, b) => {
            if (a.start_time > b.start_time && a.end_time > b.end_time) return 1;
            else if (b.start_time > a.start_time && b.end_time > a.end_time) return -1;
            else return 0;
          })

          console.log("sorted__", timeSlot);

          setSlotHeader(timeSlot)
          const day = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          let sortedRoutineByDay = []

          for (const i of day) {
            const temp = routine.find(j => j.day == i)
            if (temp) {
              sortedRoutineByDay.push(temp)
            } else {
              sortedRoutineByDay.push({ day: i, classSlot: [] })
            }
          }

          setRoutine(sortedRoutineByDay)
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
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={1}>
              <Autocomplete
                sx={{
                  m: 0
                }}
                limitTags={2}
                options={classes?.map(i => { return { label: i.name, id: i.id, has_section: i.has_section } })}
                value={selectedClass}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Select class')}
                    placeholder={t('Select class...')}
                  />
                )}
                onChange={handleClassSelect}
              />
            </Box>
          </Grid>
          {
            selectedClass && selectedClass.has_section && (<Grid item xs={12} sm={6} md={4}>
              <Box p={1}>
                <Autocomplete
                  sx={{
                    m: 0
                  }}
                  limitTags={2}
                  options={sections}
                  value={selectedSection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      label={t('Select section')}
                      placeholder={t('Select section...')}
                    />
                  )}
                  onChange={handleSectionSelect}
                />
              </Box>
            </Grid>)
          }

          {
            selectedSection && <Grid item xs={2} sm={4} md={3} >
              <Box p={1}>
                <Button variant="contained"
                  size="medium" onClick={handleRoutineGenerate}>Find</Button>
              </Box>
            </Grid>
          }
          {
            routine && <Grid item xs={12} sm={6} md={4}>
              <Box p={1}>
                <ReactToPrint
                  content={() => routineRef.current}
                  trigger={() => (
                    <Button size='large'
                    startIcon={<LocalPrintshopIcon/>}
                    fullWidth variant="contained">
                      print
                    </Button>
                  )}
                />
              </Box>
            </Grid>
          }

        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 445px) !important' }}>

        <Divider />

        <>
          {
            routine && <TableContainer sx={{ p: 1 }} >
              <Table ref={routineRef}>
                <TableHead sx={{
                  border: '1px solid black',
                  borderCollapse: 'collapse'
                }}>
                  <TableRow>
                    <TableCell sx={{
                      border: '1px solid black',
                      borderCollapse: 'collapse'
                    }}>
                    </TableCell>
                    {
                      slotHeader.map(i => <TableCell key={i} sx={{
                        border: '1px solid black',
                        borderCollapse: 'collapse'
                      }}>{t(`${i?.actualStart_time} - ${i?.actualEnd_time}`)}</TableCell>)
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routine?.map((i) => {

                    return (
                      <TableRow
                        hover
                        key={i.id}

                      >
                        <TableCell sx={{
                          border: '1px solid black',
                          borderCollapse: 'collapse'
                        }}>
                          <Typography >
                            {i?.day}
                          </Typography>
                        </TableCell>

                        {
                          slotHeader.map((e, index) => {

                            const slot = i?.classSlot.find(element => element.start_time == e.actualStart_time && element.end_time == e.actualEnd_time)
                            console.log("slot__", slot);

                            if (slot) {
                              return <TableCell key={index} sx={{
                                border: '1px solid black',
                                borderCollapse: 'collapse',
                                minHeight: '20px',
                                minWidth: '20px'
                              }}>
                                <Typography noWrap variant="h5" className=' text-center'>
                                  <td className=' text-center'>
                                    {slot.start_time}-
                                    {slot.end_time}

                                    <br />
                                    {slot?.room} <br />
                                    {slot?.teacher} <br />
                                    {selectedClass?.has_section ? slot?.section : '(no section)'}<br />
                                    {slot?.class}
                                  </td>

                                </Typography>
                              </TableCell>
                            } else {
                              return <TableCell key={index} sx={{
                                border: '1px solid black',
                                borderCollapse: 'collapse',
                                minHeight: '20px',
                                minWidth: '20px'
                              }}>
                                <Typography ></Typography></TableCell>
                            }

                          })
                        }

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          }


        </>

      </Card>


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
