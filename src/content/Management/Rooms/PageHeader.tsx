import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Grid, Dialog, DialogTitle, DialogContent, Box, Typography, TextField, CircularProgress, Button, useTheme } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { TextFieldWrapper } from '@/components/TextFields';


function PageHeader({ editRooms, setEditRooms, reFetchData, schoolData }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const theme = useTheme();


  useEffect(() => {
    if (editRooms) {
      handleCreateProjectOpen();
    }
  }, [editRooms]);

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
    setEditRooms(null);
  };

  const handleCreateProjectSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };

  const handleSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successProcess = (message) => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateProjectSuccess(message);
        reFetchData();
      };
      if (editRooms) {
        const res = await axios.patch(
          `/api/rooms/${editRooms.id}`,
          _values
        );
        if (res.data?.success) successProcess(t('A room has been updated successfully'));
        else throw new Error('edit room failed');
      } else {
        const res = await axios.post('/api/rooms', _values);
        if (res.data?.success) successProcess(t('A room has been created successfully'));
        else throw new Error('created room failed');
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeaderTitleWrapper
        name="Room"
        handleCreateClassOpen={handleCreateProjectOpen}
      />
      
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {editRooms ? t('Edit room') : t('Create new room')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Use this dialog window to ${editRooms ? 'Edit ' : 'add a new'
              } room`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: editRooms?.name ? editRooms.name : '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The name field is required'))
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
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>

                  <TextFieldWrapper
                    errors={errors.name}
                    touched={touched.name}
                    name="name"
                    label={t('Room Name')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.name}
                  />

                </Grid>
              </DialogContent>

              <DialogActionWrapper
                title="Room"
                editData={editRooms}
                errors={errors}
                handleCreateClassClose={handleCreateProjectClose}
                isSubmitting={isSubmitting}
              />
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
