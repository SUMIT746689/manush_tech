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
import Image from 'next/image';
import { FileUploadFieldWrapper } from '@/components/TextFields';

function RegistrationFirstPart({
  totalFormData,
  setTotalFormData,
  setActiveStep,
  handleCreateClassClose,
  setUsersFlag,
  student,
  onlineAdmission_id,
  handleClose
}) {
  const router = useRouter()
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const { user } = useAuth();
  const [father_photo, setFather_photo] = useState(null);
  const [mother_photo, setMother_photo] = useState(null);
  const [guardian_photo, setGuardian_photo] = useState(null);

  return (
    <>
      <Formik
        initialValues={{
          father_name: student ? (student?.student_info?.father_name || student?.father_name || '') : '',
          father_phone: student ? (student?.student_info?.father_phone || student?.father_phone || '') : '',
          father_profession: student ? (student?.student_info?.father_profession || student?.father_profession || '') : '',
          father_photo: null,
          mother_name: student ? (student?.student_info?.mother_name || student?.mother_name || '') : '',
          mother_phone: student ? (student?.student_info?.mother_phone || student?.mother_phone || '') : '',
          mother_profession: student ? (student?.student_info?.mother_profession || student?.mother_profession || '') : '',
          mother_photo: null,
          guardian_name: student ? student?.guardian_name : '',
          guardian_phone: student ? student?.guardian_phone : '',
          guardian_profession: student ? student?.guardian_profession : '',
          guardian_photo: null,
          relation_with_guardian: student ? student?.relation_with_guardian : '',
          filePathQuery: student ? student?.filePathQuery : {}
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
            console.log({ _values });

            const formData = new FormData();

            for (let i in _values) {
              if (i == 'filePathQuery') {
                formData.append(`${i}`, JSON.stringify(_values[i]));
              }
              else formData.append(`${i}`, _values[i]);
            }

            if (student && !onlineAdmission_id) {
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
                showNotification(res.data.success);
                if (onlineAdmission_id) {
                  await axios.delete(`/api/onlineAdmission/${onlineAdmission_id}`)
                  handleClose();
                }
                else router.push('/management/students/registration');
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
                    <Grid container p={1} gap={1} xs={12} sm={6} md={6}>
                      <Grid item>
                        <Image src={father_photo ? father_photo : `/api/get_file/${(student?.student_info?.father_photo || student?.filePathQuery?.father_photo_path)?.replace(/\\/g, '/')}`}
                          height={100}
                          width={100}
                          alt="Father's photo:"
                          loading='lazy'
                        />

                      </Grid>
                      <br />
                      <FileUploadFieldWrapper
                        htmlFor="father_photo"
                        label="Select Father's photo::"
                        name="father_photo"
                        value={values?.father_photo?.name || student?.student_info?.father_photo || ''}
                        handleChangeFile={(e) => {
                          if (e.target?.files?.length) {
                            const photoUrl = URL.createObjectURL(e.target.files[0]);
                            setFather_photo(photoUrl)
                            setFieldValue('father_photo', e.target.files[0])
                          }
                        }}
                        handleRemoveFile={(e) => {
                          setFather_photo(null);
                          setFieldValue('father_photo', undefined)
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
                    <Grid container p={1} gap={1} xs={12} sm={6} md={6}>

                      <Grid item>
                        <Image src={mother_photo ? mother_photo : `/api/get_file/${(student?.student_info?.mother_photo || student?.filePathQuery?.mother_photo_path)?.replace(/\\/g, '/')}`}
                          height={100}
                          width={100}
                          alt="Mother's photo:"
                          loading='lazy'
                        />

                      </Grid>
                      <br />
                      <FileUploadFieldWrapper
                        htmlFor="mother_photo"
                        label="Select Mother's photo::"
                        name="mother_photo"
                        value={values?.mother_photo?.name || student?.student_info?.mother_photo || ''}
                        handleChangeFile={(e) => {
                          if (e.target?.files?.length) {
                            const photoUrl = URL.createObjectURL(e.target.files[0]);
                            setMother_photo(photoUrl)
                            setFieldValue('mother_photo', e.target.files[0])
                          }
                        }}
                        handleRemoveFile={(e) => {
                          setMother_photo(null);
                          setFieldValue('mother_photo', undefined)
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
                    <Grid container p={1} gap={1} item xs={12} sm={6} md={6}>

                      <Grid item>
                        <Image src={guardian_photo ? guardian_photo : `/api/get_file/${(student?.guardian_photo || student?.filePathQuery?.guardian_photo_path)?.replace(/\\/g, '/')}`}
                          height={100}
                          width={100}
                          alt="Guardian's photo:"
                          loading='lazy'
                        />

                      </Grid>
                      <br />
                      <FileUploadFieldWrapper
                        htmlFor="guardian_photo"
                        label="Select Guardian's photo:"
                        name="guardian_photo"
                        value={values?.guardian_photo?.name || student?.guardian_photo || ''}
                        handleChangeFile={(e) => {
                          if (e.target?.files?.length) {
                            const photoUrl = URL.createObjectURL(e.target.files[0]);
                            setGuardian_photo(photoUrl)
                            setFieldValue('guardian_photo', e.target.files[0])
                          }
                        }}
                        handleRemoveFile={(e) => {
                          setGuardian_photo(null);
                          setFieldValue('guardian_photo', undefined)
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
