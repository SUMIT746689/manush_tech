import { useContext, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Grid, Dialog, DialogTitle, DialogContent, Box, Typography, TextField, CircularProgress, Button, useTheme, Autocomplete } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';


function PageHeader({ editExam, setEditExam, classes, selectClasses,
  setSelectClasses, setSelectedSection,
  setStudentList, setExams, setSections, sections, studentList,
  exams, examSubjectList, setExamSubjectList, selectedExam,
  selectedSection, setSelectedExam, setSelectedStudent, selectedStudent
  , selectedExamSubject, setSelectedExamSubject
}): any {

  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

  const theme = useTheme();


  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);

    setEditExam(null);
  };

  const handleCreateProjectSuccess = () => {
    showNotification('A new project has been created successfully');
    setOpen(false);
  };

  const handleErrorSnackbar = (err) => {
    showNotification(err.message, 'error')
  }
  const handleClassSelect = (event, newValue) => {
    console.log(newValue);
    setSelectClasses(newValue);
    if (newValue) {
      axios.get(`/api/class/${newValue.id}`)
        .then((res) => {
          console.log(res.data);
          setSections(res.data?.sections?.map(i => {
            return {
              label: i.name,
              id: i.id
            }
          }));
        })
        .catch(err => console.log(err))
    }
  }

  const handleExamSelect = (e, newvalue, setFieldValue, setSelectedExam) => {
    setSelectedExam(newvalue)
    if (newvalue) {
      setFieldValue("exam_id", newvalue.id)
      axios.get(`/api/exam/exam-subject-list?exam_id=${newvalue.id}`)
        .then(res => setExamSubjectList(res.data?.map(i => {
          return {
            label: i.subject.name,
            id: i.id,
            subject_total: i.subject_total
          }
        })))
        .catch(err => console.log(err))
    } else {
      setFieldValue("exam_id", null)
    }


  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Results')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your Results')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateProjectOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Result mark entry')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(`${editExam ? 'Edit Result mark entry' : 'Result mark entry'}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to Result mark entry')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            student_id: selectedStudent?.id || undefined,
            exam_id: selectedExam?.id || undefined,
            exam_details_id: selectedExamSubject?.id || undefined,
            mark_obtained: undefined,
            subject_total: selectedExamSubject?.subject_total || undefined,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            student_id: Yup.number().required(t('The student field is required')).nullable(false),
            exam_id: Yup.number().required(t('The exam field is required')).nullable(false),
            exam_details_id: Yup.number().required(t('The exam subject field is required')).nullable(false),
            mark_obtained: Yup.number().required(t('The mark obtained field is required')).nullable(false),
            subject_total: Yup.number().required(t('The subject total field is required')).nullable(false),

          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successProcess = () => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                setSelectedSection(null);
                setStudentList(null);
                setExams(null)
                handleCreateProjectClose();


              };

              const query = {
                student_id: _values.student_id,
                exam_id: _values.exam_id,
                exam_details_id: _values.exam_details_id,
                mark_obtained: _values.mark_obtained,
                academic_year_id: academicYear.id,
                subject_total: _values.subject_total

              }
              console.log({ query });
             
              if (editExam) {
                axios.put(`/api/result`, query)
                  .then(res => successProcess())
                  .catch(err => {
                    console.log(err)
                    handleErrorSnackbar(err)
                  })
              }
              else {
                const res = await axios.post('/api/result', query);
                console.log({ res });
                if (res.data?.success) successProcess();
                       // @ts-ignore
                else throw new Error(`${res?.response?.data?.message}`);
              }

            } catch (err) {
              showNotification(err?.response?.data?.message,'error');
              console.error("errrrrrrrrr__",err?.response?.data?.message);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
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
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>

                  {/* select class */}
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Select class')}:</b>
                    </Box>
                  </Grid>
                  <Grid

                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Autocomplete
                      id="tags-outlined"
                      options={classes?.map(i => {
                        return {
                          label: i.name,
                          id: i.id,
                          has_section: i.has_section
                        }
                      })}
                      value={selectClasses}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label={t('Select class')}
                        />
                      )}
                      onChange={handleClassSelect}
                    />

                  </Grid>

                  {
                    sections && <>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>{t('Select section')}:</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Autocomplete
                          id="tags-outlined"
                          value={selectedSection}
                          options={sections}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="filterSelectedOptions"
                              placeholder="Favorites"
                            />
                          )}
                          onChange={(e, v) => {
                            setSelectedSection(v)
                          }}
                        />

                      </Grid>
                    </>
                  }

                  {
                    studentList && <>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>{t('Select student by roll number')}:</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Autocomplete
                          id="tags-outlined"
                          options={studentList}
                          value={selectedStudent}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              error={Boolean(
                                touched?.student_id && errors?.student_id
                              )}
                              helperText={
                                touched?.student_id && errors?.student_id
                              }
                              {...params}
                              label="select student"
                              placeholder="Favorites"
                              name='student_id'
                            />
                          )}
                          onChange={(e, v) => {
                            console.log("student__", v);
                            setSelectedStudent(v)
                            if (v) {
                              setFieldValue("student_id", v.id)
                            }

                          }}
                        />

                      </Grid>
                    </>
                  }
                  {/* exam select */}
                  {
                    exams && <>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>{t('Select Exam ')}:</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Autocomplete
                          id="tags-outlined"
                          value={selectedExam}
                          options={exams}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              error={Boolean(
                                touched?.exam_id && errors?.exam_id
                              )}
                              helperText={
                                touched?.exam_id && errors?.exam_id
                              }
                              {...params}
                              label="filterSelectedOptions"
                              placeholder="Favorites"
                            />
                          )}
                          onChange={(e, v) => handleExamSelect(e, v, setFieldValue, setSelectedExam)}
                        />

                      </Grid>
                    </>
                  }
                  {
                    examSubjectList && <>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>{t('Select Exam subject ')}:</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Autocomplete
                          id="tags-outlined"
                          options={examSubjectList}
                          value={selectedExamSubject}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              error={Boolean(
                                touched?.exam_details_id && errors?.exam_details_id
                              )}
                              helperText={
                                touched?.exam_details_id && errors?.exam_details_id
                              }
                              {...params}
                              label="select exam subject"
                              placeholder="Favorites"
                            />
                          )}
                          onChange={(e, v) => {
                            setSelectedExamSubject(v)
                            if (v) {
                              setFieldValue('subject_total', v.subject_total)
                              setFieldValue("exam_details_id", v.id)
                            } else {
                              setFieldValue("exam_details_id", null)
                            }
                          }}
                        />

                      </Grid>

                      {/* obtain mark */}
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>{t('Obtained Mark')}:</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          error={Boolean(touched.mark_obtained && errors.mark_obtained)}
                          fullWidth
                          helperText={touched.mark_obtained && errors.mark_obtained}
                          name="mark_obtained"
                          placeholder={t('Mark obtained here...')}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.mark_obtained}
                          variant="outlined"
                          type='number'
                        />
                      </Grid>
                    </>
                  }

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    textAlign={{ sm: 'right' }}
                  />
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Button
                      sx={{
                        mr: 2
                      }}
                      type="submit"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      {editExam ? t('Edit Result mark entry') : t('Submit Result mark entry')}
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleCreateProjectClose}
                    >
                      {t('Cancel')}
                    </Button>
                  </Grid>

                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
