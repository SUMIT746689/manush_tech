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
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogActionWrapper } from '@/components/DialogWrapper';

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

  const handleSubmit = async (
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
      showNotification(err?.response?.data?.message, 'error')
      // showNotification(err.message,'error')
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }
  
  return (
    <>
      <PageHeaderTitleWrapper
        name="Department"
        handleCreateClassOpen={handleCreateClassOpen}
      />
      {/* <Grid container justifyContent="space-between" alignItems="center">
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
      </Grid> */}
      <Dialog
        fullWidth
        maxWidth="xs"
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
          onSubmit={handleSubmit}
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

                  <TextFieldWrapper
                    errors={errors.title}
                    touched={touched.title}
                    name="title"
                    label={t('Department Title ')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.title}

                  />
                </DialogContent>
                <DialogActionWrapper
                  title="Department"
                  editData={editData}
                  errors={errors}
                  handleCreateClassClose={handleCreateClassClose}
                  isSubmitting={isSubmitting}
                />
              </form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
