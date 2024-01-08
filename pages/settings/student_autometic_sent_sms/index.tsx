import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Stack, Switch, TextField, Tooltip, Typography, styled } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DialogTitleWrapper } from '@/components/DialogWrapper';
import Footer from '@/components/Footer';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { CustomSwitch } from '@/components/Switch/Switch';


const SMSSettings = () => {
    const { t }: { t: any } = useTranslation();
    const { data, reFetchData } = useClientFetch('/api/automatic_attendances');

    const { showNotification } = useNotistick();

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            const successResponse = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
            };

            axios.post('/api/automatic_attendances', _values)
                .then(res => {
                    showNotification('autometic attendance sent sms settings updated!')
                    reFetchData();
                })
                .catch(err => {
                    showNotification('update failed!', 'error')
                    console.log(err);

                })

        } catch (err) {
            console.error(err);

            setStatus({ success: false });
            //@ts-ignore
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    body: data?.body || undefined,
                    is_active: data?.is_active || false,
                    every_hit: data?.every_hit || false,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    is_active: Yup.string().max(255).required(t('This is active field is required')),
                    every_hit: Yup.string().max(255).required(t('This every field is required')),

                })}
                onSubmit={handleSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                    console.log({ values })
                    return (
                        <>
                            <Grid container
                                display="flex"
                                alignContent="center"
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                height={'calc(100vh - 213px)'}
                            >
                                <form onSubmit={handleSubmit}>
                                    <Card sx={{
                                        maxWidth: '500px',
                                        boxShadow: 'black',
                                    }} >
                                        <Grid container direction={'column'} alignItems={'center'} gap={1} marginTop={3}>
                                            <DialogTitle sx={{ p: 3, borderBottom: 1, borderColor: "lightgray" }} >
                                                <Typography variant="h4" gutterBottom>
                                                    Sent Sms for Student Autometic Attendence
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    {t(`Fill in the fields below to update sent sms for student autometic attendence `)}
                                                </Typography>
                                            </DialogTitle>

                                            <DialogContent sx={{ minWidth: '100%', display: "grid", gap: 2 }} >
                                                <Grid item pt={1}>

                                                    <TextAreaWrapper
                                                        sx={{ pb: 0 }}
                                                        name="body"
                                                        value={values.body || ''}
                                                        touched={touched.body}
                                                        errors={errors.body}
                                                        handleChange={(v) => {
                                                            if (v.target.value.length > 1000) return;
                                                            handleChange(v)
                                                        }}
                                                        handleBlur={handleBlur}
                                                    />
                                                    <Grid item sx={{ ml: 'auto' }}>
                                                        {`
                                                        ${values.body?.length ?? 0} characters | 
                                                        ${1000 - (values.body?.length ?? 0)} characters left |
                                                        ${!values.body?.length || values.body?.length === 0 ?
                                                                0
                                                                :
                                                                values.body?.length <= 160 ? 1 : Math.ceil(values.body?.length / 153)} SMS
                                                    `}
                                                    </Grid>
                                                </Grid>

                                                <Grid item>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="is_active"
                                                                checked={values.is_active || false}
                                                                onChange={handleChange}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                size="medium"
                                                            // color="secondary" 
                                                            />
                                                        }
                                                        label="Is Active"
                                                        labelPlacement="start"
                                                        sx={{ pl: 0, ml: 0 }}
                                                    />
                                                </Grid>

                                                {
                                                    values.is_active &&
                                                    <Grid item>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Tooltip title="when student first time punch the attendance machine" placement="top">
                                                                <Typography>Only Entry time</Typography>
                                                            </Tooltip>
                                                            <CustomSwitch
                                                                name="every_hit"
                                                                checked={values.every_hit || false}
                                                                onChange={handleChange}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            // color="secondary" 
                                                            />
                                                            <Tooltip title="when student every time punch the attendance machine" placement="top">
                                                                <Typography>Every Time</Typography>
                                                            </Tooltip>
                                                        </Stack>
                                                    </Grid>
                                                }

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
                            </Grid>
                        </>
                    );
                }}
            </Formik >

            <Footer />
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