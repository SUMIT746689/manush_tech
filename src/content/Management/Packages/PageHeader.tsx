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
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogActionWrapper } from '@/components/DialogWrapper';

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
      <PageHeaderTitleWrapper
        name={name}
        handleCreateClassOpen={handleCreateClassOpen}
      />

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
                  showNotification(err?.response?.data?.message, 'error')
                  console.log(err);
                  return;
                }
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


                    <TextFieldWrapper
                      errors={errors?.title}
                      touched={touched?.title}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.title}
                      label="Title"
                      name="title"
                    />

                    <TextFieldWrapper
                      errors={errors?.price}
                      touched={touched?.price}
                      label="Price"
                      name="price"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.price}
                      type='number'
                    />

                    <TextFieldWrapper
                      errors={errors?.duration}
                      touched={touched?.duration}
                      name="duration"
                      label="Duration"
                      type="number"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.duration}
                    />

                    <TextFieldWrapper
                      errors={errors?.student_count}
                      touched={touched?.student_count}
                      name="student_count"
                      label="Student Count"
                      type="number"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.student_count}
                    />

                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editData}
                  isSubmitting={isSubmitting}
                  title="Package"
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
