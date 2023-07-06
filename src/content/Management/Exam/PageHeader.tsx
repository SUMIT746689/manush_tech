import { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button,
  useTheme,
  Autocomplete,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({ editExam, setEditExam, classes, getExam }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotistick();
  const [subject, setSubject] = useState([]);
  const [subjectList, setSubjectList] = useState(null);
  const [sections, setSections] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [checked, setChecked] = useState(false);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [classList, setClassList] = useState([]);


  useEffect(() => {
    setClassList(classes?.map(i => {
      return {
        label: i.name,
        id: i.id,
        has_section: i.has_section
      }
    }))

  }, [classes])

  useEffect(() => {
    console.log('editExam__', editExam);
    if (editExam) {
      try {
        gettingSubject(editExam?.section?.class?.id);

        const targetClass = classes?.find(i => i.id == editExam?.section?.class?.id)
        setSections(targetClass?.sections?.map((i) => {
          return {
            label: i.name,
            id: i.id
          };
        }))
        setChecked(editExam.final_percent ? true : false)
        handleCreateProjectOpen();
      } catch (err) {
        console.log(err);
      }
    }
  }, [editExam]);


  useEffect(() => {
    if (editExam) {

      let temp = [];
      for (const i of editExam?.exam_details) {
        for (const j of subjectList) {
          if (j.id == i.subject?.id) {
            j.mark = i.subject_total
            temp.push(j);
            break;
          }
        }
      }
      console.log("setsubject__", temp);

      setSubject(temp);
    }
  }, [editExam && subjectList]);

  useEffect(() => {
    if (!editExam && subjectList) {
      setSubject(subjectList)
    }
  }, [subjectList])

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setSections(null);
    setSubject([]);
    setSubjectList(null);
    setEditExam(null);
    setChecked(false)
    setSelectedClass(null)
    setSelectedSection(null)
    setOpen(false);
  };

  const handleCreateProjectSuccess = (message: string) => {
    showNotification(message);
    setOpen(false);
  };

  const gettingSubject = (class_id) => {
    axios
      .get(`/api/subject?class_id=${class_id}`)
      .then((res) => {
        console.log('sub__', res.data);

        setSubjectList(
          res.data?.map((i) => {
            return {
              label: i.name,
              id: i.id,
              mark: 0
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gettingSections = (class_id, setFieldValue) => {
    const targetClass = classes?.find(i => i.id == class_id)

    if (targetClass) {
      if (targetClass.has_section == false) {
        setFieldValue('section_id', targetClass.sections[0].id);

      } else {
        setSections(targetClass?.sections?.map((i) => {
          return {
            label: i.name,
            id: i.id
          };
        }))
      }
    }

  };

  const handleClassSelect = (event, newValue, setFieldValue) => {
    setSelectedClass(newValue)
    console.log("class changed__");
    setFieldValue('section_id', undefined);

    setSelectedSection(null)
    if (newValue) {
      console.log(newValue);
      setFieldValue('class_id', newValue?.id);
      gettingSections(newValue?.id, setFieldValue);
      gettingSubject(newValue?.id);
    } else {
      setFieldValue('class_id', undefined);
    }
  };

  const handleErrorSnackbar = (err) => {
    showNotification(err?.response?.data?.message,'error')
  }
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Exams')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your Exams')}
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
            {t('Create new exam')}
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
            {t(`${editExam ? 'Edit exam' : 'Create new exam'}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add a new exam')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            exam_id: editExam ? editExam.id : undefined,
            title: editExam ? editExam.title : '',
            class_id: editExam ? editExam?.section?.class?.id : undefined,
            section_id: editExam ? editExam?.editExam?.section?.id : undefined,
            subject_id_list: editExam ? subject : [],
            final_percent: editExam ? editExam?.final_percent : null,
            submit: null
          }}
          validationSchema={editExam ? null : Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('Exam title field is required')),
            class_id: Yup.number().min(1).required(t('The class field is required')),
            section_id: Yup.number().min(1).required(t('The section field is required')),
            subject_id_list: Yup.array().required(t('Subject is required'))
          })}

          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successProcess = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess(message);
                handleCreateProjectClose();
              };

              let subject_id_list = [];
              for (const i of subject) {
                subject_id_list.push({ id: i.id, mark: parseFloat(i.mark) });
              }
              let query = {};
              if (editExam) {
                query = {
                  exam_id: _values.exam_id,
                  section_id: _values.section_id || editExam?.section_id,
                  title: _values.title,
                  class_id: _values.class_id || editExam?.section?.class?.id,
                  school_id: user.school_id,
                  academic_year_id: academicYear?.id,
                  subject_id_list: subject_id_list,
                  final_percent: checked ? _values.final_percent || editExam?.final_percent : 0,
                };
              } else {
                query = {
                  section_id: _values.section_id,
                  title: _values.title,
                  class_id: _values.class_id,
                  school_id: user.school_id,
                  academic_year_id: academicYear?.id,
                  subject_id_list: subject_id_list,
                  final_percent: _values?.final_percent || null
                };
                if (_values.final_percent) {
                  query["final_percent"] = _values.final_percent
                }
              }

              if (editExam) {
                axios
                  .put(`/api/exam`, query)
                  .then((res) => {
                    console.log(res);

                    successProcess(t(`${res?.data?.message ? res?.data?.message : 'A new Exam has been updated successfully'}`))
                    getExam()
                  })
                  .catch((err) => {
                    console.log(err)
                    handleErrorSnackbar(err)
                  });
              } else {
                const res = await axios.post('/api/exam', query);
                if (res.data?.success) {
                  successProcess(t('A new Exam has been created successfully'))
                  getExam()
                }
                else {
                  throw new Error('created Exam failed');
                }
              }
            } catch (err) {
              console.error(err);
              showNotification(err?.response?.data?.message,'error')
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
          }) => {
            // console.log(errors);

            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={0}>
                    {/* Exam name */}
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
                        <b>{t('Exam Name')}:</b>
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
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        name="title"
                        placeholder={t('Exam title here...')}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        variant="outlined"
                      />
                    </Grid>

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
                        disablePortal
                        options={classList}

                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            error={Boolean(
                              touched?.class_id &&
                              errors?.class_id
                            )}
                            helperText={
                              touched?.class_id &&
                              errors?.class_id
                            }
                            name='class_id'
                            {...params}
                            label={t('Select class')}
                          />
                        )}
                        value={selectedClass || classList.find((i) => i.id == editExam?.section?.class?.id) || null}
                        onChange={(event, newValue) =>
                          handleClassSelect(event, newValue, setFieldValue)
                        }
                      />
                    </Grid>

                    {/* select section */}
                    {((sections && editExam?.section?.class?.has_section) || (sections && selectedClass && selectedClass?.has_section)) && (
                      <>
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
                            options={sections}
                            value={selectedSection || sections?.find((i) => i.id == editExam?.section_id) || null}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="select section"
                                placeholder="section Name"
                                error={Boolean(
                                  touched?.section_id &&
                                  errors?.section_id
                                )}
                                helperText={
                                  touched?.section_id &&
                                  errors?.section_id
                                }
                                required
                                onBlur={handleBlur}
                                name='section_id'
                              />
                            )}
                            onChange={(e, v) => {
                              setSelectedSection(v)
                              if (v) {
                                setFieldValue('section_id', v.id);
                              } else {
                                setFieldValue('section_id', undefined);
                              }
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {
                      subjectList && (
                        <>
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
                              <b>{t('select subjects')}:</b>
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
                              multiple
                              
                              options={subjectList}
                              value={subject}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="filterSelectedOptions"
                                  placeholder="selecet multiple subject"
                                  error={Boolean(
                                    touched?.subject_id_list &&
                                    errors?.subject_id_list
                                  )}
                                  helperText={
                                    touched?.subject_id_list &&
                                    errors?.subject_id_list
                                  }
                                  name='subject_id_list'
                                />
                              )}
                              onChange={(e, v) => {
                                console.log(v);
                                setSubject(v);
                                setFieldValue('subject_id_list', v);
                              }}
                            />

                            <Grid
                              sx={{
                                mb: `${theme.spacing(3)}`,
                                gap: 3,
                                marginTop: '10px'
                              }}
                              item
                              xs={12}
                              sm={8}
                              md={9}
                              justifyContent="flex-end"
                              textAlign={{ sm: 'right', md: 'left' }}
                            >
                              {
                                subject?.map((option, index) => (
                                  <TextField
                                    sx={{ m: '5px' }}
                                    key={option.label}
                                    variant="outlined"
                                    label={`Input ${option.label} mark`}
                                    value={option.mark}
                                    type="number"
                                    onChange={(e) => {
                                      const temp = [...subject];
                                      temp[index].mark = e.target.value;
                                      console.log(temp);
                                      setSubject(temp);
                                      setFieldValue('subject_id_list', temp);
                                    }}
                                  />
                                ))
                              }
                            </Grid>
                          </Grid>
                        </>

                      )}
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
                        <Checkbox
                          checked={checked}
                          onChange={(event) => {
                            console.log(event.target.checked);

                            setChecked(event.target.checked);
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
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
                      Will this exam add to the final grade?
                    </Grid>
                    {
                      checked && <>
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

                          </Box>

                        </Grid>
                        <Grid sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                          item
                          xs={12}
                          sm={8}
                          md={9}>
                          <TextField
                            error={Boolean(touched.final_percent && errors.final_percent)}
                            fullWidth
                            helperText={touched.final_percent && errors.final_percent}
                            name="final_percent"
                            placeholder={t('Input percentage that count in the final...')}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='number'
                            value={values.final_percent}
                            variant="outlined"
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
                        {editExam ? t('Edit Exams') : t('Create Exams')}
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
            )
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
