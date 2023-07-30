import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import dayjs, { Dayjs } from 'dayjs';

import {
  Grid,
  DialogActions,
  DialogContent,
  TextField,
  CircularProgress,
  Button,
} from '@mui/material';
import axios from 'axios';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useNotistick from '@/hooks/useNotistick';
import { DateTimePicker, MobileDatePicker, MobileDateTimePicker, MobileTimePicker } from '@mui/lab';

function RegistrationFirstPart({
  setTotalFormData,
  setActiveStep,
  handleCreateClassClose,
  student = null,
}) {
  console.log("heelo", student);
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  const [academicYears, setacademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setselectedClass] = useState(null);
  const [admission_date, setAdmission_date] = useState<Dayjs | null>(null);
  const [date_of_birth, setDate_of_birth] = useState<Dayjs | null>(null);
  const [sectionsForSelectedClass, setSectionsForSelectedClass] = useState([]);
  const [gender, setGender] = useState('male');


  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`/api/class/${selectedClass}`)
        .then((res) => {
          console.log(res.data);
          setSectionsForSelectedClass(res.data?.sections);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedClass]);

  useEffect(() => {
    axios
      .get('/api/academic_years')
      .then((res) =>
        setacademicYears(
          res?.data?.data?.map((i) => {
            return {
              label: i.title,
              id: i.id
            };
          }) || []
        )
      )
      .catch((err) => console.log(err));

    axios
      .get('/api/class')
      .then((res) => {
        setClasses(
          res.data?.map((i) => {
            return {
              label: i.name,
              id: i.id
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Formik
        initialValues={{
          first_name: student ? student?.student_info?.first_name : undefined,
          middle_name: student ? student?.student_info?.middle_name : '',
          last_name: student ? student?.student_info?.last_name : '',
          // section_id: null,
          // password: '',
          // confirm_password: '',
          // academic_year_id: 0,
          admission_no: student ? student?.student_info?.admission_no : '',
          admission_date: student ? student?.student_info?.admission_date : null,
          // admission_status: '',
          date_of_birth: student ? student?.student_info?.date_of_birth : null,
          gender: student ? student?.student_info?.gender : 'male',
          blood_group: student ? student?.student_info?.blood_group : '',
          religion: student ? student?.student_info?.religion : '',
          phone: student ? student?.student_info?.phone : undefined,
          email: student ? student?.student_info?.email : '',
          national_id: '',
          // roll_no: '',
          // registration_no: '',
          // discount: 0,
          student_photo: null
          // student_admission_status: '',
          // father_name: '',
          // father_phone: '',
          // father_profession: '',
          // father_photo: null,
          // mather_name: '',
          // mather_phone: '',
          // mather_profession: '',
          // mather_photo: null,
          // guardian_name: '',
          // guardian_phone: '',
          // guardian_profession: '',
          // guardian_photo: null,
          // relation_with_guardian: '',
          // student_present_address: '',
          // student_permanent_address: '',
          // previous_school: ''
        }}
        validationSchema={Yup.object().shape({
          first_name: Yup.string()
            .max(255)
            .required(t('First name field is required')),
          middle_name: Yup.string().max(255).nullable(true),
          last_name: Yup.string().max(255).nullable(true),
          admission_no: Yup.string().required(
            t('Admission number is required!')
          ),
          admission_date: Yup.date().required(t('Admission date is required!')),
          date_of_birth: Yup.date().required(t('Date of birth is required!')),
          gender: Yup.string().required(t('select a gender')),
          blood_group: Yup.string().nullable(true),
          religion: Yup.string().nullable(true),
          phone: Yup.string().required(t('Phone number is required!'))
            .min(11, 'Phone number must be greater then or equals 11 character'),
          email: Yup.string(),
          national_id: Yup.string()
        })}
        onSubmit={async (
          _values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            console.log('clicked');
            setTotalFormData((values: any) => ({ ...values, ..._values }));
            setActiveStep(1);
          } catch (err) {
            console.error(err);
            showNotification('There was an error, try again later', 'error');
            setStatus({ success: false });
            // @ts-ignore
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
          // console.log("T__values__",values);
          console.log({ errors });
          return (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container>
                  <Grid container item spacing={2}>
                    {/* first_name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        // required
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(touched.first_name && errors.first_name)}
                        fullWidth
                        helperText={touched.first_name && errors.first_name}
                        label={t('First name')}
                        name="first_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.first_name}
                        variant="outlined"
                      />
                    </Grid>
                    {/* middle_name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.middle_name && errors.middle_name
                        )}
                        fullWidth
                        helperText={touched.middle_name && errors.middle_name}
                        label={t('Middle name')}
                        name="middle_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.middle_name}
                        variant="outlined"
                      />
                    </Grid>
                    {/* last_name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(touched.last_name && errors.last_name)}
                        fullWidth
                        helperText={touched.last_name && errors.last_name}
                        label={t('Last name')}
                        name="last_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.last_name}
                        variant="outlined"
                      />
                    </Grid>

                    {/* admission_no   */}
                    <Grid item xs={12}>
                      <TextField
                        // required
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.admission_no && errors.admission_no
                        )}
                        fullWidth
                        helperText={touched.admission_no && errors.admission_no}
                        label={t('Admission no')}
                        name="admission_no"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.admission_no}
                        variant="outlined"
                      />
                    </Grid>

                    {/* admission_date */}
                    <Grid item xs={12} md={6}>

                      <MobileDateTimePicker
                        label="admission Date"
                        value={values.admission_date}
                        renderInput={(params) => (
                          <TextField
                            required
                            fullWidth
                            size="small"
                            name='admission_date'
                            onBlur={handleBlur}
                            sx={{
                              '& fieldset': {
                                borderRadius: '3px'
                              },
                              // color:"red"
                            }}
                            {...params}
                          />
                        )}
                        onChange={(n: any) => {
                          const newValue = dayjs(n)

                          // dayjs(newValue).format('H:m:ss')
                          if (n) {
                            console.log("admission_date__", newValue);
                            //@ts-ignore
                            setFieldValue('admission_date', newValue.$d);

                          }
                        }}


                      />
                      {
                        errors.admission_date && <span style={{ color: 'red' }}> Admission date are required</span>
                      }
                    </Grid>

                    {/* date_of_birth */}
                    <Grid item xs={12} md={6}>
                      <MobileDatePicker
                        label="Date of birth"
                        value={values.date_of_birth}
                        onChange={(n) => {
                          // console.log("start time__hour",newValue.$H);
                          // console.log("start time__hour",newValue.$m);
                          if (n) {
                            // setFieldValue("date_of_birth", `1970-05-02 ${newValue.$H}:${newValue.$m}:00+0000`)
                            // @ts-ignore
                            const newValue = dayjs(n)

                            // dayjs(newValue).format('H:m:ss')
                            //@ts-ignore
                            setFieldValue('date_of_birth', newValue.$d);
                            setDate_of_birth(newValue);
                            console.log(newValue);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            required
                            fullWidth
                            name='date_of_birth'
                            size="small"
                            sx={{
                              '& fieldset': {
                                borderRadius: '3px'
                              }
                            }}
                            {...params}
                          />
                        )}
                      />
                      {
                        errors.date_of_birth && <span style={{ color: 'red' }}> Date of birth are required</span>
                      }

                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Select Gender *
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="gender"
                          row
                          value={gender}
                          onChange={(event) => {
                            setGender(event.target.value);
                            setFieldValue('gender', event.target.value);
                          }}
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {/* blood_group */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.blood_group && errors.blood_group
                        )}
                        fullWidth
                        helperText={touched.blood_group && errors.blood_group}
                        label={t('blood Group')}
                        name="blood_group"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.blood_group}
                        variant="outlined"
                      />
                    </Grid>

                    {/* religion */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(touched.religion && errors.religion)}
                        fullWidth
                        helperText={touched.religion && errors.religion}
                        label={t('Religion')}
                        name="religion"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.religion}
                        variant="outlined"
                      />
                    </Grid>

                    {/* phone */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(touched.phone && errors.phone)}
                        fullWidth
                        helperText={touched.phone && errors.phone}
                        label={t('Phone')}
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        // required
                        value={values.phone}
                        variant="outlined"
                      />
                    </Grid>

                    {/* email */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label={t('email')}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>

                    {/* national_id */}
                    <Grid item xs={12} >
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.national_id && errors.national_id
                        )}
                        fullWidth
                        helperText={touched.national_id && errors.national_id}
                        label={t('Birth certificate Id')}
                        name="national_id"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.national_id}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={handleCreateClassClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  // @ts-ignore
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Next')}
                </Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </>
  );
}

export default RegistrationFirstPart;
