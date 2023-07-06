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
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';


function PageHeader({ editSection: editGroup, setEditSection, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();


  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (editGroup) handleCreateClassOpen();
  }, [editGroup]);

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditSection(null);
  };

  useEffect(() => {
    axios
      .get('/api/class')
      .then((res) =>
        setClasses(
          res.data?.map((i) => {
            return {
              label: i.name,
              value: i.id
            };
          })
        )
      )
      .catch((err) => console.log(err));

  }, []);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Group Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the Group can be managed from this page'
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
            {t(editGroup ? 'Edit Group' : 'Create Group')}
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
            {t(editGroup ? 'Edit a Group' : 'Add new Group')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new Group')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editGroup?.title || undefined,
            class_id: editGroup?.class_id || undefined,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The Section name field is required')),
            class_id: Yup.number().positive()
              .integer().required(t('class filed field is required')),
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              console.log("_values___", _values);

              if (editGroup) {
                axios
                  .patch(`/api/group/${editGroup.id}`, _values)
                  .then((res) => {
                    if (res.data.success) {
                      resetForm();
                      setStatus({ success: true });
                      setSubmitting(false);
                      handleCreateUserSuccess(t('The section was updated successfully'));
                      reFetchData();
                      setEditSection(null)
                    } else throw new Error('Group Updated Unsuccessfull');
                  });
              }

              else {
                axios
                  .post(`/api/group`, _values)
                  .then(() => {
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateUserSuccess(t('The group was created successfully'));
                    reFetchData();
                  });
              }


            } catch (err) {
              console.error(err);
              showNotification('There was an error, try again later', 'error')
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
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={7}>
                      <Grid container spacing={3}>

                        {/* group title */}
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(
                              touched.title && errors.title
                            )}
                            fullWidth
                            helperText={
                              touched.title && errors.title
                            }
                            label={t('Group name')}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.title}
                            variant="outlined"
                          />
                        </Grid>
                        {/* select Class */}
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            disableClearable
                            disablePortal
                            value={
                              classes.find(cls => cls.value === values.class_id) || null
                            }
                            options={classes}
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
                            onChange={(event, value) => {
                              if (value) {
                                setFieldValue('class_id', value?.value)
                              }
                            }}
                          />
                        </Grid>

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
                    {t(editGroup ? 'Edit Group' : 'Add new Group')}
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
