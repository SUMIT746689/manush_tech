import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import Head from 'next/head';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';


import { Button, Card, Grid, Typography, Zoom } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import PageTitleWrapper from 'src/components/PageTitleWrapper';


import Results from 'src/content/Management/Students/Results';
// import RegistrationFirstPart from '@/content/Management/Students/RegistrationFirstPart';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useRef } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import IdentityCard from '@/content/Management/Students/StudentIdCardDesign';
import { useSnackbar } from 'notistack';
import { useClientFetch } from '@/hooks/useClientFetch';
import Footer from '@/components/Footer';
import { ExportData } from '@/content/Management/Students/ExportData';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import dayjs from 'dayjs';

function ManagementClasses() {

  const [students, setStudents] = useState([]);
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [sections, setSections] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const idCard = useRef();
  const [excelFileUpload, setExcelFileUpload] = useState(null);

  const { data: classes } = useClientFetch(`/api/class?school_id=${user?.school_id}`);

  const handleStudentList = () => {

    if (academicYear && selectedSection) {
      axios
        .get(
          `/api/student?${selectedSection.id == 'all' ? `class_id=${selectedClass?.id}` : `section_id=${selectedSection?.id}`}&academic_year_id=${academicYear?.id}`
        )
        .then((res) => {
          console.log('ref__', res.data);
          setStudents(res.data);

        });
    }

  }


  const handleClassSelect = (event, newValue) => {
    console.log(newValue);
    setSelectedClass(newValue);
    setSelectedSection(null);

    if (newValue) {
      const targetClassSections = classes.find((i) => i.id == newValue.id);
      const sections = targetClassSections?.sections?.map((i) => {
        return {
          label: i.name,
          id: i.id
        };
      })
      sections.push({
        label: 'All sections',
        id: 'all'
      })
      setSections(sections);
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        });
      } else {
        setSelectedSection(null);
      }
    }
  };
  const handleSendToRegistrationPage = () => {
    router.push('/management/students/registration');
  };

  const handleExcelUpload = () => {
    console.log(excelFileUpload);
    if (excelFileUpload) {
      const form = new FormData();
      form.append('students', excelFileUpload);

      axios
        .post('/api/student/bulk-admission', form)
        .then((res) => {
          setExcelFileUpload(null);
          enqueueSnackbar(t('All students data inserted'), {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            TransitionComponent: Zoom
          });
        })
        .catch((err) => {
          console.log(err);

          enqueueSnackbar(t(`${err?.response?.data?.message}`), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            TransitionComponent: Zoom
          });
        });
    }
  };
  const handlePrint = useReactToPrint({
    content: () => idCard.current,
    pageStyle: `@media print {
      @page {
        size: 235mm 115mm;
      }
    }`
  });
  // size: 85.725mm 53.975mm;
  console.log("excelFileUpload__", excelFileUpload);

  return (
    <>
      <Head>
        <title>Students - Management</title>
      </Head>

      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item md={6}>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Student Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the students can be managed from this page'
              )}
            </Typography>
            <Button
              sx={{ mt: 1 }}
              onClick={handleSendToRegistrationPage}
              variant="contained"
            >
              {t('Registration student')}
            </Button>
          </Grid>

          <Grid
            item
            display='flex'
            justifyContent="flex-end"
            sx={{ textAlign: { md: 'right' }, mt: 1 }}

          >
            <Grid container gap={2}>
              <Grid item>
                <Button
                  size='small'
                  variant="contained"
                  href={`/student.xlsx`}
                >
                  Download Excel format

                </Button>
              </Grid>



              {/* <TextField
              label="select Excel file"
              name="select Excel file"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files[0]) {
                  setExcelFileUpload(e.target.files[0]);
                } else {
                  setExcelFileUpload(null);
                }
              }}
            /> */}
              <Grid item>
                <FileUploadFieldWrapper
                  htmlFor="excelUpload"
                  label="select Excel file"
                  name="excelUpload"
                  value={excelFileUpload?.name || ''}
                  handleChangeFile={(e) => { if (e.target?.files?.length) { setExcelFileUpload(e.target.files[0]) } }}
                  handleRemoveFile={(e) => { setExcelFileUpload(undefined) }}
                />
              </Grid>
              <Button
                sx={{
                  m: '10px'
                }}
                disabled={excelFileUpload ? false : true}
                onClick={handleExcelUpload}
                variant="contained"
                size='small'
              >
                {t('Bulk admission')}
              </Button>
            </Grid>


          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Card sx={{ mx: 4, mb: 1, p: 1 }}>
        {/* select class */}
        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="stretch"
          spacing={1}
        >
          <Grid
            item
            xs={6}
            sm={4}
            md={2}
            justifyContent="flex-end"
            textAlign={{ sm: 'right' }}
          >
            <Autocomplete
              size="small"
              id="tags-outlined"
              options={classes?.map((i) => {
                return {
                  label: i.name,
                  id: i.id,
                  has_section: i.has_section
                };
              })}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label={t('Select class')}
                  placeholder="Name"
                />
              )}
              onChange={handleClassSelect}
            />
          </Grid>

          {selectedClass && selectedClass.has_section && sections && (
            <>
              <Grid
                item
                xs={6}
                sm={4}
                md={2}
                justifyContent="flex-end"
                textAlign={{ sm: 'right' }}
              >
                <Autocomplete
                  size="small"
                  id="tags-outlined"
                  options={sections}
                  value={selectedSection}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="select section"
                      placeholder="Name"
                    />
                  )}
                  onChange={(e, v) => {
                    setSelectedSection(v);
                  }}
                />
              </Grid>
            </>
          )}
          {
            selectedSection && <Grid
              item
              xs={6}
              sm={4}
              md={2}
            >
              <Button

                variant="contained" onClick={handleStudentList}> Find</Button>
            </Grid>
          }
          {students.length > 0 && (
            <Grid
              item
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
              xs={6}
              sm={4}
              md={2}
            >
              <Button
                fullWidth
                sx={{ height: '100%' }}
                variant="contained"
                onClick={handlePrint}
              >
                Print Id Card
              </Button>
            </Grid>
          )}
          <Grid pt={1} pl={1}>
            <ExportData students={students} />
          </Grid>
        </Grid>
      </Card>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results users={students} />
        </Grid>
      </Grid>
      <div style={{ display: 'none', visibility: 'hidden' }}>
        <Grid
          ref={idCard}
        // container
        // spacing={0}
        // direction="column"
        // alignItems="center"
        // justifyContent="center"
        >
          {students?.map(
            (i) => {
              console.log("i___", i);

              const user = {
                id: i?.class_roll_no,
                name: `${i?.student_info?.first_name ? i?.student_info?.first_name : ''} ${i?.student_info?.middle_name ? i?.student_info?.middle_name : ''} ${i?.student_info?.last_name ? i?.student_info?.last_name : ''}`,
                schoolName: i?.student_info?.school?.name,
                class: i?.section?.class?.name,
                roll: i?.class_roll_no,
                section: i?.section?.class?.has_section ? i?.section?.name : 'No section',
                blood_group: i?.student_info?.blood_group,
                academicYear: i?.academic_year?.title,
                phone: i?.phone,
                birthDate: dayjs(i?.student_info?.date_of_birth).format('DD/MM/YYYY'),

                photo: i?.student_photo ? `/files/${i?.student_photo}` : 'https://cdn4.iconfinder.com/data/icons/modern-education-and-knowledge-power-1/512/499_student_education_graduate_learning-512.png'
              };
              return <IdentityCard user={user} />;
            }
            // <Grid
            //   container
            //   spacing={0}
            //   direction="column"
            //   alignItems="center"
            //   justifyContent="center"
            //   style={{
            //     pageBreakInside: 'avoid',
            //     breakInside: 'avoid'
            //   }}
            // >
            //   <p>{`${i?.student_info?.first_name}`+`${i?.student_info?.middle_name ? " " + i?.student_info?.middle_name : ""}`+`${i?.student_info?.last_name ? " " + i?.student_info?.last_name : ""}`}</p>
            //   <p> Class : {i?.section?.class?.name}</p>
            //   <p>Section : {i?.section?.name}</p>
            //   <p>Section roll : {i?.class_roll_no}</p>
            //   <p>{i?.student_info?.school?.name}</p>
            //   <br />

            // </Grid>
          )}
        </Grid>
      </div>
      <Grid>

      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="student">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
