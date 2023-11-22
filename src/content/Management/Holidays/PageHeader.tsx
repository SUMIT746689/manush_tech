import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

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
  Button,
  useTheme
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { MobileDatePicker } from '@mui/lab';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { useAuth } from '@/hooks/useAuth';

function PageHeader({ contentPermission, editData, seteditData, reFetchData }) {

  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const theme = useTheme();
  const { user }: any = useAuth()

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

  const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    try {
      const successResponse = (message) => {
        showNotification('successfully ' + message);
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess();
        reFetchData();
      };
      if (editData) {
        const res = await axios.patch(`/api/holidays/${editData.id}`, _values);
        successResponse('edited');
      } else {
        const res = await axios.post(`/api/holidays`, _values);
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
  }
  return (
    <>
      <PageHeaderTitleWrapper
        name={t('Holidays')}
        handleCreateClassOpen={handleCreateClassOpen}
        actionButton={user?.role?.title !== 'ADMIN' ? true : false}
      />

      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCreateClassClose}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('Add new Holiday')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new holiday')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: (editData?.title && editData?.title) || '',
            date: (editData?.date && editData?.date) || null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(225).required(t('The title is required')),
            date: Yup.date().required(t('The date is required'))
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {/* <Grid
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
                        placeholder={t('Holiday title here...')}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        variant="outlined"
                      />
                    </Grid> */}

                    <TextFieldWrapper
                      errors={errors.title}
                      touched={touched.title}
                      name="title"
                      label={t('Holiday Title')}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.title}

                    />

                    <Grid item width="100%">
                      <MobileDatePicker
                        inputFormat='dd/MM/yyyy'
                        value={values?.date}
                        onChange={(value) => setFieldValue('date', value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            size='small'
                            sx={{

                              [`& fieldset`]: {
                                borderRadius: 0.6,
                              }
                            }}
                            label="Date"
                            name="date"
                            error={Boolean(touched?.date && errors?.date)}
                            helperText={touched?.date && errors?.date}
                          />
                        )}
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
                    {t(`${editData ? 'Edit Holiday' : 'Add Holiday'}`)}
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
