import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Switch, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogTitleWrapper } from '@/components/DialogWrapper';
import Footer from '@/components/Footer';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context: any) {
  let data = {};
  try {

    const refresh_token: any = serverSideAuthentication(context);
    if (!refresh_token) return { redirect: { destination: '/login' } };
    const accounts = await prisma.accounts.findMany({
      where: {
        school_id: refresh_token.school_id
      }
    })
    data['accountList'] = accounts.map(i => ({
      label: i.title,
      id: i.id
    }))
    data['credentials'] = await prisma.payment_gateway_credential.findMany({
      where: {
        school_id: refresh_token.school_id,
        account: {
          school_id: refresh_token.school_id
        }
      }
    })

  } catch (err) {
    console.log(err)
  }
  const parseJson = JSON.parse(JSON.stringify(data));

  return { props: { data: parseJson } }
}

const PaymentGatewayConfiguration = ({ data }) => {
  const { t }: { t: any } = useTranslation();
  const [rebkash, setReBkash] = useState(null)

  // useEffect(() => {
  //   setBkash(data?.credentials?.find(i => i?.title === 'bkash'))
  // }, [data])
  const bkash = data?.credentials?.find(i => i?.title === 'bkash')

  const refetch = () => {
    axios.get('/api/payment_gateway/bkash')
      .then(res => setReBkash(res.data))
      .catch(err => console.log(err))
  }
  const { showNotification } = useNotistick();

  console.log("bkash__", bkash);
  return (
    <>
      <Grid sx={{
        display: 'grid',
        // maxWidth: '70%',
        // gridTemplateColumns: {
        //   md: '1fr 1fr 1fr',
        //   sm: '1fr 1fr',
        //   xs: '1fr'
        // },
        alignItems: 'center',

        // border:'1px solid',
        minHeight: 'calc(100vh - 215px)',
        gap: 2,
        p: 2
      }}
      >
        <Formik
          // enableReinitialize
          initialValues={{
            username: rebkash?.details?.username || bkash?.details?.username || undefined,
            password: rebkash?.details?.password || bkash?.details?.password || undefined,
            app_key: rebkash?.details?.app_key || bkash?.details?.app_key || undefined,
            app_secret: rebkash?.details?.app_secret || bkash?.details?.app_secret || undefined,
            X_App_Key: rebkash?.details?.X_App_Key || bkash?.details?.X_App_Key || undefined,
            grant_token_url: rebkash?.details?.grant_token_url || bkash?.details?.grant_token_url || undefined,
            create_payment_url: rebkash?.details?.create_payment_url || bkash?.details?.create_payment_url || undefined,
            execute_payment_url: rebkash?.details?.execute_payment_url || bkash?.details?.execute_payment_url || undefined,
            account_id: rebkash?.account_id || bkash?.account_id || undefined,
            is_active: rebkash?.is_active || bkash?.is_active,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().max(255).required(t('The username field is required')),
            password: Yup.string().max(255).required(t('The password field is required')),
            app_key: Yup.string().max(255).required(t('The app key field is required')),
            app_secret: Yup.string().max(255).required(t('The app secret field is required')),
            X_App_Key: Yup.string().max(255).required(t('The X App Key field is required')),
            grant_token_url: Yup.string().max(255).required(t('The grant token url field is required')),
            create_payment_url: Yup.string().max(255).required(t('The create payment url field is required')),
            execute_payment_url: Yup.string().max(255).required(t('The execute payment url field is required')),
            account_id: Yup.number().required(t('The account field is required')),
            is_active: Yup.bool().required(t('Activation or deactivation is required')),

          })}
          onSubmit={async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const successResponse = () => {
                // resetForm();
                setStatus({ success: true });
                setSubmitting(false);
              };


              axios.post('/api/payment_gateway/bkash', _values)
                .then(res => {

                  showNotification(res.data?.message)
                  successResponse()
                  refetch()
                })
                .catch(err => {
                  showNotification('Bkash credential information update failed!', 'error')
                  console.log(err);

                })

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
            // console.log(data?.accountList?.find(i => i.id === values?.account_id));

            return (

              <form onSubmit={handleSubmit}>
                <Card sx={{
                  boxShadow: 'black',
                  mx: 'auto',
                  p: 1,

                  // border:'1px solid'
                }} >
                  <Grid container direction={'column'} alignItems={'center'} >
                    <Grid width={'100%'}>

                      <DialogTitle sx={{ py: 3, borderBottom: 1, borderColor: "lightgray" }} >
                        <Typography variant="h4" gutterBottom>
                          Bkash Credential
                        </Typography>
                        <Typography variant="subtitle2">
                          {t(`Fill in the fields below to add or update Bkash Credential `)}
                        </Typography>
                      </DialogTitle>
                    </Grid>

                    <DialogContent sx={{
                      minWidth: '100%', display: 'grid',
                      gridTemplateColumns: '1fr 1fr', gap: 2,
                    }} >



                      {/* username */}
                      <TextFieldWrapper
                        label="Username"
                        errors={errors?.username}
                        touched={touched?.username}
                        name="username"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.username}
                      />
                      {/* password */}
                      <TextFieldWrapper
                        label="Password"
                        errors={errors?.password}
                        touched={touched?.password}
                        name="password"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.password}
                      />
                      {/* app_key */}
                      <TextFieldWrapper
                        label="App key"
                        errors={errors?.app_key}
                        touched={touched?.app_key}
                        name="app_key"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.app_key}
                      />
                      {/* app_secret */}
                      <TextFieldWrapper
                        label="App secret"
                        errors={errors?.app_secret}
                        touched={touched?.app_secret}
                        name="app_secret"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.app_secret}
                      />
                      {/* app_secret */}
                      <TextFieldWrapper
                        label="X App Key"
                        errors={errors?.X_App_Key}
                        touched={touched?.X_App_Key}
                        name="X_App_Key"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.X_App_Key}
                      />
                      {/* bkash_grant_token_url */}
                      <TextFieldWrapper
                        label="Grant token url"
                        errors={errors?.grant_token_url}
                        touched={touched?.grant_token_url}
                        name="grant_token_url"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.grant_token_url}

                      />
                      {/* create_payment_url */}
                      <TextFieldWrapper
                        label="Create payment url"
                        errors={errors?.create_payment_url}
                        touched={touched?.create_payment_url}
                        name="create_payment_url"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.create_payment_url}

                      />
                      {/* execute_payment_url */}
                      <TextFieldWrapper
                        label="Execute payment url"
                        errors={errors?.execute_payment_url}
                        touched={touched?.execute_payment_url}
                        name="execute_payment_url"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?.execute_payment_url}

                      />


                      <AutoCompleteWrapper
                        minWidth="100%"
                        label={t('Assign Account')}
                        placeholder={t('Account...')}
                        required
                        limitTags={2}
                        options={data?.accountList}
                        error={Boolean(touched.account_id && errors.account_id)}
                        helperText={touched.account_id && errors.account_id}
                        value={data?.accountList?.find(i => i.id === values?.account_id)}
                        handleChange={(e, v) => setFieldValue("account_id", v?.id)}
                      />
                      <Grid display={'flex'} gap={2} alignItems={'center'}>
                        <Typography variant="h5" gutterBottom>
                          Is active?
                        </Typography>
                        <Switch sx={{ my: 'auto' }} checked={values?.is_active} onChange={(e) => {
                          console.log(e.target.checked);

                          setFieldValue('is_active', e.target.checked)
                        }
                        } />
                      </Grid>

                    </DialogContent>

                    <DialogActions sx={{
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
                    </DialogActions>

                  </Grid>

                </Card >
              </form>

            );
          }}
        </Formik>
      </Grid>



      <Footer />

    </>
  );
};



PaymentGatewayConfiguration.getLayout = (page) => {
  return (
    <Authenticated name='sms_gateway'>
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  );
};

export default PaymentGatewayConfiguration;