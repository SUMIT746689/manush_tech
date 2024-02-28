import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, FileUploadFieldWrapper, NewFileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DynamicDropDownMuilipleSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import React, { useEffect, useState } from 'react';
import { fetchData } from '@/utils/post';
import Link from 'next/dist/client/link';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { VoiceFileRequiremntAlert } from './VoiceFileRequiremntAlert';
import { handleFileChange } from 'utilities_api/handleFileUpload';

const DynamicSelectTemplate = () => {
    const { data: sms_datas } = useClientDataFetch("/api/sms_templates")
    const { values, handleSubmit, touched, setTouched, errors, handleBlur, setFieldValue }: any = useFormikContext()


    const select_template_value = sms_datas?.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
    // select_template_value.unshift({ value: 0, title: 'Select' })

    const handleTemplateSelect = (e) => {
        if (e.target.value <= 0) return;
        const findSelectedTemplate = sms_datas.find(data => data.id === e.target.value)
        if (!findSelectedTemplate) return;
        setFieldValue("template_id", e.target.value)
        setFieldValue("body", findSelectedTemplate.body)
        handleBlur("body")
    }

    return (
        <Grid container>
            <Grid pb={0.5}>Select Template :*</Grid>
            <DynamicDropDownSelectWrapper label="" name="template_id" value={values.template_id} menuItems={select_template_value} handleChange={handleTemplateSelect} />
        </Grid>
    )
}

const TypeClass = () => {
    const { values, touched, errors, setFieldValue }: any = useFormikContext()
    const { data: classes } = useClientFetch('/api/class');
    const [selectClassList, setSelectClassList]: any = useState([]);
    const [selectSectionList, setSelecteSectionList]: any = useState([]);

    useEffect(() => {
        const customize_select_classlist = classes?.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
        customize_select_classlist && setSelectClassList(value => [...value, ...customize_select_classlist]);
    }, [classes])

    const handleClassSelect = (e) => {
        setSelecteSectionList(() => []);
        setFieldValue("section_id", []);
        const findSelectedTemplate = classes ? classes.find(data => data.id === e.target.value) : false;
        if (!findSelectedTemplate) return;
        setFieldValue("class_id", e.target.value);
        if (!findSelectedTemplate.has_section) return;
        const customize_select_sectionlist = findSelectedTemplate.sections.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
        setSelecteSectionList((value) => customize_select_sectionlist)
        // setFieldValue("body", findSelectedTemplate.body)
        // handleBlur("body")
    };

    const handleSectionSelect = (e) => {
        // const findSelectedTemplate = classes.find(data => data.id === e.target.value);
        // if (!findSelectedTemplate) return;
        setFieldValue("section_id", e.target.value)
        // setFieldValue("body", findSelectedTemplate.body)
        // handleBlur("body")
    };

    return <>
        <Grid container>
            <Grid>Select Class: *</Grid>
            <DynamicDropDownSelectWrapper label="" name="class_id" value={values.class_id} menuItems={selectClassList} handleChange={handleClassSelect} />
        </Grid>
        <Grid container>
            <Grid>Select Section:</Grid>
            <DynamicDropDownMuilipleSelectWrapper label="" name="section_id" value={values.section_id} menuItems={selectSectionList} handleChange={handleSectionSelect} />
        </Grid>

    </>

}

const TypeGroup = () => {
    const { values, touched, errors, setFieldValue }: any = useFormikContext()
    const { data: roles } = useClientDataFetch('/api/sent_sms/roles');
    const [selectRolesList, setSelectRolesList]: any = useState([{ value: 0, title: 'SELECT' }]);
    useEffect(() => {
        const customize_select_roleList = roles?.map(role => ({ value: role.id, title: role.title }))
        customize_select_roleList && setSelectRolesList(() => customize_select_roleList);
        return () => setFieldValue("role_id", [])
    }, [roles])

    const handleRoleSelect = (e) => {
        console.log({ e })
        // if (e.target.value <= 0) return;
        // const findSelectedTemplate = roles.find(data => data.id === e.target.value)
        // if (!findSelectedTemplate) return;
        setFieldValue("role_id", e.target.value)
        // setFieldValue("body", findSelectedTemplate.body)
        // handleBlur("body")
    };

    return (
        <>
            <DynamicDropDownMuilipleSelectWrapper label="Select Role" name="role_id" value={Array.isArray(values.role_id) ? values.role_id : []} menuItems={selectRolesList} handleChange={handleRoleSelect} />
        </>
    )
}

const DynamicTypeSelect = () => {
    // const { data: sms_datas } = useClientDataFetch("/api/")
    // const { values, handleSubmit, touched, setTouched, errors, handleBlur, setFieldValue } = useFormikContext()
    const { values, setFieldValue }: any = useFormikContext()

    const types = [
        // { value: "SELECT", title: "SELECT" },
        { value: "CLASS", title: "CLASS" },
        { value: "GROUP", title: "GROUP" },
        // { value: 'INDIVIDUAL', title: "INDIVIDUAL" }
    ]

    const handleTypeChange = (e) => {
        setFieldValue("recipient_type", e.target.value)
        setFieldValue("class_id", undefined)
        setFieldValue("section_id", [])
    }

    // return <DropDownSelectWrapper   label="Type" handleChange={handleTypeChange} menuItems={types} />
    return (
        <Grid container>
            <Grid pb={0.5}>Select Class/Group Wise: *</Grid>
            <DynamicDropDownSelectWrapper value={values.recipient_type} name="recipient_type" label="" menuItems={types} handleChange={handleTypeChange} />
        </Grid>
    )


}

function GroupContact({ sms_gateway }) {
    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();
    const [voiceFileRequiremntShow, setVoiceFileRequiremntShow] = useState(false);


    const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {

            const successResponse = (message) => {
                showNotification('send sms ' + message + ' successfully');
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                // reFetchData();
            };

            const { data } = await axios.post(`/api/sent_sms`, _values);
            successResponse('created');

        } catch (err) {
            console.error(err);
            handleShowErrMsg(err, showNotification)
            setStatus({ success: false });
            //@ts-ignore
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    return (
        <>
            <VoiceFileRequiremntAlert voiceFileRequiremntShow={voiceFileRequiremntShow} setVoiceFileRequiremntShow={setVoiceFileRequiremntShow} />
            <Card sx={{ mt: 1, borderRadius: 0, boxShadow: 'none', mb: 'auto' }}>
                {/* dialog title */}
                {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

                <Formik
                    initialValues={{
                        campaign_name: '',
                        sms_gateway: sms_gateway?.details?.sender_id || '',
                        sms_gateway_id: sms_gateway?.id || undefined,
                        voice_file: undefined,
                        preview_voice_file: [],

                        recipient_type: undefined,
                        class_id: undefined,
                        section_id: [],
                        role_id: [],
                        name: [],
                        schedule_date: undefined,
                        schedule_time: undefined,
                        submit: null,
                        // file_upload: undefined,
                    }}
                    validationSchema={Yup.object().shape({
                        campaign_name: Yup.string()
                            .max(255)
                            .required(t('The campaign name field is required')),
                        sms_gateway_id: Yup.number()
                            .min(0)
                            .required(t('The sms gateway field is required')),
                        recipient_type: Yup.string()
                            .min(4)
                            .required(t('The type field is required')),
                    })}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        errors, handleBlur, handleChange, handleSubmit,
                        isSubmitting, touched, values,
                        setFieldValue
                    }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    sx={{ p: 3 }}
                                >
                                    <Grid container rowGap={1}>

                                        <Grid container>
                                            <Grid pb={0.5}>Campaign Name :*</Grid>
                                            <TextFieldWrapper
                                                label=""
                                                name="campaign_name"
                                                value={values.campaign_name}
                                                touched={touched.campaign_name}
                                                errors={errors.campaign_name}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                required={true}
                                            />
                                        </Grid>

                                        <Grid container>
                                            <Grid container>
                                                <Grid pb={0.5}>Select Sms Gateway :*</Grid>
                                                <DisableTextWrapper
                                                    label=""
                                                    touched={values.sms_gateway}
                                                    errors={errors.sms_gateway}
                                                    value={values.sms_gateway}
                                                />
                                                {
                                                    Boolean(
                                                        // touched.sms_gateway_id 
                                                        // && 
                                                        errors.sms_gateway_id
                                                    ) &&
                                                    <Grid display="flex" columnGap={2} justifyContent="space-between">
                                                        <Grid pb={2} color="red" fontSize={13} fontWeight={600}> {errors.sms_gateway_id} </Grid>
                                                        <Link href="/settings/sms" ><Grid textTransform="uppercase" color="violet" px={1} mb="auto" sx={{ ':hover': { cursor: "pointer", color: "blue" } }}> create sms gateway {'->'}</Grid></Link>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Grid>
                                        {/* <GateWaySelect /> */}


                                        {/* <DynamicSelectTemplate /> */}

                                        {/* audio msg upload */}
                                        <Grid item width="100%">
                                            <Grid item pb={0.5}>Select Audio File: (wav) *</Grid>
                                            <NewFileUploadFieldWrapper
                                                label='Upload Audio File'
                                                htmlFor="voice_file"
                                                accept=".wav,.WAV"
                                                handleChangeFile={(event) => { handleFileChange(event, setFieldValue, "voice_file", "preview_voice_file") }}
                                            />
                                            <Button size="small" onClick={() => setVoiceFileRequiremntShow(true)} >File format instructions </Button> | <Button size="small"><a href='https://g711.org/'>Convert file</a></Button>
                                        </Grid>

                                        {
                                            Array.isArray(values?.preview_voice_file) &&
                                            values.preview_voice_file.length > 0 &&
                                            <>
                                                Preview Upload File: <br />
                                                {
                                                    values?.preview_voice_file?.map((preview_file, id) => (
                                                        <React.Fragment key={id} >
                                                            <Grid container>File Name: {preview_file.name}</Grid>
                                                            <audio
                                                                style={{ width: "100%" }}
                                                                controls
                                                                src={preview_file.src}>
                                                                Your browser does not support the
                                                                <code>audio</code> element.
                                                            </audio>
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </>
                                        }


                                        <DynamicTypeSelect />

                                        {values.recipient_type === "CLASS" && <TypeClass />}
                                        {values.recipient_type === "GROUP" && <TypeGroup />}

                                    </Grid>
                                </DialogContent>

                                <DialogActions sx={{ p: 3, pt: 0 }}>
                                    <Button
                                        type="submit"
                                        sx={{ borderRadius: 0.5 }}
                                        // handleClick={undefined}
                                        variant="contained"
                                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                        //@ts-ignore
                                        disabled={Boolean(errors.submit) || isSubmitting}
                                    >
                                        {t(`${'Send Voice'}`)}
                                    </Button>
                                </DialogActions>
                            </form>
                        );
                    }}
                </Formik>
            </Card>
        </>
    );
}

export default GroupContact;

