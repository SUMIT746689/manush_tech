import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Formik } from 'formik';
import { Button, Card, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, Switch, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import useNotistick from '@/hooks/useNotistick';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import Footer from '@/components/Footer';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { CustomSwitch } from '@/components/Switch/Switch';
import React, { useState } from 'react';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';

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

const useSystemtypeOptions = [{ label: "automatic", id: "automatic" }, { label: "external api", id: "external_api" }]

const StudentAutoSentSms = () => {
    const { t }: { t: any } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { data, reFetchData } = useClientFetch('/api/automatic_attendances');
    // const { data: academicYears } = useClientDataFetch('/api/academic_years');
    const { showNotification } = useNotistick();

    const handleChangeSystemType = (v, setFieldValue) => {
        setFieldValue("use_system_type", v)
    }

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {

        if(_values.use_system_type) _values.use_system_type = _values.use_system_type.id
        // if (_values.is_active && !_values.academic_year_id) return showNotification('academic year field is required', 'error')

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
                handleShowErrMsg(err, showNotification)
                console.log(err);
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
                        body: data?.body || undefined,
                        use_system_type: data?.use_system_type ? useSystemtypeOptions.find(option => option.id === data.use_system_type) : null,
                        is_active: data?.is_active || false,
                        every_hit: data?.every_hit || false,
                        auth_user: data?.auth_user || undefined,
                        auth_code: data?.auth_code || undefined,
                        url: data?.external_api_info?.url || undefined,
                        url_params: data?.external_api_info?.url_params || [],
                        // academic_year: data?.academicYear ? { label: data.academicYear.title, id: data.academicYear.id } : undefined,
                        // academic_year_id: data?.academic_year_id || undefined,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        is_active: Yup.boolean().required(t('This is active field is required')),
                        every_hit: Yup.boolean().required(t('This every field is required')),
                        url: Yup.string().trim()
                            .matches(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'Is not in correct format')
                        // academic_year:
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                        // console.log({ errors, values, isSubmitting })
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
                                            <AutoCompleteWrapper
                                                minWidth="100%"
                                                label='Select System Type'
                                                placeholder='select a use system type...'
                                                options={useSystemtypeOptions}
                                                value={values.use_system_type}
                                                handleChange={(e, v) => handleChangeSystemType(v, setFieldValue)}
                                            />

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
                                                values.use_system_type?.id === "external_api"
                                                && values.is_active
                                                && <Grid container columnSpacing={0.5} rowSpacing={1}>
                                                    <Grid item xs={12}>
                                                        <TextFieldWrapper
                                                            name="url"
                                                            label={<b>URL:</b>}
                                                            errors={errors.url}
                                                            touched={touched.url}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                            value={values.url}
                                                        />
                                                        <Grid >example: <span style={{ color: "darkgoldenrod" }}>www.dummy.com</span></Grid>
                                                    </Grid>
                                                    {
                                                        values?.url_params?.map((value, index) => (
                                                            <React.Fragment key={value.index + 1}>
                                                                <Grid item sm={5.5}>
                                                                    <TextFieldWrapper
                                                                        name="key"
                                                                        label={t('Key')}
                                                                        errors={errors.key}
                                                                        touched={touched.key}
                                                                        handleBlur={handleBlur}
                                                                        handleChange={(v) => {
                                                                            const values_ = [...values.url_params];
                                                                            values_[index].key = v.target.value;
                                                                            setFieldValue("url_params", values_)
                                                                        }}
                                                                        value={value?.key}
                                                                    />
                                                                </Grid>
                                                                <Grid item sm={5.5}>
                                                                    <TextFieldWrapper
                                                                        name="value"
                                                                        label={t('Value')}
                                                                        errors={errors.value}
                                                                        touched={touched.value}
                                                                        handleBlur={handleBlur}
                                                                        handleChange={(v) => {
                                                                            const values_ = [...values.url_params];
                                                                            values_[index].value = v.target.value;
                                                                            setFieldValue("url_params", values_)
                                                                        }}
                                                                        value={value.value}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={1} >
                                                                    <Button onClick={() => handleDeleteApiKeyValues(index, values.url_params, setFieldValue)} variant="outlined" size='small' sx={{ borderRadius: 0.5 }}>
                                                                        <DeleteIcon sx={{ color: "red" }} />
                                                                    </Button>
                                                                </Grid>
                                                            </React.Fragment>
                                                        ))
                                                    }
                                                    <Grid item mx="auto">
                                                        <ButtonWrapper handleClick={() => setFieldValue("url_params", [...values?.url_params, { key: "", value: "" }])}> + Add Key Values </ButtonWrapper>
                                                    </Grid>
                                                    {/* <Grid item sm={6}>
                                                        <TextFieldWrapper
                                                            name="auth_user"
                                                            label={t('Auth User')}
                                                            errors={errors.auth_user}
                                                            touched={touched.auth_user}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                            value={values.auth_user}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={6}>
                                                        <TextFieldWrapper
                                                            name="auth_code"
                                                            label={t('Auth Code')}
                                                            errors={errors.auth_code}
                                                            touched={touched.auth_code}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                            value={values.auth_code}
                                                        />
                                                    </Grid> */}
                                                    {/* <AutoCompleteWrapper
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
                                                    /> */}
                                                </Grid>
                                            }

                                            {
                                                values.is_active
                                                &&
                                                <>
                                                    <Grid item>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Tooltip title="when student first time punch the attendance machine" placement="top">
                                                                <Typography color={!values.every_hit ? "#c026d3" : "lightgray"} fontWeight={'600'}>Only Entry Time</Typography>
                                                            </Tooltip>
                                                            <CustomSwitch
                                                                name="every_hit"
                                                                checked={values.every_hit || false}
                                                                onChange={handleChange}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            // color="secondary" 
                                                            />
                                                            <Tooltip title="when student every time punch the attendance machine" placement="top">
                                                                <Typography color={values.every_hit ? "#9b52e1" : "lightgray"} fontWeight={'600'}>Every Time</Typography>
                                                            </Tooltip>
                                                        </Stack>
                                                    </Grid>
                                                    {/* <AutoCompleteWrapper
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
                                                    /> */}
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