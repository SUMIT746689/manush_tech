import { Autocomplete, Box, Card, Grid, Divider, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

import dayjs, { Dayjs } from 'dayjs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import useNotistick from '@/hooks/useNotistick';

const tableStyle: object = {
  border: '1px solid black',
  borderCollapse: 'collapse',
  minWidth: '70px',
  textAlign: 'center',
  // backgroundColor: '#cccccc'
};

import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ReactToPrint from 'react-to-print';
import { MobileDatePicker } from '@mui/lab';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
function Attendence() {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [targetsectionStudents, setTargetsectionStudents] = useState(null);
  const [students, setStudents] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth();

  const attendenceRef = useRef();

  useEffect(() => {
    axios
      .get(`/api/class?school_id=${user?.school_id}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClassSelect = (e, value) => {
    setSelectedClass(value);
    setSelectedSection(null);
    if (value?.id) {
      const selectedClassSections = classes.find((i) => i.id == value?.id);
      if (selectedClassSections) {
        if (selectedClassSections.has_section) {
          setSections(
            selectedClassSections?.sections?.map((j) => {
              return {
                label: j.name,
                id: j.id
              };
            })
          );
        } else {
          setSelectedSection({
            label: selectedClassSections?.sections[0].name,
            id: selectedClassSections?.sections[0].id
          });
        }
      }
    }
  };

  const handleReportGenerate = async () => {
    try {
      if (selectedSection && selectedDate && academicYear && user) {
        const response = await axios.get(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&from_date=${selectedDate.slice(0, -2) + '01'}&to_date=${selectedDate.slice(0, -2) + '31'}`)

        if (response.data.length < 1) {
          throw new Error('Attendence not taken!')
        }
        const res = await axios.get(`/api/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&academic_year_id=${academicYear?.id}`)

        setTargetsectionStudents(
          res.data.map((i) => {
            const middle_name = i?.student_info?.middle_name;
            const last_name = i?.student_info?.last_name;
            return {
              student_id: i.id,
              class_roll_no: i.class_roll_no,
              name: i.student_info.first_name + (middle_name ? ` ${middle_name}` : '') + (last_name ? ` ${last_name}` : '')
            };
          })
        );

        const montAttendence = Array.from({ length: 33 }, (_, j) => {
          if (j == 0) return 'name';
          else if (j == 1) return 'roll';
          else
            return {
              dayNumber: j - 1,
              student_id_list: []
            };
        });

        for (const i of response.data) {
          const temp_date = new Date(i.date).getUTCDate();
          // @ts-ignore
          montAttendence[(temp_date < 1 ? 1 : temp_date) + 1]?.student_id_list.push({
            student_id: i.student_id,
            status: i.status,
            remark: i.remark
          });
        }
        setStudents(montAttendence);

      }
    } catch (err) {
      setStudents(null);
      setTargetsectionStudents(null);
      console.log(err);
      // showNotification(err.message, 'error')
      showNotification(err?.response?.data?.message || err?.message, 'error');
    }

  };
  return (
    <>
      <Head>
        <title>Students Attendence</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title={'Students Attendence'} />
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item >

                <MobileDatePicker
                  label="Select Date"
                  views={['year', 'month']}
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(dayjs(newValue).format('YYYY-MM-DD'));
                    } else {
                      setSelectedDate(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size='small'
                      fullWidth
                      sx={{
                        [`& fieldset`]: {
                          borderRadius: 0.6,
                        }
                      }}
                    />
                  )}
                />

              </Grid>

              {selectedDate ? (
                <>
                  {/* <Autocomplete
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    // getOptionLabel={(option) => option.id}
                    options={classes.map((i) => {
                      return {
                        label: i.name,
                        id: i.id,
                        has_section: i.has_section
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={t('Select class')}
                        placeholder={t('Class...')}
                      />
                    )}
                    onChange={handleClassSelect}
                  /> */}
                  <AutoCompleteWrapper
                    minWidth="100%"
                    label={t('Select class')}
                    placeholder={t('Class...')}
                    options={classes.map((i) => ({
                      label: i.name,
                      id: i.id,
                      has_section: i.has_section
                    }))
                    }
                    value={undefined}
                    handleChange={handleClassSelect}
                  />
                </>
              )
                :
                <EmptyAutoCompleteWrapper
                  minWidth="100%"
                  label={t('Select Class')}
                  placeholder={t('Class...')}
                  options={[]}
                  value={undefined}
                />
              }

              {(selectedClass?.has_section && sections && selectedDate) ? (
                <>
                  <Grid item xs={6} sm={4} md={2}>
                    <Box p={1}>
                      <Autocomplete
                        fullWidth
                        sx={{
                          mr: 10
                        }}
                        limitTags={2}
                        options={sections}
                        value={selectedSection}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            label={t('Sections')}
                            placeholder={t('Select section...')}
                          />
                        )}
                        onChange={(e, value) => setSelectedSection(value)}
                      />
                    </Box>
                  </Grid>
                  <AutoCompleteWrapper
                    label={t('Sections')}
                    placeholder={t('Select section...')}
                    options={sections}
                    value={selectedSection}
                    handleChange={(e, value) => setSelectedSection(value)}

                  />
                </>
              )
                :
                <EmptyAutoCompleteWrapper
                  label={t('Sections')}
                  placeholder={t('Select section...')}
                  options={[]}
                  value={undefined}
                />
              }
              {(user && selectedSection && academicYear) ? (
                <>
                  <Grid item >
                    <ButtonWrapper
                      handleClick={() => handleReportGenerate()}
                    >
                      Generate
                    </ButtonWrapper>

                  </Grid>
                  {
                    students &&
                    <Grid item >

                      <ReactToPrint
                        content={() => attendenceRef.current}
                        // pageStyle={`{ size: 2.5in 4in }`}
                        trigger={() => (
                          <ButtonWrapper
                            startIcon={<LocalPrintshopIcon />}
                            size='small'
                            handleClick={undefined}
                          >
                            Print
                          </ButtonWrapper>
                        )}
                      />

                    </Grid>
                  }
                </>
              )
                :
                <DisableButtonWrapper>Generate</DisableButtonWrapper>
              }

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
              targetsectionStudents && students && <div ref={attendenceRef}>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {[-1, ...Array(32).keys()].map((i) => (
                        <th style={tableStyle}>
                          {i > 1 ? i : i == -1 ? 'Name' : i == 0 ? 'Roll' : i}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody style={{
                    overflowX: 'auto',
                    overflowY: 'auto'
                  }}>
                    {targetsectionStudents?.map((i) => {
                      return (
                        <tr>
                          {students?.map((j) => {
                            if (j.student_id_list) {
                              const found = j.student_id_list.find(
                                (st) => st.student_id == i.student_id
                              );

                              if (found) {
                                return (
                                  <td
                                    style={
                                      found.status == 'absent'
                                        ? {
                                          ...tableStyle,
                                          backgroundColor: 'red',
                                          color: 'white'
                                        }
                                        : found.status == 'late'
                                          ? {
                                            ...tableStyle,
                                            backgroundColor: 'yellow',
                                            color: 'black'
                                          }
                                          : found.status == 'bunk'
                                            ? {
                                              ...tableStyle,
                                              backgroundColor: 'blue',
                                              color: 'white'
                                            }
                                            : {
                                              ...tableStyle,
                                              backgroundColor: 'green',
                                              color: 'white'
                                            }
                                    }
                                  >
                                    {found.status}
                                  </td>
                                );
                              } else {
                                return (
                                  <td style={tableStyle}> &nbsp; &nbsp; </td>
                                );
                              }
                            } else {
                              if (j == 'name')
                                return (
                                  <td
                                    style={{
                                      ...tableStyle,
                                      backgroundColor: '#00997a',
                                      color: 'white'
                                    }}
                                  >
                                    {i.name}
                                  </td>
                                );
                              else
                                return (
                                  <td
                                    style={{
                                      ...tableStyle,
                                      backgroundColor: '#00997a',
                                      color: 'white'
                                    }}
                                  >
                                    {i.class_roll_no}
                                  </td>
                                );
                            }
                          })}
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* <tfoot>
            <tr>
              <td>Sum</td>
              <td>$180</td>
            </tr>
          </tfoot> */}
                </table>
              </div>
            }

          </Grid>
        </Grid >
      </Grid >
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
