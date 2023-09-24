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

function PageHeader({ VoucherTypes, editVoucher, setEditVoucher, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  useEffect(() => {
    if (editVoucher) handleCreateClassOpen();
  }, [editVoucher]);

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
    setEditVoucher(null);
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

      const handleSuccess = () => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
      }
      if (editVoucher) {
        await axios.patch(`/api/voucher/${editVoucher.id}`, _values)
        handleSuccess()
        handleCreateClassClose()
        handleCreateUserSuccess(t('The voucher was edited successfully'));
      }
      else {
        await axios.post(`/api/voucher`, _values)
        handleSuccess()
        handleCreateClassClose()
        handleCreateUserSuccess(t('The voucher was created successfully'));
      }

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
        name="Voucher"
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
            {t('Add new voucher')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new voucher')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editVoucher?.title || undefined,
            type: editVoucher?.type || undefined,
            description: editVoucher?.description || undefined,
            amount: editVoucher?.amount || undefined,
            reference: editVoucher?.reference || undefined,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('Voucher title field is required')),
            type: Yup.string()
              .max(255)
              .required(t('Voucher type field is required')),
            description: Yup.string()
              .max(255)
              .required(t('Voucher description field is required')),
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
                      label={t('Voucher title')}
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.title}
                    />

                    <AutoCompleteWrapper
                      minWidth={'100%'}
                      options={VoucherTypes}
                      value={VoucherTypes.find((i) => i.value === values.type) || null}
                      handleChange={(e, v) => setFieldValue('type', v?.value || undefined)}
                      label={'Select Voucher type'}
                      placeholder='Voucher type...'

                    />

                    <TextAreaWrapper
                      errors={errors.description}
                      touched={touched.description}
                      name="description"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.description}
                    />
                    <TextFieldWrapper
                      errors={errors.amount}
                      touched={touched.amount}
                      label={t('Voucher amount')}
                      name="amount"
                      type='number'
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.amount}
                    />
                    <TextFieldWrapper
                      errors={errors.reference}
                      touched={touched.reference}
                      label={t('Reference')}
                      name="reference"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.reference}
                    />

                  </Grid>
                </DialogContent>

                <DialogActionWrapper
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editVoucher}
                  title="Voucher"
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
