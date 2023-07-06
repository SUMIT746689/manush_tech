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
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';


function PageHeader({
  setUsersFlag,
  editData,
  seteditData,
  studentData,
  feeData
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const theme = useTheme();

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
            {t('Student Fees Collection')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the app students fee collcetions can be managed from this page'
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
            {t('Collect students fees ')}
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
            {t('Add new fees')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new fees')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            student_id: editData?.student_id ? editData?.student_id : null,
            fee_id: editData?.id ? editData?.id : null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            student_id: Yup.number()
              .min(1)
              .required(t('The student is required')),

            fee_id: Yup.number().min(1).required(t('The fee is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successResponse = (message) => {
                showNotification('successfully ' + message);
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
                setUsersFlag(true);
              };
              if (editData) {
                const res = await axios.patch(
                  `/api/student_payment_collect/${editData.id}`,
                  _values
                );
                successResponse('edited');
              } else {
                const res = await axios.post(
                  `/api/student_payment_collect`,
                  _values
                );
                successResponse('created');
              }
            } catch (err) {
              console.error(err);
              showNotification(err.message,'error')
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
                  <Grid container spacing={3}>
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
                        <b>{t('Student')}:</b>
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
                        disabled={editData}
                        disablePortal
                        value={
                          studentData.find(
                            (student) => student.value === values.student_id
                          ) || values.student_id
                        }
                        options={studentData}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.value === value.value
                        }
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(
                              touched?.student_id && errors?.student_id
                            )}
                            fullWidth
                            helperText={
                              touched?.student_id && errors?.student_id
                            }
                            {...params}
                            label="Select Student"
                          />
                        )}
                        // @ts-ignore
                        onChange={(e, value: any) =>
                          setFieldValue('student_id', value?.value || null)
                        }
                      />
                    </Grid>

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
                        <b>{t('Fee')}:</b>
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
                          feeData.find((fee) => fee.value === values.fee_id) ||
                          null
                        }
                        options={feeData}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.value === value.value
                        }
                        getOptionLabel={(option) => option?.label}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched?.fee_id && errors?.fee_id)}
                            fullWidth
                            helperText={touched?.fee_id && errors?.fee_id}
                            name="fee_id"
                            label={t('Select Fee')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(e, value: any) =>
                          setFieldValue('fee_id', value?.value || null)
                        }
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
                    {t(`${editData ? 'Edit Fees' : 'Collect Fees'}`)}
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
