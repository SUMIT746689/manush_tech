import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, DialogTitle, DialogActions, DialogContent, Typography, TextField, CircularProgress, Autocomplete, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';


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
      <PageHeaderTitleWrapper
        name="Group"
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

                  <Grid item >

                    {/* group title */}
                    <TextFieldWrapper
                      errors={errors.title}
                      touched={touched.title}
                      label={t('Group Title')}
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.title}
                    />
                    <Grid p={0.5}></Grid>
                    {/* select Class */}
                    <AutoCompleteWrapper
                      label="Class"
                      placeholder="select class name..."
                      minWidth="100%"
                      disableClearable
                      disablePortal
                      value={classes.find(cls => cls.value === values.class_id) || null}
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
                      handleChange={(event, value) => {
                        if (value) {
                          setFieldValue('class_id', value?.value)
                        }
                      }}
                    />

                  </Grid>

                </DialogContent>

                <DialogActionWrapper
                  title="Group"
                  handleCreateClassClose={handleCreateClassClose}
                  editData={editGroup}
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
