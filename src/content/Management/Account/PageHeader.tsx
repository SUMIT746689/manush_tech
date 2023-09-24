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
  Switch,
  Checkbox
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { TimePickerWrapper } from '@/components/DatePickerWrapper';
import { CheckBox } from '@mui/icons-material';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';

function PageHeader({ accounts, editClass, setEditClass, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [openAccount, setAccountOpen] = useState(false);
  const [openGateway, setOpenGateway] = useState(false);
  const { showNotification } = useNotistick();

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });

  useEffect(() => {
    if (editClass) handleCreateAccountOpen();
  }, [editClass]);

  // const handlePublicProfile = (event) => {
  //   setPublicProfile({
  //     ...publicProfile,
  //     [event.target.name]: event.target.checked
  //   });
  // };

  const handleCreateAccountOpen = () => {
    setAccountOpen(true);
  };
  const handleCreateGatewayOpen = () => {
    setOpenGateway(true);
  };

  const handleCreateClassClose = () => {
    setAccountOpen(false);
    setEditClass(null);
    reFetchData();
  };
  const handleCreateGatewayClose = () => {
    setOpenGateway(false);
    reFetchData();
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    setAccountOpen(false);
  };
  const handleCreateGatewaySuccess = (message) => {
    showNotification(message);
    setOpenGateway(false);
  };

  const handleGateWaySubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {

      await axios.post(`/api/account/gateway`, _values)
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      handleCreateGatewaySuccess(t('The gateway was created successfully'));
      reFetchData();
    } catch (err) {
      console.error(err);
      showNotification('There was an error, try again later', 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };
  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {

      await axios.post(`/api/account`, _values)
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      handleCreateUserSuccess(t('The account was created successfully'));
      reFetchData();
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
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom textTransform="capitalize">
            {t('Account')}
          </Typography>
          <Typography variant="subtitle2" textTransform={"initial"}>
            {t(`All aspects of Account can be managed from this page`)}
          </Typography>
        </Grid>

        <Grid sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: 'auto',
            md: 'auto  auto'
          },
          gap: {
            md: 3,
            sm: 1
          },
          width: {
            md: '40%',
            xs: '100%'
          },
        }}>
          <Button
            sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 0.6, textTransform: "capitalize" }}
            onClick={handleCreateAccountOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create Account')}
          </Button>
          <Button
            sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 0.6, textTransform: "capitalize" }}
            onClick={handleCreateGatewayOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Add gateway')}
          </Button>

          
        </Grid>


      </Grid>


      <Dialog
        fullWidth
        maxWidth="xs"
        open={openGateway}
        onClose={handleCreateGatewayOpen}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add new gateway')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new gateway')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editClass?.title || undefined,
            account_id: editClass?.account_id || undefined,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('Gate way name field is required')),
            account_id: Yup.number()
              .max(255)
              .required(t('Account field is required')),
            description: Yup.string()
          })}
          onSubmit={handleGateWaySubmit}
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
                    <AutoCompleteWrapper
                      minWidth={'100%'}
                      options={accounts}
                      value={accounts.find((i) => i.id === values.account_id) || null}
                      handleChange={(e, v) => setFieldValue('account_id', v?.id || undefined)}
                      label={'Select Account'}
                      placeholder='Account...'

                    />
                    <TextFieldWrapper
                      errors={errors.title}
                      touched={touched.title}
                      label={t('Gateway name')}
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.title}
                    />



                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  handleCreateClassClose={handleCreateGatewayClose}
                  errors={errors}
                  editData={editClass}
                  title="Gate way"
                  isSubmitting={isSubmitting}
                />

              </form>
            );
          }}
        </Formik>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openAccount}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add new account')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new account')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editClass?.title || undefined,
            account_number: editClass?.account_number || undefined,
            description: editClass?.description || undefined,
            balance: 0,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('Account name field is required')),
            account_number: Yup.string()
              .max(255)
              .required(t('Account number field is required')),
            description: Yup.string()
              .max(255)
              .required(t('Account description field is required')),
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
                      errors={errors.title}
                      touched={touched.title}
                      label={t('Account name')}
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.title}
                    />

                    <TextFieldWrapper
                      errors={errors.account_number}
                      touched={touched.account_number}
                      label={t('Account number')}
                      name="account_number"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.account_number}
                    />
                    <TextFieldWrapper
                      errors={errors.balance}
                      touched={touched.balance}
                      label={t('Account balance')}
                      name="balance"
                      type='number'
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.balance}
                    />
                    <TextAreaWrapper
                      errors={errors.description}
                      touched={touched.description}
                      name="description"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.description}
                    />

                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editClass}
                  title="Account"
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
