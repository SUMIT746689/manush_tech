import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';
import Footer from '@/components/Footer';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { verifyIsMasking } from 'utilities_api/verify';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { useEffect, useState } from 'react';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { DebounceInput } from '@/components/DebounceInput';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';


const SMSSettings = ({ schools, editData, seteditData, reFetchData }) => {
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
  const [searchValue, setSearchValue] = useState();
  const [query, setQuery] = useState();
  return (
    <>
      <PageHeaderTitleWrapper
        name="Sms Gateways"
        handleCreateClassOpen={handleCreateClassOpen}
      />
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCreateClassClose}
      >
        <Formik
          enableReinitialize
          initialValues={{
            id: editData?.id || 0,
            sms_gateway: editData?.details?.sms_gateway || '',
            sms_api_key: editData?.details?.sms_api_key || '',
            sender_id: editData?.details?.sender_id || '',
            // title: data?.data[0]?.title || 'mram',
            school: schools.find((school) => school?.id === editData?.school_id) || null,
            school_id: editData?.school_id || null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            school_id: Yup.number().required(t('The school id field is required')),
            // sms_gateway: Yup.string().max(255).required(t('The sms_gateway field is required')),
            // sms_api_key: Yup.string().max(255).required(t('The sms_api_key field is required')),
            sender_id: Yup.string().max(255).required(t('The sender_id field is required')),
          })}
          onSubmit={async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const successResponse = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
              };

              const v = {
                id: _values.id,
                school_id: _values.school_id,
                // title: _values.title,
                details: {
                  // sms_gateway: _values.sms_gateway,
                  sms_api_key: _values.sms_api_key,
                  sender_id: _values.sender_id
                }
              }
              if (editData?.id) {
                axios.patch(`/api/sms_gateways/${editData?.id}`, v)
                  .then(res => {
                    showNotification('sms information updated!');
                    seteditData(() => { })
                    reFetchData();
                    handleCreateClassClose()
                  })
                  .catch(err => {
                    handleShowErrMsg(err, showNotification)
                    console.log(err);
                  })
              } else {
                axios.post('/api/sms_gateways', v)
                  .then(res => {
                    showNotification('sms information created successfully');
                    seteditData(() => { })
                    reFetchData();
                    handleCreateClassClose()
                  })
                  .catch(err => {
                    handleShowErrMsg(err, showNotification)
                    console.log(err);

                  })
              }

            } catch (err) {
              console.error(err);

              setStatus({ success: false });
              //@ts-ignore
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            console.log({ values })
            return (
              <>

                <form onSubmit={handleSubmit}>
                  <Grid container direction={'column'} alignItems={'center'} gap={1} marginTop={3}>
                    <DialogTitle sx={{ px: 3, py: 1 }} >
                      <Typography variant="h4" gutterBottom>
                        Sms Gateway
                      </Typography>
                      <Typography variant="subtitle2">
                        {t(`Fill in the fields below to add or update sms gateway `)}
                      </Typography>
                    </DialogTitle>

                    <DialogContent dividers sx={{ minWidth: '100%', display: "grid", gap: 2 }} >
                      <Grid />
                      {/* sms_gateway */}
                      {/* <TextFieldWrapper
                          label="Sms Gateway"
                          errors={errors?.sms_gateway}
                          touched={touched?.sms_gateway}
                          name="sms_gateway"
                          // ={t(`sms_gateway here...`)}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          value={values?.sms_gateway}
                        /> */}

                      <AutoCompleteWrapper
                        minWidth="100%"
                        label={t('Select School')}
                        placeholder={t('select a school...')}
                        limitTags={2}
                        // getOptionLabel={(option) => option.id}
                        options={schools}
                        value={values.school}
                        handleChange={(e, v) => {
                          setFieldValue("school", v ? v : null);
                          setFieldValue("school_id", v ? v.id : null);
                        }}
                      />

                      {/* sms_api_key */}
                      <TextFieldWrapper
                        label="Sms Api Key"
                        errors={errors?.sms_api_key}
                        touched={touched?.sms_api_key}
                        name="sms_api_key"
                        // placeholder={t(`sms_api_key here...`)}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.sms_api_key}
                      />

                      <Grid>
                        {/* sender_id */}
                        <TextFieldWrapper
                          label="Sender Id"
                          errors={errors?.sender_id}
                          touched={touched?.sender_id}
                          name="sender_id"
                          //  placeholder={t(`sender_id here...`)}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          value={values?.sender_id}
                        />
                        {values?.sender_id && <Grid fontWeight={600}>Sms Type: <span style={{ fontSize: '15px', color: "#a21caf" }}>{verifyIsMasking(values?.sender_id) ? 'Masking' : 'Non Masking'}</span></Grid>}
                      </Grid>

                    </DialogContent>

                    <Grid ml={"auto"}>
                      <DialogActionWrapper
                        title="Sms gateways"
                        handleCreateClassClose={handleCreateClassClose}
                        editData={editData}
                        errors={errors}
                        isSubmitting={isSubmitting}
                      />
                    </Grid>

                    {/* <DialogActions sx={{
                      width: '100%',
                      justifyContent: 'center',
                      borderTop: '1px solid lightgray',
                      px: 3,
                      pt: 3
                    }}>
                      <ButtonWrapper
                        handleClick={undefined}
                        type="submit"
                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                        //@ts-ignore
                        disabled={Boolean(errors.submit) || isSubmitting}
                        variant="contained"
                      >
                        {t('Submit')}
                      </ButtonWrapper>
                    </DialogActions> */}

                  </Grid>
                </form>
              </>
            );
          }}
        </Formik >
      </Dialog>
    </>
  );
};

SMSSettings.getLayout = (page) => {
  return (
    <Authenticated requiredPermissions={['create_sms_gateway']}>
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  );
};

export default SMSSettings;