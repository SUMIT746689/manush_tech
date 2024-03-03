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
            // datas.set('file', "asss")

            for (const [key, value] of Object.entries(_values)) {
                console.log(`${key}: ${value}`);
                // @ts-ignore
                if (key === "contact_column") datas.set(key, value.id)
                else if (value) datas.set(key, _values[key]);
            }
            console.log({ datas })
            // const {file_upload} = _values;
            // const fileToBlob = new Blob([new Uint8Array(await file_upload.arrayBuffer())], {type: file_upload.type });
            // _values.file_upload.arrayBuffer().then((arrayBuffer) => {
            //   const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file_upload.type });
            //   console.log({blob});
            // }); 
            // _values.file_upload = fileToBlob;
            console.log({ _values })
            const { data } = await axios.post(`/api/sent_sms/dynamic`, datas);
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

            // setPreviewFile(() => imgPrev)

            // const workbook = read(data, { type: "array" });

            // console.log({ workbook })
            // const { Sheets } = workbook;
            // console.log({ Sheets })
            // const { Sheet1 } = {} = Sheets || {};
            // const { Sheet1: { A1 } } = {} = Sheets || {};
            // console.log({ Sheet1 })
            // // setFieldValue("file_upload", e );
            // setSelectSheetHeaders(() => getSheetHeaders(Sheet1))
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    const handleRemove = (setFile) => {
        setFile('file_upload', '');
        setFile('preview_file_upload', '');
    }

    // function handleFile(file /*:File*/) {
    //   /* Boilerplate to set up FileReader */
    //   const reader = new FileReader();
    //   const rABS = !!reader.readAsBinaryString;
    //   reader.onload = e => {
    //     /* Parse data */
    //     const bstr = e.target.result;
    //     const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
    //     /* Get first worksheet */
    //     const wsname = wb.SheetNames[0];
    //     const ws = wb.Sheets[wsname];
    //     console.log(rABS, wb);
    //     /* Convert array of arrays */
    //     const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    //     /* Update state */
    //     console.log({ data: data, cols: make_cols(ws["!ref"]) });
    //   };
    //   reader.readAsBinaryString(file)
    // };

    return (
        <>
            <VoiceFileRequiremntAlert voiceFileRequiremntShow={voiceFileRequiremntShow} setVoiceFileRequiremntShow={setVoiceFileRequiremntShow} />
            <Card sx={{ mt: 1, borderRadius: 0, boxShadow: "none", mb: 'auto' }}>
                {/* dialog title */}
                {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

                <Formik
                    initialValues={{
                        campaign_name: '',
                        sms_gateway: sms_gateway?.details?.sender_id || '',
                        sms_gateway_id: sms_gateway?.id || undefined,
                        contact_column: null,
                        file_upload: undefined,
                        preview_file_upload: [],
                        schedule_date: undefined,
                        schedule_time: undefined,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        campaign_name: Yup.string()
                            .max(255)
                            .required(t('The campaign name field is required')),
                        body: Yup.string()
                            .max(255)
                            .required(t('The body field is required')),
                        // sms_gateway_id: Yup.number()
                        //   .min(0)
                        //   .required(t('The sms gateway field is required')),
                        // recipient_type: Yup.string()
                        //   .min(4)
                        //   .required(t('The type field is required')),
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
                                        </Grid>

                                        <Grid container>
                                            <Grid pb={0.5}>Selected Sms Gateway: *</Grid>
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
                                        {/* <Grid width="100%">
                                            <Grid pb={0.5}>Select Mobile Number: * (from upload file column) </Grid>
                                            <AutoCompleteWrapper
                                                minWidth="100%"
                                                label=''
                                                placeholder='select mobile number column... '
                                                options={selectSheetHeaders?.map(i => {
                                                    return {
                                                        label: i,
                                                        id: i
                                                    }
                                                }) || []}
                                                value={values.contact_column}
                                                handleChange={(e, value) => {
                                                    console.log("contact", value)
                                                    setFieldValue("contact_column", value)
                                                }}
                                            />
                                        </Grid> */}

                                        {/* <Grid display="flex" width={'100%'} gap={1} mt={1} mb={0.5} justifyContent={'right'} >
                                            <Grid display={"flex"} justifyContent={"right"} flexWrap={"wrap"} gap={0.5}>
                                                {selectSheetHeaders.map((value, index) => <Chip key={index} color="primary" onClick={(e) => {
                                                    setFieldValue("body", (values.body || '') + ` #${value}#`)
                                                }} sx={{ borderRadius: 0.5, fontSize: 13, fontWeight: 700 }} label={`#${value}#`} clickable />)}
                                            </Grid>
                                        </Grid> */}


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
