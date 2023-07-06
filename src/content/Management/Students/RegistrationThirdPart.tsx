import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { Dayjs } from 'dayjs';
import {
  Grid,
  DialogActions,
  DialogContent,
  Zoom,
  TextField,
  CircularProgress,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import useNotistick from '@/hooks/useNotistick';

function RegistrationFirstPart({
  totalFormData,
  setTotalFormData,
  setActiveStep,
  handleCreateClassClose,
  setUsersFlag,
  student,
}) {
  const router = useRouter()
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const { user } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          father_name: student ? student?.student_info?.father_name : '',
          father_phone: student ? student?.student_info?.father_phone : '',
          father_profession: student ? student?.student_info?.father_profession : '',
          father_photo: null,
          mother_name: student ? student?.student_info?.mother_name : '',
          mother_phone: student ? student?.student_info?.mother_phone : '',
          mother_profession: student ? student?.student_info?.mother_profession : '',
          mother_photo: null,
          guardian_name: student ? student?.guardian_name : '',
          guardian_phone: student ? student?.guardian_phone : '',
          guardian_profession: student ? student?.guardian_profession : '',
          guardian_photo: null,
          relation_with_guardian: student ? student?.relation_with_guardian : ''
        }}
        validationSchema={Yup.object().shape({
          father_name: Yup.string().max(255).nullable(true)
        })}
        onSubmit={async (
          _values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            _values = {
              ..._values,
              // @ts-ignore
              ...totalFormData,
              school_id: user?.school_id
            };

            const formData = new FormData();

            for (let i in _values) {
              formData.append(`${i}`, _values[i]);
            }

            if (student) {
              const res = await axios.patch(`/api/student/${router.query.id}`, formData)
              if (res.data.success) {
                resetForm();
                setTotalFormData({})
                setStatus({ success: true });
                setSubmitting(false);
                setUsersFlag(true);
                setActiveStep(0);
                showNotification('Student updated Successfully');
                router.push('/management/students');
                // axios.get(`/api/student/${router.query.id}`)
                //   .then(res => {
                //     console.log("single__", res.data);

                //     setStudent(res.data)
                //   })
                //   .catch(err => {
                //     showNotification(err?.response?.data?.message, 'error')
                //   })
              }
            }
            else {
              const res = await axios.post(`/api/student`, formData)

              if (res.data.success) {
                resetForm();
                setTotalFormData({})
                setStatus({ success: true });
                setSubmitting(false);
                setUsersFlag(true);
                setActiveStep(0);
                showNotification('Successfully student registration completed');
              }
            }


          } catch (err) {
            console.log(err);
            showNotification(err.response?.data?.message, 'error');
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

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container>
                  <Grid container item spacing={1}>
                    {/* father_name */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.father_name && errors.father_name
                        )}
                        fullWidth
                        margin="normal"
                        helperText={touched.father_name && errors.father_name}
                        label={t('Father name')}
                        name="father_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.father_name}
                        variant="outlined"
                      />
                    </Grid>
                    {/* father_phone */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.father_phone && errors.father_phone
                        )}
                        fullWidth
                        margin="normal"
                        helperText={touched.father_phone && errors.father_phone}
                        label={t('father phone number')}
                        name="father_phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.father_phone}
                        variant="outlined"
                      />
                    </Grid>
                    {/* father_profession */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.father_profession && errors.father_profession
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.father_profession && errors.father_profession
                        }
                        label={t('father Profession')}
                        name="father_profession"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.father_profession}
                        variant="outlined"
                      />
                    </Grid>
                    {/* father_photo */}
                    <Grid item xs={12} sm={6} md={6}>
                      <label htmlFor="student_photo">Father photo:</label> <br />
                      <input
                        accept="image/*"
                        type="file"
                        name="father_photo"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setFieldValue('father_photo', e.target.files[0]);
                        }}
                      />
                    </Grid>
                    {/* mather_name */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.mother_name && errors.mother_name
                        )}
                        fullWidth
                        margin="normal"
                        helperText={touched.father_name && errors.mother_name}
                        label={t('Mother name')}
                        name="mother_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.mother_name}
                        variant="outlined"
                      />
                    </Grid>
                    {/* mather_phone */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.mother_phone && errors.mother_phone
                        )}
                        fullWidth
                        margin="normal"
                        helperText={touched.mother_phone && errors.mother_phone}
                        label={t('Mother phone number')}
                        name="mother_phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.mother_phone}
                        variant="outlined"
                      />
                    </Grid>
                    {/* mather_profession */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.mother_profession && errors.mother_profession
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.mother_profession && errors.mother_profession
                        }
                        label={t('Mother profession')}
                        name="mother_profession"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.mother_profession}
                        variant="outlined"
                      />
                    </Grid>
                    {/* mather_photo */}
                    <Grid item xs={12} sm={6} md={6}>
                      <label htmlFor="mother_photo">Mather photo:</label> <br />
                      <input
                        accept="image/*"
                        type="file"
                        name="mother_photo"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setFieldValue('mother_photo', e.target.files[0]);
                        }}
                      />
                    </Grid>
                    {/* guardian_name */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.guardian_name && errors.guardian_name
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.guardian_name && errors.guardian_name
                        }
                        label={t('Guardian name')}
                        name="guardian_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.guardian_name}
                        variant="outlined"
                      />
                    </Grid>
                    {/* guardian_phone */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.guardian_phone && errors.guardian_phone
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.guardian_phone && errors.guardian_phone
                        }
                        label={t('Guardian phone')}
                        name="guardian_phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.guardian_phone}
                        variant="outlined"
                      />
                    </Grid>
                    {/* guardian_profession */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.guardian_profession &&
                          errors.guardian_profession
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.guardian_profession &&
                          errors.guardian_profession
                        }
                        label={t('Guardian profession')}
                        name="guardian_profession"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.guardian_profession}
                        variant="outlined"
                      />
                    </Grid>
                    {/* guardian_photo */}
                    <Grid item xs={12} sm={6} md={6}>
                      <label htmlFor="guardian_photo">Guardian photo:</label> <br />
                      <input
                        accept="image/*"
                        type="file"
                        name="guardian_photo"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setFieldValue('guardian_photo', e.target.files[0]);
                        }}
                      />
                    </Grid>
                    {/* relation_with_guardian */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        size="small"
                        sx={{
                          '& fieldset': {
                            borderRadius: '3px'
                          }
                        }}
                        error={Boolean(
                          touched.relation_with_guardian &&
                          errors.relation_with_guardian
                        )}
                        fullWidth
                        margin="normal"
                        helperText={
                          touched.relation_with_guardian &&
                          errors.relation_with_guardian
                        }
                        label={t('Relation with guardian')}
                        name="relation_with_guardian"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.relation_with_guardian}
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
                {/* <Button
                  color="warning"
                  variant="contained"
                  onClick={() => setActiveStep(1)}
                >
                  {t('<< Previous')}
                </Button> */}
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  // @ts-ignore
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Submit')}
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
