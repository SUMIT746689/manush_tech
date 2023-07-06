import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { MobileDatePicker } from '@mui/lab';
import useNotistick from '@/hooks/useNotistick';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';


function PageHeader({
  name,
  editData,
  seteditData,
  academicYearsData,
  classData,
  reFetchData
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  useEffect(() => {
    if (editData) handleCreateClassOpen();
  }, [editData]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    seteditData(null);
  };

  const handleCreateUserSuccess = () => {
    seteditData(null);
    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Fees Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the fees can be managed from this page'
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateClassOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create fees')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(editData ? 'Edit fees' : 'Add new fees')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new fees')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editData?.title || undefined,
            amount: editData?.amount || undefined,
            school_id: user?.school_id || undefined,
            last_date: editData?.last_date || null,
            _for: editData?.for || undefined,
            academic_year_id: editData?.academic_year_id || academicYear?.id || undefined,
            class_id: editData?.class_id || undefined,
            late_fee: editData?.late_fee || undefined,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The title field is required')),
            amount: Yup.number()
              .min(1)
              .required(t('The amount code field is required')),
            school_id: Yup.number()
              .min(1)
              .required(t('The school id is required')),
            last_date: Yup.date().required(t('Date is required')),
            academic_year_id: Yup.number()
              .min(1)
              .required(t('academic field is required')),
            class_id: Yup.number()
              .min(1)
              .required(t('class filed field is required'))
            // class_teacher_id: Yup.number().positive().integer()
            // .required(t('The class teacher field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successResponse = (message) => {
                showNotification('fees ' + message + ' successfully');
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
                reFetchData();
              };
              _values['last_date'] = new Date(_values.last_date).setHours(12,0,0,0);
              // dayjs(_values.last_date).format('YYYY-MM-DD')


              if (editData) {
                const res = await axios.patch(
                  `/api/fee/${editData.id}`,
                  _values
                );
                successResponse('updated');
              } else {
                const res = await axios.post(`/api/fee`, _values);
                successResponse('created');
              }
            } catch (err) {
              console.error(err);
              showNotification(err?.response?.data?.message, 'error')
              setStatus({ success: false });
              //@ts-ignore
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
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container>
                    {/* title  */}
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
                        <b>{t('Title')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                      item
                      xs={12}
                      sm={8}
                      md={9}
                    >
                      <TextField
                        error={Boolean(touched?.title && errors?.title)}
                        fullWidth
                        helperText={touched?.title && errors?.title}
                        name="title"
                        placeholder={t(`${name} title here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.title}
                        variant="outlined"
                      />
                    </Grid>

                    {/* fee's for which month */}
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
                        <b>{t('Fee for')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                      item
                      xs={12}
                      sm={8}
                      md={9}
                    >
                      <TextField
                        error={Boolean(touched?._for && errors?._for)}
                        fullWidth
                        helperText={touched?._for && errors?._for}
                        name="_for"
                        placeholder={t(`${name} fee for here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?._for}
                        variant="outlined"
                      />
                    </Grid>

                    {/* Class */}
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
                        <b>{t('Class')}:</b>
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
                      <Autocomplete
                        disablePortal
                        value={
                          classData.find(
                            (cls) => cls.value === values.class_id
                          ) || null
                        }
                        options={classData}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.value === value.value
                        }
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(
                              touched?.class_id && errors?.class_id
                            )}
                            fullWidth
                            helperText={touched?.class_id && errors?.class_id}
                            name="class_id"
                            {...params}
                            label={t('Select Class')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(e, value: any) => {
                          console.log({ value });
                          setFieldValue('class_id', value?.value || 0);
                        }}
                      />
                    </Grid>

                    {/* Amount */}
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
                        <b>{t('Amount')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                      item
                      xs={12}
                      sm={8}
                      md={9}
                    >
                      <TextField
                        type="number"
                        error={Boolean(touched?.amount && errors?.amount)}
                        fullWidth
                        helperText={touched?.amount && errors?.amount}
                        name="amount"
                        placeholder={t(`${name} amount here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.amount}
                        variant="outlined"
                      />
                    </Grid>
                    {/* Last Date */}
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
                        <b>{t('Last Date')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                      item
                      xs={12}
                      sm={8}
                      md={9}
                    >
                      <MobileDatePicker
                        label="Last Date"
                        inputFormat='dd/MM/yyyy'
                        value={values?.last_date}
                        onChange={(value) => {
                          console.log({ value });
                          setFieldValue('last_date', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(
                              touched?.last_date && errors?.last_date
                            )}
                            fullWidth
                            defaultValue={''}
                            helperText={touched?.last_date && errors?.last_date}
                            {...params}
                          />
                        )}
                      />
                    </Grid>
                    {/* late_fee */}
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
                        <b>{t('late Fee Fine')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                      item
                      xs={12}
                      sm={8}
                      md={9}
                    >
                      <TextField
                        type="number"
                        error={Boolean(touched?.late_fee && errors?.late_fee)}
                        fullWidth
                        helperText={touched?.late_fee && errors?.late_fee}
                        name="late_fee"
                        placeholder={t(`Late fee fine here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.late_fee}
                        variant="outlined"
                      />
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
                    //@ts-ignore
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t(`${editData ? 'Edit Fees' : 'Add new Fees'}`)}
                  </Button>
                </DialogActions>
              </form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
