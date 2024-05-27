import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Image from 'next/image';
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
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { FileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';

function PageHeader({ accounts, accountsOption, editClass, setEditClass, voucher, reFetchExpense }) {
  const { t }: { t: any } = useTranslation();
  const [openAccount, setAccountOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [gateway, setGateway] = useState([])
  const [attachment, setAttachment] = useState(null)



  useEffect(() => {
    if (editClass) handleCreateAccountOpen();
  }, [editClass]);

  const handleCreateAccountOpen = () => {
    setAccountOpen(true);
  };


  const handleCreateClassClose = () => {
    setAttachment(null)
    setAccountOpen(false);
    setEditClass(null);

  };


  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    setAccountOpen(false);
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const formData = new FormData();
      for (const index in _values) {
        _values[index] && formData.append(index, _values[index])
      }
      await axios.post(`/api/transaction/expense`, formData)
      resetForm();
      setAttachment(null)
      setStatus({ success: true });
      setSubmitting(false);
      handleCreateUserSuccess(t('The expense was created successfully'));
      reFetchExpense()
    } catch (err) {
      console.error(err);
      showNotification(`${err?.response?.data?.message}`, 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };
  return (
    <>
      <PageHeaderTitleWrapper
        handleCreateClassOpen={handleCreateAccountOpen}
        name="Voucher Expense"
      />

      <Dialog
        fullWidth
        maxWidth='md'
        open={openAccount}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add new expense')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new expense')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            account_id: undefined,
            voucher_id: undefined,
            payment_method_id: undefined,
            Ref: undefined,
            transID: undefined,
            amount: undefined,
            created_at: new Date(),

            description: undefined,
            attachment: undefined,
          }}
          validationSchema={Yup.object().shape({
            amount: Yup.number().required(t('Expense amount is required')),
            voucher_id: Yup.number().required(t('Voucher is required')),
            account_id: Yup.number().required(t('Account is required')),
            payment_method_id: Yup.number().required(t('Payment method is required')),

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
            console.log("values__", values);

            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid display={'grid'} gridTemplateColumns={'50% 50%'} gap={2} spacing={1}>

                    <AutoCompleteWrapper
                      minWidth={'100%'}
                      options={accountsOption}
                      value={accountsOption.find((i) => i.id === values.account_id) || null}
                      handleChange={(e, v) => {
                        console.log("v__", v);
                        if (v) {
                          setFieldValue('account_id', v?.id)
                          const temp = accounts?.find((i) => i.id === v?.id)?.payment_method?.map(j => ({
                            label: j.title,
                            id: j.id
                          }))
                          console.log(temp);

                          setGateway(temp)

                        }
                        else {
                          setFieldValue('account_id', undefined)
                          setGateway([])
                        }
                      }}
                      label={'Select Account'}
                      placeholder='Account...'

                    />

                    <AutoCompleteWrapper
                      minWidth={'100%'}
                      options={voucher}
                      value={voucher.find(i => i.id === values.voucher_id) || null}
                      handleChange={(e, v) => setFieldValue('voucher_id', v?.id || undefined)}
                      label={'Select voucher'}
                      placeholder='voucher...'

                    />

                    <TextFieldWrapper
                      errors={errors.amount}
                      touched={touched.amount}
                      label={t('Amount')}
                      name="amount"
                      type='number'
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.amount}
                    />

                    <AutoCompleteWrapper
                      minWidth={'100%'}
                      options={gateway}
                      value={gateway.find((i) => i.id === values.payment_method_id) || null}
                      handleChange={(e, v) => setFieldValue('payment_method_id', v?.id || undefined)}
                      label={'Select pay via'}
                      placeholder='Pay via...'
                    />
                    <Grid item container pb={1}>
                      <MobileDateTimePicker
                        label="Date"
                        inputFormat='dd/MM/yyyy hh:mm a'
                        value={values.created_at}
                        renderInput={(params) => (
                          <TextField
                            required
                            fullWidth
                            size="small"
                            name='created_at'
                            onBlur={handleBlur}
                            sx={{
                              '& fieldset': {
                                borderRadius: '3px'
                              },
                              // color:"red"
                            }}
                            {...params}
                          />
                        )}
                        onChange={(n: any) => {
                          const newValue = dayjs(n)

                          // dayjs(newValue).format('H:m:ss')
                          if (n) {
                            console.log("created_at", newValue);
                            //@ts-ignore
                            setFieldValue('created_at', newValue);

                          }
                        }}
                      />
                    </Grid>
                    <TextFieldWrapper
                      errors={errors.transID}
                      touched={touched.transID}
                      label={t('Transaction ID')}
                      name="transID"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.transID}
                    />
                    <TextFieldWrapper
                      errors={errors.Ref}
                      touched={touched.Ref}
                      label={t('Ref')}
                      name="Ref"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.Ref}
                    />
                    <Grid container >
                      {
                        attachment && <Grid item>
                          <Image src={attachment}
                            height={150}
                            width={150}
                            alt='attachment'
                            loading='lazy'
                          />

                        </Grid>
                      }
                      <br />
                      <FileUploadFieldWrapper
                        htmlFor="attachment"
                        label="Select Attachment:"
                        name="attachment"
                        value={values?.attachment?.name || ''}
                        handleChangeFile={(e) => {
                          if (e.target?.files?.length) {
                            const photoUrl = URL.createObjectURL(e.target.files[0]);
                            setAttachment(photoUrl)
                            setFieldValue('attachment', e.target.files[0])
                          }
                        }}
                        handleRemoveFile={(e) => {
                          setAttachment(null);
                          setFieldValue('attachment', undefined)
                        }}
                      />
                    </Grid>
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
                  title="Expense"
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
