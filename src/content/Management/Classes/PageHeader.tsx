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
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({ editClass, setEditClass, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });

  useEffect(() => {
    if (editClass) handleCreateClassOpen();
  }, [editClass]);

  // const handlePublicProfile = (event) => {
  //   setPublicProfile({
  //     ...publicProfile,
  //     [event.target.name]: event.target.checked
  //   });
  // };

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditClass(null);
    reFetchData();
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if (editClass)
        axios.patch(`/api/class/${editClass.id}`, _values).then((res) => {
          if (res.data.success) {
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            reFetchData();
            handleCreateUserSuccess(t('The class was updated successfully'));
          } else throw new Error('Updated Unsuccessfull');
        });
      else
        axios.post(`/api/class`, _values).then(() => {
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreateUserSuccess(t('The class was created successfully'));
          reFetchData();
        });
    } catch (err) {
      console.error(err);
      showNotification('There was an error, try again later', 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Classes Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the class can be managed from this page'
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
            {t('Create class')}
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
            {t('Add new class')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new class')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: editClass?.name || '',
            code: editClass?.code || ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The class name field is required')),
            code: Yup.string()
              .max(255)
              .required(t('The class code field is required'))
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
            values
            // setFieldValue
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label={t('Class name')}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.code && errors.code)}
                        fullWidth
                        margin="normal"
                        helperText={touched.code && errors.code}
                        label={t('class code')}
                        name="code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.code}
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
                    {t(editClass ? 'Edit Class' : 'Add new class')}
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
