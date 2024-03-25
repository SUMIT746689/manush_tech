import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, NewFileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import React, { useState } from 'react';
import { read, utils } from "xlsx";
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import Link from 'next/dist/client/link';
import { handleCreateFileObj } from 'utilities_api/handleCreateFileObject';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { VoiceFileRequiremntAlert } from '../VoiceFileRequiremntAlert';
import { handleFileChange, handleFileRemove } from 'utilities_api/handleFileUpload';
import { ButtonWrapper } from '@/components/ButtonWrapper';


function FileUpload({ sms_gateway }) {
    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();
    const [selectSheetHeaders, setSelectSheetHeaders] = useState([]);
    const [voiceFileRequiremntShow, setVoiceFileRequiremntShow] = useState(false);

    const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {

            const successResponse = (message) => {
                showNotification('send sms ' + message + ' successfully');
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                setSelectSheetHeaders(() => []);
                // reFetchData();
            };

            const datas = new FormData()

            for (const [key, value] of Object.entries(_values)) {
                if (["gateway_id", "contact_file"].includes(key)) datas.set(key, _values[key]);
                else if (key === "voice_file") datas.set(key, _values[key][0])
            }

            const { data } = await axios.post(`/api/voice_msgs/file_uploads`, datas);
            successResponse('created');

        } catch (err) {
            console.error(err);
            handleShowErrMsg(err, showNotification);
            setStatus({ success: false });
            //@ts-ignore
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    const handleUplaodFileChange = async (event, setFieldValue) => {
        if (!event.target.files[0]) return;
        const reader = new FileReader();


        reader.onload = async function (e) {
            const data = e.target.result;
            const workbook = read(data, { type: 'array' })
            /* DO SOMETHING WITH workbook HERE */
            const firstSheetName = workbook.SheetNames[0]
            /* Get worksheet */
            const worksheet = workbook.Sheets[firstSheetName]
            const excelArrayDatas = utils.sheet_to_json(worksheet, { raw: true });
            // setFieldValue("contact_column", null)

            if (excelArrayDatas.length > 30_000) {
                showNotification("file is to large", "error")
                setFieldValue("contact_file", null);
                setSelectSheetHeaders(() => []);
                return;
            }
            const fileHeads = Object.keys(excelArrayDatas[0]);
            console.log({ fileHeads })
            setSelectSheetHeaders(() => fileHeads);


            // set upload file 
            const { err, files, objFiles } = handleCreateFileObj(event)
            if (err) showNotification(err, "error");
            setFieldValue('contact_file', files[0]);
            setFieldValue('preview_contact_file', objFiles[0]);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    const handleRemove = (setFile) => {
        setFile('file_upload', '');
        setFile('preview_file_upload', '');
    }

    return (
        <>
            <VoiceFileRequiremntAlert voiceFileRequiremntShow={voiceFileRequiremntShow} setVoiceFileRequiremntShow={setVoiceFileRequiremntShow} />
            <Card sx={{ width:"100%", mt: 1, borderRadius: 0, boxShadow: "none", mb: 'auto' }}>
                {/* dialog title */}
                {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

                <Formik
                    initialValues={{
                        // campaign_name: '',
                        gateway: sms_gateway?.details?.sender_id || '',
                        gateway_id: sms_gateway?.id || undefined,
                        contact_file: undefined,
                        preview_contact_file: [],
                        voice_file: undefined,
                        preview_voice_file: [],
                        schedule_date: undefined,
                        schedule_time: undefined,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        gateway_id: Yup.number()
                        .required(t('')),
                        contact_file: Yup.mixed()
                            .required(t('The audio file field is required')),
                        voice_file: Yup.mixed()
                            .required(t('The audio file field is required')),
                        // campaign_name: Yup.string()
                        //     .max(255)
                        //     .required(t('The campaign name field is required')),
                    })}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        errors, handleBlur, handleChange, handleSubmit,
                        isSubmitting, touched, values,
                        setFieldValue
                    }) => {
                        console.log({ values })
                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    sx={{ p: 3 }}
                                >
                                    <Grid container rowGap={1}>

                                        {/* <Grid container>
                                            <Grid pb={0.5}>Campaign Name: *</Grid>
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
                                        </Grid> */}

                                        <Grid container>
                                            <Grid pb={0.5}>Selected Sms Gateway: *</Grid>
                                            <DisableTextWrapper
                                                label=""
                                                touched={values.gateway}
                                                errors={errors.gateway}
                                                value={values.gateway}
                                            />
                                            {
                                                Boolean(
                                                    // touched.sms_gateway_id 
                                                    // && 
                                                    errors.gateway_id
                                                ) &&
                                                <Grid display="flex" columnGap={2} justifyContent="space-between">
                                                    <Grid pb={2} color="red" fontSize={13} fontWeight={600}> {errors.gateway_id} </Grid>
                                                    <Link href="/settings/sms" ><Grid textTransform="uppercase" color="violet" px={1} mb="auto" sx={{ ':hover': { cursor: "pointer", color: "blue" } }}> create sms gateway {'->'}</Grid></Link>
                                                </Grid>

                                            }
                                        </Grid>

                                        <Grid >Contact File: (.xlsx, .xls, .csv, text/csv) *</Grid>
                                        <Grid item width="100%">
                                            <NewFileUploadFieldWrapper
                                                label='Upload Contact File'
                                                htmlFor="contact_file"
                                                accept=".xlsx, .xls, .csv, text/csv"
                                                handleChangeFile={(event) => { handleUplaodFileChange(event, setFieldValue) }}
                                            />
                                        </Grid>

                                        {values?.contact_file?.name &&
                                            <>
                                                <Grid color="#57ca22" width="100%" fontWeight={500}>Upload Contact File Name:</Grid>
                                                <Grid ><Chip variant='outlined' label="File Name: " sx={{ borderRadius: 0, height: 40 }} /><Chip color="success" variant="outlined" label={values.contact_file?.name} sx={{ borderRadius: 0, height: 40 }} /></Grid>
                                            </>
                                        }

                                        <Grid item width="100%">
                                            <Grid item pb={0.5}>Select Audio File: (wav) *</Grid>
                                            <NewFileUploadFieldWrapper
                                                label='Upload Audio File '
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
                                                Preview Audio File: <br />
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
                                                            {/* <ButtonWrapper sx={{ color: minWidth: "fit-content" }} handleClick={() => handleFileRemove(setFieldValue, "file_upload", "preview_file_upload")} >Remove</ButtonWrapper> */}
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

export default FileUpload;


const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm"
]
    .map(function (x) {
        return "." + x;
    })
    .join(",");

/* generate an array of column objects */
// const make_cols = refstr => {
//   let o = [],
//     C = XLSX.utils.decode_range(refstr).e.c + 1;
//   for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
//   return o;
// };
