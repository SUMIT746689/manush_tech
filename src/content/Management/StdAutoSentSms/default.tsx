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
    'admission_status'
];

const useSystemtypeOptions = [{ label: "automatic", id: "automatic" }, { label: "external api", id: "external_api" }]

const smsTemplateType = ["present", "late", "absence", "admission"]

const StudentAutoSentSms = () => {
    const { t }: { t: any } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { data, reFetchData } = useClientFetch('/api/automatic_attendances');
    // const { data: academicYears } = useClientDataFetch('/api/academic_years');
    const { showNotification } = useNotistick();
    const [selectTemplateType, setSelectTemplateType] = useState("present");

    const handleChangeSystemType = (v, setFieldValue) => {
        setFieldValue("use_system_type", v)
    }

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        setIsLoading(true)
        if (_values.use_system_type) _values.use_system_type = _values.use_system_type.id
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
                        present_body: data?.present_body || undefined,
                        late_body: data?.late_body || undefined,
                        absence_body: data?.absence_body || undefined,
                        admission_body: data?.admission_body || undefined,

                        use_system_type: data?.use_system_type ? useSystemtypeOptions.find(option => option.id === data.use_system_type) : null,
                        every_hit: data?.every_hit || false,

                        is_attendence_active: data?.is_attendence_active || false,
                        is_sms_active: data?.is_sms_active || false,
                        is_present_sms_active: data?.is_present_sms_active || false,
                        is_late_sms_active: data?.is_late_sms_active || false,
                        is_absence_sms_active: data?.is_absence_sms_active || false,
                        is_admission_sms_active: data?.is_admission_sms_active || false,

                        auth_user: data?.auth_user || undefined,
                        auth_code: data?.auth_code || undefined,
                        url: data?.external_api_info?.url || undefined,
                        url_params: data?.external_api_info?.url_params || [{ key: "auth_user", value: "" }, { key: "auth_code", value: "" }],
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        // is_active: Yup.boolean().required(t('This is active field is required')),
                        every_hit: Yup.boolean().required(t('This every field is required')),
                        url: Yup.string().trim()
                            .matches(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'Is not in correct format')
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
                                                Sent Sms for Student Autometic Attendence
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {t(`Fill in the fields below to update sent sms for student autometic attendence `)}
                                            </Typography>
                                        </DialogTitle>

                                        <DialogContent sx={{ minWidth: '100%', display: "grid", gap: 2 }} >

                                            <Grid item pt={1}>
                                                <DropDownSelectWrapper
                                                    value={selectTemplateType}
                                                    name='template_type'
                                                    label='Select Template Type'
                                                    handleChange={(e, v) => setSelectTemplateType(e.target.value)}
                                                    menuItems={smsTemplateType}
                                                />
                                            </Grid>

                                            {
                                                smsTemplateType?.map((templateT, index) => (
                                                    <React.Fragment key={index}>
                                                        {
                                                            selectTemplateType === templateT &&

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
                                            <AutoCompleteWrapper
                                                minWidth="100%"
                                                label='Select Attendence System Type'
                                                placeholder='select a use system type...'
                                                options={useSystemtypeOptions}
                                                value={values.use_system_type}
                                                handleChange={(e, v) => handleChangeSystemType(v, setFieldValue)}
                                            />

                                            {
                                                values.use_system_type?.id === "external_api"
                                                && <Grid container columnSpacing={0.5} rowSpacing={1}>

                                                    {
                                                        values?.url_params?.map((value, index) => (
                                                            <React.Fragment key={value.index + 1}>
                                                                <Grid item width="100%" sm={6}>
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
                                                                        disabled={true}
                                                                    />
                                                                </Grid>
                                                                <Grid item width="100%" sm={6}>
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

                                                            </React.Fragment>
                                                        ))
                                                    }
                                                </Grid>
                                            }

                                            <Grid item>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="is_attendence_active"
                                                            checked={values.is_attendence_active || false}
                                                            onChange={handleChange}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            size="medium"
                                                        // color="secondary" 
                                                        />
                                                    }
                                                    label="Attendence System Active"
                                                    labelPlacement="start"
                                                    sx={{ pl: 0, ml: 0 }}
                                                />
                                            </Grid>

                                            {
                                                values.is_attendence_active
                                                &&
                                                <>
                                                    <Grid item px={4}>
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

                                                    <Grid item px={4}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="is_sms_active"
                                                                    checked={values.is_sms_active || false}
                                                                    onChange={handleChange}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                    size="medium"
                                                                // color="secondary" 
                                                                />
                                                            }
                                                            label="Sms System Active"
                                                            labelPlacement="start"
                                                            sx={{ pl: 0, ml: 0 }}
                                                        />
                                                    </Grid>

                                                    {
                                                        values.is_sms_active &&
                                                        <Grid item pl={8} display="grid" justifyContent="start" columnGap={2} flexWrap="wrap">
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        name="is_present_sms_active"
                                                                        checked={values.is_present_sms_active || false}
                                                                        onChange={handleChange}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        size="medium"
                                                                    />
                                                                }
                                                                label="Present Active"
                                                                labelPlacement="end"
                                                                sx={{ pl: 0, ml: 0 }}
                                                            />

                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        name="is_late_sms_active"
                                                                        checked={values.is_late_sms_active || false}
                                                                        onChange={handleChange}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        size="medium"
                                                                    />
                                                                }
                                                                label="Late Sms Active"
                                                                labelPlacement="end"
                                                                sx={{ pl: 0, ml: 0 }}
                                                            />

                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        name="is_absence_sms_active"
                                                                        checked={values.is_absence_sms_active || false}
                                                                        onChange={handleChange}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        size="medium"
                                                                    />
                                                                }
                                                                label="Absence Sms Active"
                                                                labelPlacement="end"
                                                                sx={{ pl: 0, ml: 0 }}
                                                            />
                                                        </Grid>
                                                    }
                                                </>
                                            }

                                            <Grid item>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="is_admission_sms_active"
                                                            checked={values.is_admission_sms_active || false}
                                                            onChange={handleChange}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            size="medium"
                                                        />
                                                    }
                                                    label="Admission Automatice Sms Active"
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