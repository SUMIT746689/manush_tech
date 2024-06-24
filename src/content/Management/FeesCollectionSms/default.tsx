import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Card, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, Switch, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import Footer from '@/components/Footer';
import { ButtonWrapper, SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { CustomSwitch } from '@/components/Switch/Switch';
import React, { useState } from 'react';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { DropDownSelectWrapper } from '@/components/DropDown';

const dynamicStudentDataKeys = [
    'first_name',
    'middle_name',
    'last_name',
    // 'school_id',
    // 'admission_no',
    'date_of_birth',
    // 'admission_status',
    'gender',
    'relation_with_guardian',
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
    // 'attendance_status',
    // 'created_at',
    'admission_status',
    'total_paid_amount', 
    'tracking_number'
];

const useSystemtypeOptions = [{ label: "automatic", id: "automatic" }, { label: "external api", id: "external_api" }]

const smsTemplateType = ["fees_collection_sms"]

const StudentAutoSentSms = () => {
    const { t }: { t: any } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { data, reFetchData } = useClientFetch('/api/sms_settings/fees_collection_settings');
    // const { data: academicYears } = useClientDataFetch('/api/academic_years');
    const { showNotification } = useNotistick();
    // const [selectTemplateType, setSelectTemplateType] = useState("present");

    const handleChangeSystemType = (v, setFieldValue) => {
        setFieldValue("use_system_type", v)
    }

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        setIsLoading(true)
        if (_values.use_system_type) _values.use_system_type = _values.use_system_type.id
        // if (_values.is_active && !_values.academic_year_id) return showNotification('academic year field is required', 'error')

        const successResponse = () => {
            showNotification('fees collection settings updated!')
            resetForm();
            reFetchData();
            setStatus({ success: true });
        };

        await axios.post('/api/sms_settings/fees_collection_settings', _values)
            .then(res => {
                successResponse();
            })
            .catch(err => {
                handleShowErrMsg(err, showNotification)
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleDeleteApiKeyValues = (deleteIndex: number, values, setFieldValue) => {
        const values_ = values.filter((value, index) => index !== deleteIndex);
        setFieldValue("url_params", values_)
    }

    return (
        <>
            <Grid container
                display="flex"
                alignContent="center"
                direction="column"
                justifyContent="center"
                alignItems="center"
                minHeight={'calc(100vh - 200px)'}
                sx={{ py: 1, overflowY: "auto" }}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        fees_collection_sms_body: data?.fees_collection_sms_body || undefined,
                        is_fees_collection_sms_active: data?.is_fees_collection_sms_active || false,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        // url: Yup.string().trim()
                        //     .matches(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'Is not in correct format')
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                        console.log({ values, errors })
                        return (
                            <Card sx={{
                                maxWidth: '700px',
                                boxShadow: 'black',
                                overflowY: "auto",
                            }} >
                                <form onSubmit={handleSubmit}>
                                    <Grid container direction={'column'} alignItems={'center'} gap={1} marginTop={3}>

                                        <DialogTitle width='100%' sx={{ p: 3, borderBottom: 1, borderColor: "lightgray" }} >
                                            <Typography variant="h4" gutterBottom>
                                                Fees Collection Sms Settings
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {t(`Fill in the fields below to update sent sms for fees collection sms settings`)}
                                            </Typography>
                                        </DialogTitle>

                                        <DialogContent sx={{ minWidth: '100%', display: "grid", gap: 2 }} >

                                            {
                                                smsTemplateType?.map((templateT, index) => (
                                                    <React.Fragment key={index}>
                                                        {
                                                            // selectTemplateType === templateT &&

                                                            <SmsBodies
                                                                name={`${templateT}_body`}
                                                                values={values}
                                                                handleBlur={handleBlur}
                                                                touched={touched}
                                                                errors={errors}
                                                                handleChange={handleChange}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }

                                            <Grid item>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="is_fees_collection_sms_active"
                                                            checked={values.is_fees_collection_sms_active || false}
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
                                        </DialogContent>

                                        <DialogActions sx={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            borderTop: '1px solid lightgray',
                                            px: 3,
                                            pt: 3
                                        }}>
                                            <SearchingButtonWrapper
                                                isLoading={isLoading}
                                                handleClick={undefined}
                                                type="submit"
                                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                                //@ts-ignore
                                                disabled={isLoading || Boolean(errors.submit) || isSubmitting}
                                                variant="contained"
                                            >
                                                {t('Submit')}
                                            </SearchingButtonWrapper>
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


const SmsBodies = ({ name, handleChange, setFieldValue, values, touched, errors, handleBlur }) => {
    return (
        <>
            <Grid item container display={"flex"} flexWrap={"wrap"} gap={0.5}>
                {dynamicStudentDataKeys.map((value, index) => (<Chip
                    key={index}
                    color="primary"
                    onClick={(e) => {
                        setFieldValue(name, (values[name] || '') + ` #${value}#`)
                    }}
                    sx={{ m: 0, p: 0, b: 0, borderRadius: 0.5, fontSize: 11, fontWeight: 700 }}
                    label={`#${value}#`}
                    clickable
                    size="small"
                />))}
            </Grid>

            <Grid item pt={1}>
                <TextAreaWrapper
                    label={name.split('_').join(' ')}
                    sx={{ pb: 0 }}
                    name={name}
                    value={values[name] || ''}
                    touched={touched[name]}
                    errors={errors[name]}
                    handleChange={(v) => {
                        if (v.target.value.length > 1000) return;
                        handleChange(v)
                    }}
                    handleBlur={handleBlur}
                />
                <Grid item sx={{ ml: 'auto' }}>
                    {`
                    ${values[name]?.length ?? 0} characters | 
                    ${1000 - (values[name]?.length ?? 0)} characters left |
                    ${!values[name]?.length || values[name]?.length === 0 ?
                            0
                            :
                            values[name]?.length <= 160 ? 1 : Math.ceil(values[name]?.length / 153)} SMS
                `}
                </Grid>
            </Grid>
        </>
    )
}