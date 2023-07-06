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
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({
  editSubject,
  setEditSubject,
  reFetchSubjects,
  classList
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  useEffect(() => {
    if (editSubject) handleCreateClassOpen();
  }, [editSubject]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditSubject(null);
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    setOpen(false);
    reFetchSubjects();
  };
  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if (editSubject)
        axios.patch(`/api/subject/${editSubject.id}`, _values).then(() => {
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreateUserSuccess(t('The subject was updated successfully'));
        });
      else
        axios.post(`/api/subject`, _values).then(() => {
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreateUserSuccess(t('The subject was created successfully'));
        });
      // await wait(1000);
    } catch (err) {
      console.error(err);
      showNotification(t('There was an error, try again'), 'error');
      setStatus({ success: false });
      // @ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Subject Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the app users can be managed from this page'
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
            {t(editSubject ? 'Edit Subject' : 'Create Subject')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(editSubject ? 'Edit Subject' : 'Add new Subject')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and edit a subject')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: editSubject?.name || '',
            class_id: editSubject?.class_id || null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The class name field is required')),

            class_id: Yup.number()
              .positive()
              .integer()
              .required(t('The class field is required'))
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
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label={t('Subject name')}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        disablePortal
                        value={
                          classList.find(
                            (cls) => cls.value === values.class_id
                          ) || null
                        }
                        options={classList}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Select class')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(event, value) =>
                          setFieldValue('class_id', value?.value || null)
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
                    // @ts-ignore
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t(editSubject ? 'Edit Subject' : 'Add New Subject')}
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
