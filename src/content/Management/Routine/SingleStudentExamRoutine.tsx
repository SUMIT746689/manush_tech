import PropTypes from 'prop-types';
import {
  Autocomplete, Box, Card, Grid, Divider, Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, TextField, Typography, Button, Avatar,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
import { BasicPdfExport } from '@/components/Export/Pdf';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';

const SingleStudentExamRoutine = ({ data }) => {
  const { t }: { t: any } = useTranslation();
  const [routine, setRoutine] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedExam, setselectedExam] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth()
  const routineRef = useRef()

  useEffect(() => {
    if (data?.section_id && academicYear) {
      axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${data.section_id}`)
        .then(res => {
          setExams(res.data?.map(i => ({
            label: i.title,
            id: i.id
          })
          ))

        })
        .catch(err => console.log(err))
    }

  }, [academicYear, data])

  const handleRoutineGenerate = () => {
    axios.get(`/api/routine/exam?section_id=${data?.section_id}&exam_id=${selectedExam.id}&academic_year_id=${academicYear?.id}`)
      .then(res => {
        console.log(selectedExam, res.data);

        setRoutine(res.data)
      })
      .catch(err => console.log(err))
  }


  return (
    <>
      <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr min-content' }, gap: { sm: 1 } }}>

        <UncontrolledTextFieldWrapper label="Class" value={data?.class} />
        <UncontrolledTextFieldWrapper label="Batch" value={data?.section} />
        <AutoCompleteWrapper label="Select Exam" placeholder="Select a exam..." value={selectedExam} options={exams} handleChange={(e, value) => { setselectedExam(value) }} />

        <Grid>
          {
            selectedExam ? <ButtonWrapper handleClick={handleRoutineGenerate} >Find</ButtonWrapper>
              :
              <DisableButtonWrapper >Find</DisableButtonWrapper>
          }
        </Grid>
        <Grid item className='w-full'>
          {routine && <BasicPdfExport ref={routineRef} />}
        </Grid>
      </Card>

      <Card sx={{ minHeight: '85%' }} >

        <Divider />

        <>
          {
            routine ?
              <Grid ref={routineRef} sx={{ p: 1 }}>
                <Grid container pt={4} spacing={2} justifyContent={"space-between"} px={7}>

                  <Grid item>
                    <Avatar variant="rounded"  >
                      {/* {user?.school?.image && <img src={`/${user.school.image}`} />} */}
                    </Avatar>
                  </Grid>

                  <Grid width={'60%'} item>
                    <Typography
                      variant="h3"
                      align="center"
                    >
                      {user?.school?.name}
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ borderBottom: 1 }}>
                      {user?.school?.address}, {user?.school?.phone}
                    </Typography>
                    <Typography variant="h6" align="center" >
                      Exam Title : {selectedExam?.label}, Class : {data?.class}, Section : {data?.section}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" >
                      Exam Routine
                    </Typography>

                  </Grid>
                </Grid>
                <TableContainer sx={{ p: 1 }}  >
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
                          Date
                        </TableCell>
                        <TableCell sx={{
                          border: '1px solid darkgrey',
                          borderCollapse: 'collapse',
                          fontSize: '11px',
                          px: 1,
                          py: 0.5
                        }}>
                          Time Slot
                        </TableCell>

                        <TableCell sx={{
                          border: '1px solid darkgrey',
                          borderCollapse: 'collapse',
                          fontSize: '11px',
                          px: 1,
                          py: 0.5
                        }}>
                          Subject Name
                        </TableCell>

                        <TableCell sx={{
                          border: '1px solid darkgrey',
                          borderCollapse: 'collapse',
                          fontSize: '11px',
                          px: 1,
                          py: 0.5
                        }}>
                          Exam Room
                        </TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routine?.exam_details?.map((i) => {

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
                                {dayjs(i?.exam_date).format('DD-MM-YYYY')}

                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: '1px solid darkgrey',
                              borderCollapse: 'collapse',
                              px: 1,
                              py: 0.5
                            }}>
                              <Typography sx={{ fontSize: '11px' }} >
                                {dayjs(i?.exam_date).format('h:m A')}

                              </Typography>
                            </TableCell>

                            <TableCell sx={{
                              border: '1px solid darkgrey',
                              borderCollapse: 'collapse',
                              px: 1,
                              py: 0.5
                            }}>
                              <Typography sx={{ fontSize: '11px' }} >
                                {i?.subject?.name}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: '1px solid darkgrey',
                              borderCollapse: 'collapse',
                              px: 1,
                              py: 0.5
                            }}>
                              <Typography sx={{ fontSize: '11px' }} >
                                {i?.exam_room?.map(j => j?.name)?.join(', ')}
                              </Typography>
                            </TableCell>



                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              :
              <Typography
                sx={{
                  py: 10,
                  px: 4,
                  height: ''
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {t(
                  "We couldn't find any result matching your search criteria"
                )}
              </Typography>

          }


        </>

      </Card>


    </>
  );
};

SingleStudentExamRoutine.propTypes = {
  schools: PropTypes.array.isRequired
};

SingleStudentExamRoutine.defaultProps = {
  schools: []
};

export default SingleStudentExamRoutine;
