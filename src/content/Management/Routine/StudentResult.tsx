import PropTypes from 'prop-types';
import {
  Autocomplete, Box, Card, Grid, Divider, Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, TextField, Typography, Button,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { BasicPdfExport } from '@/components/Export/Pdf';
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';
import { TableEmptyWrapper } from '@/components/TableWrapper';
const StudentResults = ({data}) => {
  const { t }: { t: any } = useTranslation();
  const [routine, setRoutine] = useState(null);
  const [slotHeader, setSlotHeader] = useState([]);
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const routineRef = useRef()


  useEffect(() => {
    handleRoutineGenerate();
  }, [])

  const TimeConverter = (start) => {

    const tempStart_time = new Date(start).getHours()

    if (tempStart_time > 12) {
      return `${tempStart_time - 12} : ${new Date(start).getMinutes()} pm`
    }
    else {
      return `${tempStart_time} : ${new Date(start).getMinutes()} am`
    }

  }

  const handleRoutineGenerate = () => {

    axios.get(`/api/routine/student`)
      .then(res => {
        console.log("res___",res.data);
        
        let routine = [];
        let index = 0;
        let uniqueDay = [];
        let timeSlot = [];
        setStudentClass(res.data.class);
        setSection(res.data.section);

        if (!res.data.routine) return;
        for (let i of res.data.routine) {

          let classSlot = [];
          const gotDay = uniqueDay.find(s => s == i.day);
          if (!gotDay) {
            for (let j of res.data.routine) {
              if (i.day == j.day) {

                classSlot.push({
                  start_time: TimeConverter(j?.start_time),
                  end_time: TimeConverter(j?.end_time),
                  room: j?.room?.name,
                  teacher: j?.teacher?.user?.username,
                  subject: j?.subject?.name,
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

  return (
    <>
      <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr min-content' }, columnGap: 1 }}>
        <UncontrolledTextFieldWrapper label="Class" value={data.class} />
        <UncontrolledTextFieldWrapper label="Batch" value={data.section} />
        
        {routine?.length > 0 &&
          <Grid item className='w-full'>
            <BasicPdfExport ref={routineRef} />
          </Grid>
        }
      </Card>

      <Card sx={{ minHeight: '85%' }} >

        <Divider />

        <>
          {
            routine ? <TableContainer sx={{ p: 1 }} ref={routineRef} >
              <Table size='small'>
                <TableHead sx={{
                  border: '1px solid darkgrey',
                  borderCollapse: 'collapse'
                }}>
                  <TableRow>
                    <TableCell sx={{
                      border: '1px solid darkgrey',
                      borderCollapse: 'collapse',
                      fontSize: '11px',
                      px: 1,
                      py: 0.5
                    }}>
                      Weeks
                    </TableCell>
                    {
                      slotHeader.map(i => <TableCell key={i} sx={{
                        border: '1px solid darkgrey',
                        borderCollapse: 'collapse',
                        fontSize: '11px',
                        p: 0.5,
                        textAlign: 'center'
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
                          border: '1px solid darkgrey',
                          borderCollapse: 'collapse',
                          px: 1,
                          py: 0.5
                        }}>
                          <Typography sx={{ fontSize: '11px' }} >
                            {i?.day}
                          </Typography>
                        </TableCell>

                        {
                          slotHeader.map((e, index) => {

                            const slot = i?.classSlot.find(element => element.start_time == e.actualStart_time && element.end_time == e.actualEnd_time)
                            console.log("slot__", slot);

                            if (slot) {
                              return <TableCell key={index} sx={{
                                border: '1px solid darkgrey',
                                borderCollapse: 'collapse',
                                minHeight: '20px',
                                minWidth: '20px',
                                p: 0.5
                              }}>
                                <Typography noWrap variant="h5" sx={{ fontSize: '11px' }}>
                                  <div className=' text-center'>
                                    {slot.start_time}-
                                    {slot.end_time}

                                    <br />
                                    {slot?.subject} <br />
                                    {slot?.room} <br />
                                    {slot?.teacher} <br />
                                    {/* {section}<br /> */}
                                    {/* {slot?.class} */}
                                  </div>

                                </Typography>
                              </TableCell>
                            } else {
                              return <TableCell key={index} sx={{
                                border: '1px solid darkgrey',
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
              :
              <TableEmptyWrapper title="result"/>
          }


        </>

      </Card>


    </>
  );
};


export default StudentResults;
