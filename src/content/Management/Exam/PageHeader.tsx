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
import axios from 'axios';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import { DateTimePicker } from '@mui/lab';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { useClientDataFetch } from '@/hooks/useClientFetch';

function PageHeader({ editExam, rooms, setEditExam, classes, getExam }): any {
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
  const { data } = useClientDataFetch("/api/exam_terms")
  console.log({data})

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
            j.exam_date = i.exam_date
            j.exam_room = i?.exam_room?.map(k => k.id)
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
    axios.get(`/api/subject?class_id=${class_id}`)
      .then((res) => {
        console.log('sub__', res.data);

        setSubjectList(
          res.data?.map((i) => {
            return {
              label: i.name,
              id: i.id,
              mark: 100,
              exam_date: null,
              exam_room: []
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
    showNotification(err?.response?.data?.message, 'error')
  }

  const handleFormSubmit = async (
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
        const temp = {
          id: i.id,
          mark: parseFloat(i.mark),
          exam_date: i.exam_date,
        }
        if (i?.exam_room) {
          temp['exam_room'] = i?.exam_room?.map(j => ({ id: j }))
        }
        subject_id_list.push(temp);
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
          // final_percent: checked ? _values.final_percent || editExam?.final_percent : null,
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
          final_percent: checked ? _values?.final_percent : 0
        };
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
      showNotification(err?.response?.data?.message, 'error')
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }
  const subjectLength = subject.length;

  return (
    <>

      <PageHeaderTitleWrapper
        name={"Exam"}
        handleCreateClassOpen={handleCreateProjectOpen}
      />
      <Dialog
        fullWidth
        maxWidth='md'
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
            final_percent: editExam ? editExam?.final_percent : 0,
            submit: null
          }}
          validationSchema={editExam ? null : Yup.object().shape({
            title: Yup.string().max(255).required(t('Exam title field is required')),
            class_id: Yup.number().min(1).required(t('The class field is required')),
            section_id: Yup.number().min(1).required(t('The section field is required')),
            subject_id_list: Yup.array().required(t('Subject is required')),
          })}

          onSubmit={handleFormSubmit}
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
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={0}>

                    <Grid container display="grid" gridTemplateColumns=" 1fr 1fr " columnGap={1}>
                      {/* Exam name */}
                      <TextFieldWrapper
                        name="title"
                        label="Exam Title"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errors={errors.title}
                        touched={touched.title}
                        value={values.title}
                      />

                      {/* exam term */}
                      <AutoCompleteWrapper
                        error={Boolean(touched.exam_term && errors.exam_term)}
                        helperText={touched.exam_term && errors.exam_term}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        minWidth="100%"
                        name='exam_term'
                        label="Select Exam Term"
                        placeholder="Select a exam term..."
                        options={classList}
                        value={selectedClass || classList.find((i) => i.id == editExam?.section?.class?.id) || null}
                        handleChange={(event, newValue) => handleClassSelect(event, newValue, setFieldValue)}
                      />
                    </Grid>

                    <Grid container display="grid" gridTemplateColumns=" 1fr 1fr " columnGap={1}>

                      {/* select class */}
                      <AutoCompleteWrapper
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        minWidth="100%"
                        name='class_id'
                        label="Select Class"
                        placeholder="Select class"
                        options={classList}
                        value={selectedClass || classList.find((i) => i.id == editExam?.section?.class?.id) || null}
                        handleChange={(event, newValue) => handleClassSelect(event, newValue, setFieldValue)}
                      />
                      {/* select section */}
                      {((sections && editExam?.section?.class?.has_section) || (sections && selectedClass && selectedClass?.has_section)) ?
                        <>

                          <Grid
                            item
                            justifyContent="flex-end"
                            textAlign={{ sm: 'right' }}
                          >
                            <Autocomplete
                              id="tags-outlined"
                              options={sections}
                              value={selectedSection || sections?.find((i) => i.id == editExam?.section_id) || null}
                              filterSelectedOptions
                              size='small'
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label="Section"
                                  placeholder="section a name ..."
                                  error={Boolean(
                                    touched?.section_id &&
                                    errors?.section_id
                                  )}
                                  sx={{
                                    '& fieldset': {
                                      borderRadius: 0.5
                                    }
                                  }}
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
                        :
                        <EmptyAutoCompleteWrapper
                          options={[]}
                          value={undefined}
                          label="Section"
                          placeholder="select a section ..."
                        />
                      }

                    </Grid>


                    {
                      subjectList && (
                        <>
                          <Grid
                            sx={{
                              mb: `${theme.spacing(1)}`
                            }}
                            item
                            width="100%"
                            justifyContent="flex-end"
                            textAlign={{ sm: 'right' }}
                          >
                            <Autocomplete
                              multiple
                              size="small"
                              options={subjectList}
                              value={subject}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label="Select subjects"
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
                                  sx={{
                                    '& fieldset': {
                                      borderRadius: '3px'
                                    }
                                  }}
                                />
                              )}
                              onChange={(e, v) => {
                                setSubject(v);
                                setFieldValue('subject_id_list', v);
                              }}
                            />

                            {
                              subject?.map((option, index) => (
                                <Grid container sx={{
                                  display: 'grid',
                                  gridTemplateColumns: {
                                    sm: '1fr',
                                    md: '0.6fr 1fr 2fr',
                                  },
                                  marginTop: '12px',
                                  borderBottom: {
                                    xs: subjectLength > 1 && index < subjectLength - 1 && '1px dotted red',
                                    sm: '0px'
                                  },
                                  pb: {
                                    xs: subjectLength > 1 && index < subjectLength - 1 && 2,
                                    sm: '0px'
                                  }
                                }}
                                  gap={1}

                                >
                                  <Grid item>
                                    <TextField
                                      sx={{
                                        '& fieldset': {
                                          borderRadius: '3px'
                                        },
                                        minWidth: '100%'
                                      }}
                                      size='small'
                                      key={option.label}
                                      variant="outlined"
                                      label={`Input ${option.label} mark`}
                                      value={option.mark}
                                      type="number"
                                      required
                                      onChange={(e) => {
                                        const temp = [...subject];
                                        temp[index].mark = e.target.value;
                                        console.log(temp);
                                        setSubject(temp);
                                        setFieldValue('subject_id_list', temp);
                                      }}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <DateTimePicker
                                      label="Exam Date"
                                      value={option.exam_date}
                                      onChange={(n: any) => {
                                        const temp = [...subject];
                                        temp[index].exam_date = n;
                                        console.log(temp);
                                        setSubject(temp);
                                        setFieldValue('subject_id_list', temp);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          required
                                          size="small"
                                          sx={{
                                            '& fieldset': {
                                              borderRadius: '3px'
                                            },
                                            minWidth: '100%'
                                          }}
                                          {...params}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <AutoCompleteWrapper
                                      label='Select exam room'
                                      placeholder='Select exam rooom...'
                                      options={rooms}
                                      multiple={true}
                                      value={rooms?.filter((ii) => option?.exam_room?.includes(ii.id))}
                                      handleChange={(e, v) => {
                                        if (v) {
                                          const temp = [...subject];
                                          temp[index].exam_room = v.map(i => i.id);
                                          setSubject(temp);
                                          setFieldValue('subject_id_list', temp);
                                        }
                                      }}
                                    />



                                  </Grid>
                                </Grid>
                              ))
                            }
                          </Grid>
                        </>

                      )
                    }

                    {/* Is add mark to final */}
                    {
                      subject.length > 0 &&
                      <Grid
                        container
                        display={'grid'}
                        gridTemplateColumns={'10% 90%'}
                        gap={1}
                      >
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={checked}
                          onChange={(event) => {
                            console.log(event.target.checked);

                            setChecked(event.target.checked);
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <>
                          Will this exam add to the final grade?
                        </>

                      </Grid>


                    }
                    {
                      checked && <Grid pt={2} container>
                        <TextFieldWrapper
                          errors={errors.final_percent}
                          touched={touched.final_percent}
                          name="final_percent"
                          label=" final count number in percent (100%) example: 50"
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          type='number'
                          value={values.final_percent}
                        />
                      </Grid>
                    }


                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  title="Exam"
                  editData={editExam}
                  errors={errors}
                  handleCreateClassClose={handleCreateProjectClose}
                  isSubmitting={isSubmitting}
                />
              </form>
            )
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
