import { Autocomplete, Box, Card, Grid, Divider, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import useNotistick from '@/hooks/useNotistick';

const tableStyle: object = {
  border: '1px solid black',
  borderCollapse: 'collapse',
  minWidth: '70px',
  textAlign: 'center',
  // backgroundColor: '#cccccc'
};

import ReactToPrint from 'react-to-print';
import { ClassAndSectionSelect } from '@/components/Attendence';
function ShowSelectStudentAttendenceResult() {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [targetsectionStudents, setTargetsectionStudents] = useState(null);
  const [students, setStudents] = useState(null);
  const [classes, setClasses] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [examlist, setExamlist] = useState(null)
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState(null);

  const attendenceRef = useRef();

  useEffect(() => {
    axios
      .get(`/api/class?school_id=${user?.school_id}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (academicYear && selectedSection) {
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

  }, [academicYear, selectedSection])


  const handleReportGenerate = async () => {
    try {
      if (selectedSection && academicYear && user) {
        const response = await axios.get(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&exam_id=${selectedExam?.id}`)
        if (response.data.length < 1) {
          throw new Error('Attendence not taken!')
        }
        const res = await axios.get(`/api/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&academic_year_id=${academicYear?.id}`)

        setTargetsectionStudents(
          res.data.map((i) => {
            const middle_name = i?.student_info?.middle_name;
            const last_name = i?.student_info?.last_name;
            const found = response.data.find(j => j.student_id == i.id)
            return {
              student_id: i.id,
              class_roll_no: i.class_roll_no,
              name: i.student_info.first_name + (middle_name ? ` ${middle_name}` : '') + (last_name ? ` ${last_name}` : ''),
              status: found ? found.status : '',
              remark: found ? found.remark : ''
            };
          })
        );


      }
    } catch (err) {

      setTargetsectionStudents(null);
      console.log(err);
      // showNotification(err.message, 'error')
      showNotification(err?.response?.data?.message || err?.message, 'error');
    }

  };
  return (
    <>

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
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    flag={true}
                    classes={classes}
                    selectedDate={null}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                  />
                </Box >
              </ Grid>
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


              {user && selectedSection && academicYear && selectedExam && (
                <>
                  <Grid item >

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleReportGenerate()}
                    >
                      Generate
                    </Button>

                  </Grid>

                  <Grid item >

                    <ReactToPrint
                      content={() => attendenceRef.current}
                      // pageStyle={`{ size: 2.5in 4in }`}
                      trigger={() => (
                        <Button
                          startIcon={<LocalPrintshopIcon />}
                          variant="contained" size='small'>
                          Print
                        </Button>
                      )}
                    />

                  </Grid>

                </>

              )}

            </Grid>
          </Card>
          <Divider />
          <Grid
            sx={{
              maxHeight: 'calc(100vh - 450px) !important',
              minHeight: 'calc(100vh - 450px) !important',

              overflowX: 'auto',
              overflowY: 'auto'
            }}
            justifyContent={'flex-end'}
          >
            {
              targetsectionStudents && <div ref={attendenceRef}>

                <table style={tableStyle}>
                  <thead>
                    <tr>

                      <th style={tableStyle}>Name</th>
                      <th style={tableStyle}>Roll</th>
                      <th style={tableStyle}>Status</th>

                      <th style={tableStyle}>Remark</th>
                    </tr>
                  </thead>

                  <tbody style={{
                    overflowX: 'auto',
                    overflowY: 'auto'
                  }}>
                    {targetsectionStudents?.map((i) => <tr>
                      <td
                        style={{
                          ...tableStyle,
                          backgroundColor: '#00997a',
                          color: 'white'
                        }}
                      >
                        {i.name}
                      </td>
                      <td
                        style={{
                          ...tableStyle,
                          backgroundColor: '#00997a',
                          color: 'white'
                        }}
                      >
                        {i.class_roll_no}
                      </td>
                      <td
                        style={
                          i.status == 'absent'
                            ? {
                              ...tableStyle,
                              backgroundColor: 'red',
                              color: 'white'
                            }
                            : i.status == 'late'
                              ? {
                                ...tableStyle,
                                backgroundColor: 'yellow',
                                color: 'black'
                              }
                              : i.status == 'bunk'
                                ? {
                                  ...tableStyle,
                                  backgroundColor: 'blue',
                                  color: 'white'
                                }
                                : i.status == 'present' ? {
                                  ...tableStyle,
                                  backgroundColor: 'green',
                                  color: 'white'
                                } : tableStyle
                        }
                      >
                        {i.status}
                      </td>
                      <td style={tableStyle}>{i.remark}</td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }

          </Grid>
        </Grid>
      </Grid >
    </>
  );
}


export default ShowSelectStudentAttendenceResult;
