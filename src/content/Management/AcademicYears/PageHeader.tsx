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
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { TextFieldWrapper } from '@/components/TextFields';


function PageHeader({ editData, seteditData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { showNotification } = useNotistick();
  useEffect(() => {
    if (editData) handleCreateClassOpen();
  }, [editData]);

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });

  const handlePublicProfile = (event) => {
    setPublicProfile({
      ...publicProfile,
      [event.target.name]: event.target.checked
    });
  };

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
      <PageHeaderTitleWrapper
        name="Academic Year"
        handleCreateClassOpen={handleCreateClassOpen}
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
            {t('Add new Academic Year')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a academic year')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editData?.title && editData.title,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The title field is required'))
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
                  `/api/academic_years/${editData.id}`,
                  _values
                );
                successResponse('updated academic year');
              } else {
                const res = await axios.post(`/api/academic_years`, _values);
                successResponse('created academic year');
              }
            } catch (err) {
              console.error(err);

              setStatus({ success: false });
              //@ts-ignore
              setErrors({ submit: err.message });
              setSubmitting(false);

              // showNotification(err.message,'error')
              showNotification(err?.response?.data?.message, 'error')
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
            values
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

                    <TextFieldWrapper
                      name="title"
                      errors={errors?.title}
                      touched={touched?.title}
                      label={t(`Title`)}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.title}
                    />

                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  title="Academic Year"
                  handleCreateClassClose={handleCreateClassClose}
                  editData={editData}
                  errors={errors}
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
