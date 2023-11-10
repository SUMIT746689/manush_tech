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
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';

function PageHeader({
  editSubject,
  setEditSubject,
  reFetchSubjects,
  classList
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [selectedClass, setSelectedClass] = useState([])

  useEffect(() => {
    if (editSubject) handleCreateClassOpen();
  }, [editSubject]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setSelectedClass([])
    setEditSubject(null);
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    handleCreateClassClose()
    reFetchSubjects();
  };
  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if (editSubject) {
        await axios.patch(`/api/addtional_marking_categories/${editSubject.id}`, _values)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t(' updated successfully'));
      }
      else {
        
        await axios.post(`/api/addtional_marking_categories`, _values)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t('The addtional marking category was created successfully'));

      }

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
      <PageHeaderTitleWrapper
        handleCreateClassOpen={handleCreateClassOpen}
        name="Addtional Marking Categorie"
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
            {t(editSubject ? 'Edit Addtional Marking Categorie' : 'Add Addtional Marking Categorie ')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and edit a addtional marking categorie ')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editSubject?.title || '',
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The class name field is required')),
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
                  <Grid container spacing={1}>

                    <TextFieldWrapper
                      errors={errors.name}
                      touched={touched.name}
                      label={t('Title')}
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.name}
                    /> 
                    
                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  title={"addtional marking category "}
                  editData={editSubject}
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
