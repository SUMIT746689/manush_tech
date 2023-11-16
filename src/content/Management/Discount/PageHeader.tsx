import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
} from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

function PageHeader({ editDiscount, setEditDiscount, reFetchData, fees }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

  const typeOption = [
    {
      label: 'Percent',
      value: 'percent'
    },
    {
      label: 'Flat',
      value: 'flat'
    }]

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditDiscount(null);
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message, 'success');
    setOpen(false);
    setEditDiscount(null);
  };

  useEffect(() => {
    if (editDiscount) handleCreateClassOpen();
  }, [editDiscount]);

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      console.log("_values___", _values);

      if (editDiscount && academicYear) {
        await axios.patch(`/api/discount/${editDiscount.id}?academic_year_id=${academicYear?.id}`, _values)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(
          t('The discount updated successfully')
        );
        reFetchData();

      }
      else {
        await axios.post(`/api/discount?academic_year_id=${academicYear?.id}`, _values)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t('The discount created successfully'));
        reFetchData();
      }

    } catch (err) {
      console.error(err);
      showNotification(t('There was an error, try again later'), 'error');
      setStatus({ success: false });
      // @ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeaderTitleWrapper
        name="Discount"
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
            {t(editDiscount ? 'Edit a Discount' : 'Add new Discount')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new Discount')}
          </Typography>
        </DialogTitle>

        <Formik
          initialValues={{
            title: editDiscount?.title || undefined,
            fee_id: editDiscount?.fee_id || undefined,
            type: editDiscount?.type || undefined,
            amt: editDiscount?.amt || undefined
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('Discount title is required')),
            type: Yup.string()
              .max(255)
              .required(t('Discount type is required')),
            fee_id: Yup.number().positive().integer().required('Fee is required'),
            amt: Yup.number().positive().required('Discount amount is required'),
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
            console.log({ errors });

            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container >

                    <TextFieldWrapper
                      errors={errors.title}
                      touched={touched.title}
                      label={t('Discount title')}
                      name="title"
                      value={values.title}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />


                    <AutoCompleteWrapper
                      minWidth="100%"
                      label="Fee"
                      placeholder="select a Fee..."
                      value={fees.find((cls) => cls.value === values.fee_id) || null}
                      options={fees}
                      required={true}
                      // @ts-ignore
                      handleChange={(event, value) => {
                        setFieldValue('fee_id', value?.value || undefined);
                      }}
                    />

                    <AutoCompleteWrapper
                      minWidth="100%"
                      label="Discount type"
                      placeholder="Select Discount type..."
                      value={typeOption.find((i) => i.value === values.type) || null}
                      options={typeOption}
                      required={true}
                      // @ts-ignore
                      handleChange={(event, value) => {
                        setFieldValue('type', value.value || undefined)
                      }}
                    />
                    <TextFieldWrapper
                      errors={errors.amt}
                      touched={touched.amt}
                      label={t('Discount amount')}
                      name="amt"
                      value={values.amt}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type='number'
                    />

                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  title="Discount"
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editDiscount}
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
