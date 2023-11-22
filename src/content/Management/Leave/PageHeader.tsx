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
import { MobileDatePicker } from '@mui/lab';
import { DialogActionWrapper, DialogWrapper } from '@/components/DialogWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { useAuth } from '@/hooks/useAuth';


function PageHeader({ reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const { user }: any = useAuth();
  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    reFetchData();
  };


  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {

      const res = await axios.post(`/api/leave`, _values)
      showNotification(res.data.message)
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      reFetchData();
      handleCreateClassClose();

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
      {
        <PageHeaderTitleWrapper
          name="Leave Application "
          handleCreateClassOpen={handleCreateClassOpen}
          actionButton={user?.role?.title === 'ADMIN' ? true : false}
        />
      }

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
            {t('Leave Application')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to apply a new leave')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            from_date: new Date(),
            to_date: new Date(),
            description: undefined,
            Leave_type: undefined
          }}
          validationSchema={Yup.object().shape({
            from_date: Yup.date().required(t('The From date field is required')),
            to_date: Yup.date()
              .required(t('The To date field is required')),
            Leave_type: Yup.string()
              .required(t('Leave type field is required')),
            description: Yup.string()
              .max(255)
              .required(t('The Description field is required'))
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
                    <Grid item xs={12}>
                      <Grid display={"grid"} gridTemplateColumns='1fr 1fr' pb={1} item gap={0.5}>
                        <Grid>
                          <MobileDatePicker
                            inputFormat='dd/MM/yyyy'
                            value={values.from_date}
                            label="From date"
                            onChange={(value) => setFieldValue("from_date", value, true)}
                            renderInput={
                              (params) => (
                                <TextField
                                  fullWidth
                                  size='small'
                                  error={Boolean(touched.from_date && errors.from_date)}
                                  helperText={touched.from_date && errors.from_date}
                                  name='from_date'
                                  sx={{
                                    [`& fieldset`]: {
                                      borderRadius: 0.6,
                                    }
                                  }}
                                  {...params}
                                />
                              )
                            }

                          />

                        </Grid>
                        <Grid>
                          <MobileDatePicker
                            label="To Date"
                            inputFormat='dd/MM/yyyy'
                            value={values.to_date}
                            onChange={(value) => setFieldValue("to_date", value, true)}
                            renderInput={
                              (params) =>
                                <TextField
                                  fullWidth
                                  size='small'
                                  name='to_date'
                                  sx={{
                                    [`& fieldset`]: {
                                      borderRadius: 0.6,
                                    }
                                  }}
                                  {...params}
                                />}

                          />
                        </Grid>
                      </Grid>

                    </Grid>

                    <AutoCompleteWrapper
                      minWidth="100%"
                      label={t('Leave type')}
                      placeholder={t('Type...')}
                      required
                      limitTags={2}
                      options={['sick', 'casual', 'maternity']}
                      error={Boolean(touched.Leave_type && errors.Leave_type)}
                      helperText={touched.Leave_type && errors.Leave_type}
                      value={values.Leave_type}
                      handleChange={(e, v) => setFieldValue("Leave_type", v ? v : undefined)}
                    />

                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.description && errors.description)}
                        fullWidth
                        margin="normal"
                        helperText={touched.description && errors.description}
                        label={t('Leave reason Description')}
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.description}
                        variant="outlined"
                        minRows={4}
                        maxRows={5}
                        multiline
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  titleFront="+"
                  title="Submit"
                  editData={undefined}
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
