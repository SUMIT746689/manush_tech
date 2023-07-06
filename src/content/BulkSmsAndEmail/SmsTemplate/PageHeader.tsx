import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';

function PageHeader({ editData, setEditData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  useEffect(() => {
    if (editData) setOpen(true);

  }, [editData])

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successResponse = (message) => {
        showNotification('sms template' + message + ' successfully');
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        reFetchData();
        handleCreateClassClose();
      };
      if (editData) {
        const res = await axios.patch(`/api/sms_templates/${editData.id}`, _values);
        successResponse('updated');
      } else {
        const res = await axios.post(`/api/sms_templates`, _values);
        successResponse('created');
      }
    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.message, 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* page head title and create button ui */}
      <PageHeaderTitleWrapper name="sms template" handleCreateClassOpen={handleCreateClassOpen} />

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        {/* dialog title */}
        <DialogTitleWrapper name={"Sms Templates"} editData={editData} />

        <Formik
          initialValues={{
            name: editData?.name || undefined,
            body: editData?.body || undefined,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The name field is required')),
            body: Yup.string()
              .max(255)
              .required(t('The body field is required'))
          })}
          onSubmit={handleFormSubmit}
        >
          {({
            errors, handleBlur, handleChange, handleSubmit,
            isSubmitting, touched, values,
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
                  <Grid container>
                    <TextFieldWrapper
                      label="Name"
                      name="name"
                      value={values.name}
                      touched={touched.name}
                      errors={errors.name}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      required={true}
                    />

                    <TextAreaWrapper
                      name="body"
                      value={values.body}
                      touched={touched.body}
                      errors={errors.body}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      required={true}
                    />

                  </Grid>
                </DialogContent>

                {/* handle cancel dilog / close / submit dialog click cancel or add button */}
                <DialogActionWrapper
                  title={'sms template'}
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editData}
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
