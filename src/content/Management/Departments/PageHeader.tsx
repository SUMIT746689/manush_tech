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
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Button,
  useTheme
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({ editData, seteditData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { showNotification } = useNotistick();

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
            {t('Department Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the department can be managed from this page'
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
            {t('Create Department ')}
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
            {t('Add new Department')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new Department')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: (editData?.title && editData?.title) || '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(225).required(t('The title is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
          
              const successResponse = (message) => {
                showNotification('successfully ' + message)
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
                reFetchData();
              };
              if (editData) {
                const res = await axios.patch(
                  `/api/departments?department_id=${editData.id}`,
                  _values
                );
                successResponse('edited');
              } else {
                await axios.post(`/api/departments`, _values);
                successResponse('created');
              }
            } catch (err) {
              console.error(err);
              showNotification(err?.response?.data?.message,'error')
              // showNotification(err.message,'error')
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
                        placeholder={t('Department title here...')}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
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
                    {t(`${editData ? 'Edit Departments' : 'Add Departments'}`)}
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
