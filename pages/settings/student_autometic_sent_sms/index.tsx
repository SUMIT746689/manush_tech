import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Card, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, Switch, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import Footer from '@/components/Footer';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { CustomSwitch } from '@/components/Switch/Switch';
import { useState } from 'react';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';

const dynamicStudentDataKeys = [
    'first_name',
    'middle_name',
    'last_name',
    // 'school_id',
    // 'admission_no',
    'date_of_birth',
    // 'admission_status',
    'gender',
    'religion',
    'phone',
    'email',
    'father_name',
    'mother_name',
    'blood_group',
    // 'admission_date',
    'national_id',
    'father_phone',
    'father_profession',
    // 'father_photo',
    'mother_phone',
    'mother_profession',
    // 'mother_photo',
    'student_permanent_address',
    // 'previous_school',
    // 'student_information_id',
    // 'section_id',
    // 'group_id',
    // 'academic_year_id',
    'class_roll_no',
    'class_registration_no',
    // 'student_photo',
    'guardian_name',
    'guardian_phone',
    'guardian_profession',
    // 'guardian_photo',
    // 'relation_with_guardian',
    'student_present_address',
    'submission_time',
    'attendance_status'
    // 'created_at'
];

const StudentAutoSentSms = () => {
    const { t }: { t: any } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const { data, reFetchData } = useClientFetch('/api/automatic_attendances');
    const { data: academicYears } = useClientDataFetch('/api/academic_years');
    const { showNotification } = useNotistick();

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {

        if (_values.is_active && !_values.academic_year_id) return showNotification('academic year field is required', 'error')

        const successResponse = () => {
            showNotification('autometic attendance sent sms settings updated!')
            resetForm();
            reFetchData();
            setStatus({ success: true });
        };

        await axios.post('/api/automatic_attendances', _values)
            .then(res => {
                successResponse();
            })
            .catch(err => {
                showNotification('update failed!', 'error')
                console.log(err);
            })
    }
    return (
        <>
            <Grid container
                display="flex"
                alignContent="center"
                direction="column"
                justifyContent="center"
                alignItems="center"
                minHeight={'calc(100vh - 213px)'}
                sx={{ overflowY: "auto" }}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        body: data?.body || undefined,
                        is_active: data?.is_active || false,
                        every_hit: data?.every_hit || false,
                        academic_year: data?.academicYear ? { label: data.academicYear.title, id: data.academicYear.id } : undefined,
                        academic_year_id: data?.academic_year_id || undefined,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        is_active: Yup.boolean().required(t('This is active field is required')),
                        every_hit: Yup.boolean().required(t('This every field is required')),
                        // academic_year:
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                        console.log({ errors, values, isSubmitting })
                        return (

                            <Card sx={{
                                maxWidth: '700px',
                                boxShadow: 'black',
                                overflowY: "auto",
                            }} >
                                <form onSubmit={handleSubmit}>
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
                                            <Grid item container display={"flex"} flexWrap={"wrap"} gap={0.5}>
                                                {dynamicStudentDataKeys.map((value, index) => (<Chip
                                                    key={index}
                                                    color="primary"
                                                    onClick={(e) => {
                                                        setFieldValue("body", (values.body || '') + ` #${value}#`)
                                                    }}
                                                    sx={{ m: 0, p: 0, b: 0, borderRadius: 0.5, fontSize: 11, fontWeight: 700 }}
                                                    label={`#${value}#`}
                                                    clickable
                                                    size="small"
                                                />))}
                                            </Grid>
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


                                            {/* <TextFieldWrapper
                                             /> */}

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
                                                <>
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
                                                    <AutoCompleteWrapper
                                                        minWidth="100%"
                                                        label={t('Academic Year')}
                                                        placeholder={t('select a academic year')}
                                                        limitTags={2}
                                                        // getOptionLabel={(option) => option.id}
                                                        options={
                                                            academicYears.map(i => {
                                                                return {
                                                                    label: i.title,
                                                                    id: i.id,
                                                                }
                                                            })}
                                                        value={values.academic_year}
                                                        handleChange={(e, v) => {
                                                            setFieldValue('academic_year', v)
                                                            setFieldValue('academic_year_id', v?.id)
                                                        }}
                                                    />
                                                </>
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

                                </form>
                            </Card >
                        );
                    }}
                </Formik >
            </Grid>

            <Footer />
        </>
    );
};

StudentAutoSentSms.getLayout = (page) => {
    return (
        <Authenticated requiredPermissions={['modify_student_auto_sent_sms']}>
            <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
        </Authenticated>
    );
};

export default StudentAutoSentSms;