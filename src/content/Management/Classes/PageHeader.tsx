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
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { TextFieldWrapper } from '@/components/TextFields';

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
      <PageHeaderTitleWrapper
        handleCreateClassOpen={handleCreateClassOpen}
        name="Class"
      />


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


                    <TextFieldWrapper
                      errors={errors.name}
                      touched={touched.name}
                      label={t('Class name')}
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.name}
                    />

                    <TextFieldWrapper
                      errors={errors.code}
                      touched={touched.code}
                      label={t('Class code')}
                      name="code"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.code}
                    />
                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editClass}
                  title="Class"
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
