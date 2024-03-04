import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress, Divider, Dialog, Typography, Slide } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, NewFileUploadFieldWrapper, TextAreaWrapper } from '@/components/TextFields';
import Link from 'next/dist/client/link';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { handleFileChange } from 'utilities_api/handleFileUpload';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import React, { FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { VoiceFileRequiremntAlert } from '../VoiceFileRequiremntAlert';
// const GateWaySelect = () => {
//   const { values, touched, errors, setFieldValue }: any = useFormikContext()
//   const { data: gateways } = useClientDataFetch('/api/gatewayss?is_active=true');
//   useEffect(() => {
//     gateways[0]?.id && setFieldValue("gateways_id", gateways[0]?.id)
//   }, [gateways])

//   return values.gateways_id ?
//     <DisableTextWrapper label="Sms Gateway" touched={touched.gateways_id} errors={errors.gateways_id} value={gateways[0]?.title} />
//     :
//     <DisableTextWrapper label="Sms Gateway" touched={touched.gateways_id} errors={errors.gateways_id} value={'No Gateway Selected'} />
// }


// const TypeIndividual = () => {
//   const { values, touched, errors, setFieldValue }: any = useFormikContext()
//   const { data: roles } = useClientDataFetch('/api/sent_sms/roles');
//   const [selectRolesList, setSelectRolesList]: any = useState([{ value: 0, title: 'SELECT' }]);
//   const [selectNameList, setSelecteNameList]: any = useState([]);

//   useEffect(() => {
//     const customize_select_roleslist = roles?.map(role => ({ value: role.id, title: role.title }))
//     customize_select_roleslist && setSelectRolesList(value => [...value, ...customize_select_roleslist]);
//   }, [roles])

//   const handleRoleSelect = async (e) => {
//     const [err, res] = await fetchData(`/api/user/role_wise_users?role_id=${e.target.value}`, 'get', {});

//     if (!err) setSelecteNameList(() => res.map(user => ({ value: user.id, title: user.username })));
//     setFieldValue("name", []);
//     const findSelectedTemplate = roles.find(data => data.id === e.target.value)
//     if (!findSelectedTemplate) return;
//     setFieldValue("role_id", e.target.value);
//     if (!findSelectedTemplate.has_section) return;
//     const customize_select_sectionlist = findSelectedTemplate.sections.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
//     setSelecteNameList((value) => customize_select_sectionlist)
//     // setFieldValue("body", findSelectedTemplate.body)
//     // handleBlur("body")

//   };

//   const handleNameSelect = (e) => {
//     // const findSelectedTemplate = classes.find(data => data.id === e.target.value);
//     // if (!findSelectedTemplate) return;
//     setFieldValue("name", e.target.value)
//     // setFieldValue("body", findSelectedTemplate.body)
//     // handleBlur("body")
//   };

//   return (
//     <>
//       <Grid container>
//         <Grid pb={0.5}>Select Role: *</Grid>
//         <DynamicDropDownSelectWrapper label="" name="role_id" value={values.role_id} menuItems={selectRolesList} handleChange={handleRoleSelect} />
//       </Grid>
//       <Grid container>
//         <Grid pb={0.5}>Select Name: *</Grid>
//         <DynamicDropDownMuilipleSelectWrapper label="" name="name" value={values.name} menuItems={selectNameList} handleChange={handleNameSelect} />
//       </Grid>
//       <Grid container>
//         <CustomizedHook />
//       </Grid>
//     </>
//   )
// }

type VoiceRecipientType = {
    gateways: null | any;
    templates: any[];
}

const VoiceRecipient: FC<VoiceRecipientType> = ({ gateways, templates }) => {

    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();
    const [voiceFileRequiremntShow, setVoiceFileRequiremntShow] = useState(false);

    const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting, setFieldValue }) => {
        try {

            const successResponse = (message) => {
                showNotification('send sms ' + message + ' successfully');
                resetForm();
                setFieldValue()
                setStatus({ success: true });
                setSubmitting(false);
                // reFetchData();
            };

            const formData = new FormData();
            formData.append("gateway_id", _values.gateway_id);
            formData.append("msisdn", _values.msisdn);
            formData.append("voice_file", _values?.voice_file[0]);

            const { data } = await axios.post(`/api/voice_msgs/voice_recipients`, formData);
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
            <Card sx={{ mt: 1, borderRadius: 0, boxShadow: "none", mb: 'auto' }}>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        gateways: gateways?.details?.sender_id || '',
                        gateway_id: gateways?.id || undefined,
                        msisdn: '',
                        schedule_date: undefined,
                        voice_file: undefined,
                        preview_voice_file: [],
                        submit: null,
                    }}
                    validationSchema={Yup.object().shape({
                        msisdn: Yup.string()
                            // .max(255)
                            .required(t('The mobile number field is required')),
                        gateway_id: Yup.number()
                            .min(0)
                            .required(t('The sms gateway field is required')),
                        voice_file: Yup.mixed()
                            .required(t('The audio file field is required')),
                    })}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        errors, handleBlur, handleChange, handleSubmit,
                        isSubmitting, touched, values,
                        setFieldValue
                    }) => {
                        console.log({ values, errors });
                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    sx={{ p: 3, }}
                                >
                                    <Grid container rowGap={1}>

                                        {
                                            // gateways &&
                                            <Grid container>
                                                <Grid pb={0.5}>Selected Sms Gateway: *</Grid>
                                                <DisableTextWrapper
                                                    // label="Selected Sms Gateway"
                                                    label=""
                                                    touched={values.gateways}
                                                    errors={errors.gateways}
                                                    value={values.gateways}
                                                />
                                                {
                                                    Boolean(
                                                        // touched.gateways_id 
                                                        // && 
                                                        errors.gateway_id
                                                    ) &&
                                                    <Grid display="flex" columnGap={2} justifyContent="space-between">
                                                        <Grid pb={2} color="red" fontSize={13} fontWeight={600}> {errors.gateways_id} </Grid>
                                                        <Link href="/settings/sms" ><Grid textTransform="uppercase" color="violet" px={1} mb="auto" sx={{ ':hover': { cursor: "pointer", color: "blue" } }}> create sms gateway {'->'}</Grid></Link>
                                                    </Grid>

                                                }
                                            </Grid>
                                        }

                                        <Grid container>
                                            <Grid pb={0.5}>Enter Mobile Numbers: *</Grid>
                                            <TextAreaWrapper
                                                sx={{ pb: 0 }}
                                                label={''}
                                                name="msisdn"
                                                value={values.msisdn}
                                                touched={touched.msisdn}
                                                errors={errors.msisdn}
                                                handleChange={(v) => {
                                                    if (v.target.value.length > 1000) return;
                                                    handleChange(v)
                                                }
                                                }
                                                handleBlur={handleBlur}
                                            />
                                            <Grid>Exmp: <span style={{ fontSize: "12px", color: "teal" }}>8801776900000 8801910000000</span></Grid>
                                        </Grid>
                                        {/* <GateWaySelect /> */}


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
                                            values?.preview_voice_file.length > 0 &&
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
            </Card >
        </>
    );
}

export default VoiceRecipient;


