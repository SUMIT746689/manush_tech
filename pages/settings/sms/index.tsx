import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import {  Formik } from 'formik';
import { Button, Card, CircularProgress, DialogActions, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';


const SMSSettings = () => {
  const { t }: { t: any } = useTranslation();
  const { data, reFetchData } = useClientFetch('/api/sms_gateways?is_active=true');
  console.log({ data });

  const { showNotification } = useNotistick();

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          id: data?.data[0]?.id || 0,
          sms_gateway: data?.data[0]?.details?.sms_gateway || '',
          sms_api_key: data?.data[0]?.details?.sms_api_key || '',
          sender_id: data?.data[0]?.details?.sender_id || '',
          title: data?.data[0]?.title || 'elitbuzz',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().max(255).required(t('The title field is required')),
          sms_gateway: Yup.string().max(255).required(t('The sms_gateway field is required')),
          sms_api_key: Yup.string().max(255).required(t('The sms_api_key field is required')),
          sender_id: Yup.string().max(255).required(t('The sender_id field is required')),
        })}
        onSubmit={async (
          _values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            const successResponse = (message) => {
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
            };

            const v = {
              id: _values.id,
              title: _values.title,
              details: {
                sms_gateway: _values.sms_gateway,
                sms_api_key: _values.sms_api_key,
                sender_id: _values.sender_id
              }
            }
            axios.post('/api/sms_gateways', v)
              .then(res => {
                showNotification('sms information updated!')
                reFetchData();
              })
              .catch(err => {
                showNotification('sms information update failed!', 'error')
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
            <Grid container
              direction="column"
              justifyContent="center"
              alignItems="center"
              height={'70vh'}
            >
              <form onSubmit={handleSubmit}>
                <Card sx={{
                  width: '400px',
                  boxShadow: 'black',

                }} >
                  <Grid container direction={'column'} alignItems={'center'} gap={2} marginTop={6}>

                    {/* sms_gateway */}

                    <Grid item borderRadius='10px' marginBottom='10px'>

                      <TextField
                        label="sms_gateway"
                        error={Boolean(touched?.sms_gateway && errors?.sms_gateway)}
                        helperText={touched?.sms_gateway && errors?.sms_gateway}
                        name="sms_gateway"
                        placeholder={t(`sms_gateway here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.sms_gateway}
                        variant="outlined"

                      />
                    </Grid>

                    {/* sms_api_key */}
                    <Grid item borderRadius='10px' marginBottom='10px'>
                      <TextField
                        label="sms_api_key"
                        error={Boolean(touched?.sms_api_key && errors?.sms_api_key)}

                        helperText={touched?.sms_api_key && errors?.sms_api_key}
                        name="sms_api_key"
                        placeholder={t(`sms_api_key here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.sms_api_key}
                        variant="outlined"

                      />
                    </Grid>
                    {/* sender_id */}
                    <Grid item borderRadius='10px' marginBottom='10px'>
                      <TextField
                        label="sender_id"
                        error={Boolean(touched?.sender_id && errors?.sender_id)}

                        helperText={touched?.sender_id && errors?.sender_id}
                        name="sender_id"
                        placeholder={t(`sender_id here...`)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.sender_id}
                        variant="outlined"

                      />
                    </Grid>

                    <DialogActions sx={{
                      justifyContent: 'center'
                    }}>
                      <Button
                        type="submit"
                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                        //@ts-ignore
                        disabled={Boolean(errors.submit) || isSubmitting}
                        variant="contained"
                      >
                        {t('Submit')}
                      </Button>
                    </DialogActions>

                  </Grid>

                </Card >
              </form>
            </Grid>
          );
        }}
      </Formik >

    </>
  );
};

SMSSettings.getLayout = (page) => {
  return (
    <Authenticated name='sms_gateway'>
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  );
};

export default SMSSettings;