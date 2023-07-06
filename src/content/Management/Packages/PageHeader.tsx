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
  Button,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { NewHTTPClient } from '@/lib/HTTPClient';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({
  name,
  editData,
  seteditData,
  reFetchData
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
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
            {t(name + ' Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `All aspects related to the ${name} can be managed from this page`
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
            {t('Create ' + name)}
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
            {t(editData ? 'Edit ' + name : 'Add new ' + name)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new ' + name)}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: (editData?.title && editData.title) || '',
            price: editData?.price,
            duration: editData?.duration,
            student_count: editData?.student_count,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The title field is required')),
            price: Yup.number()
              .min(1)
              .required(t('The price field is required')),
            duration: Yup.number()
              .min(1)
              .required(t('The duration field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successResponse = (message) => {
                showNotification('package ' + message + ' successfully');
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
                reFetchData();
              };
              if (editData) {
                const res = await axios.patch(
                  `/api/packages/${editData.id}`,
                  _values
                );
                successResponse('updated');
              } else {
                // const res = await axios.post(`/api/packages`, _values);
                const [res, err] = await NewHTTPClient()
                  .SetPath('/api/packages')
                  .SetBody(_values)
                  .Post();
                if (err) {
                  showNotification(err?.response?.data?.message,'error')
                  console.log(err);
                  return;
                }
                successResponse('created');
              }
            } catch (err) {
              console.error(err);
              showNotification(err?.response?.data?.message,'error')
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
                  <Grid container spacing={1}>
                    <Grid container item>
                      <TextField
                        id="outlined-basic"
                        label="Title"
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

                    <Grid container item>
                      <TextField
                        id="outlined-basic"
                        label="Price"
                        type="number"
                        error={Boolean(touched?.price && errors?.price)}
                        fullWidth
                        helperText={touched?.price && errors?.price}
                        name="price"
                        placeholder={t(`${name} price here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.price}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid
                      container
                      // sx={{
                      //   mb: `${theme.spacing(1)}`
                      // }}
                      item
                    // xs={12}
                    // sm={8}
                    // md={9}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Duration (Day)"
                        type="number"
                        error={Boolean(touched?.duration && errors?.duration)}
                        fullWidth
                        helperText={touched?.duration && errors?.duration}
                        name="duration"
                        placeholder={t(`${name} duration here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.duration}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid
                      container
                      // sx={{
                      //   mb: `${theme.spacing(1)}`
                      // }}
                      item
                    // xs={12}
                    // sm={8}
                    // md={9}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Student Count"
                        type="number"
                        error={Boolean(touched?.student_count && errors?.student_count)}
                        fullWidth
                        helperText={touched?.student_count && errors?.student_count}
                        name="student_count"
                        placeholder={t(`student count here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.student_count}
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
                    {t(`${editData ? 'Edit Package' : 'Add new Package'}`)}
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
