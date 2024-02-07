import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, FileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DynamicDropDownMuilipleSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/post';
import { read, utils } from "xlsx";
import { getSheetHeaders } from '@/utils/sheet';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import Link from 'next/dist/client/link';

const DynamicSelectTemplate = () => {
  const { data: sms_datas } = useClientDataFetch("/api/sms_templates")
  const { values, handleSubmit, touched, setTouched, errors, handleBlur, setFieldValue }: any = useFormikContext()


  const select_template_value = sms_datas?.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
  select_template_value.unshift({ value: 0, title: 'Select' })

  const handleTemplateSelect = (e) => {
    if (e.target.value <= 0) return;
    const findSelectedTemplate = sms_datas.find(data => data.id === e.target.value)
    if (!findSelectedTemplate) return;
    setFieldValue("template_id", e.target.value)
    setFieldValue("body", findSelectedTemplate.body)
    handleBlur("body")
  }

  return (
    <>
      <DynamicDropDownSelectWrapper label="Select Template" name="template_id" value={values.template_id} menuItems={select_template_value} handleChange={handleTemplateSelect} />
    </>
  )
}

const GateWaySelect = () => {
  const { values, touched, errors, setFieldValue }: any = useFormikContext()
  const { data: sms_gateway } = useClientDataFetch('/api/sms_gateways?is_active=true');
  useEffect(() => {
    sms_gateway[0]?.id && setFieldValue("sms_gateway_id", sms_gateway[0]?.id)
  }, [sms_gateway])

  return values.sms_gateway_id ?
    <DisableTextWrapper label="Sms Gateway" touched={touched.sms_gateway_id} errors={errors.sms_gateway_id} value={sms_gateway[0]?.title} />
    :
    <DisableTextWrapper label="Sms Gateway" touched={touched.sms_gateway_id} errors={errors.sms_gateway_id} value={'No Gateway Selected'} />
}

const TypeClass = () => {
  const { values, touched, errors, setFieldValue }: any = useFormikContext()
  const { data: classes } = useClientFetch('/api/class');
  const [selectClassList, setSelectClassList]: any = useState([{ value: 0, title: 'Select' }]);
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
    <DynamicDropDownSelectWrapper label="Select Class" name="class_id" value={values.class_id} menuItems={selectClassList} handleChange={handleClassSelect} />

    <DynamicDropDownMuilipleSelectWrapper label="Select Section" name="section_id" value={values.section_id} menuItems={selectSectionList} handleChange={handleSectionSelect} />

  </>

}

const TypeGroup = () => {
  const { values, touched, errors, setFieldValue }: any = useFormikContext()
  const { data: roles } = useClientDataFetch('/api/sent_sms/roles');
  const [selectRolesList, setSelectRolesList]: any = useState([{ value: 0, title: 'SELECT' }]);
  console.log({ roles })
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


const TypeIndividual = () => {
  const { values, touched, errors, setFieldValue }: any = useFormikContext()
  const { data: roles } = useClientDataFetch('/api/sent_sms/roles');
  const [selectRolesList, setSelectRolesList]: any = useState([{ value: 0, title: 'SELECT' }]);
  const [selectNameList, setSelecteNameList]: any = useState([]);

  useEffect(() => {
    const customize_select_roleslist = roles?.map(role => ({ value: role.id, title: role.title }))
    customize_select_roleslist && setSelectRolesList(value => [...value, ...customize_select_roleslist]);
  }, [roles])

  const handleRoleSelect = async (e) => {
    const [err, res] = await fetchData(`/api/user/role_wise_users?role_id=${e.target.value}`, 'get', {});

    if (!err) setSelecteNameList(() => res.map(user => ({ value: user.id, title: user.username })));
    setFieldValue("name", []);
    const findSelectedTemplate = roles.find(data => data.id === e.target.value)
    if (!findSelectedTemplate) return;
    setFieldValue("role_id", e.target.value);
    if (!findSelectedTemplate.has_section) return;
    const customize_select_sectionlist = findSelectedTemplate.sections.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
    setSelecteNameList((value) => customize_select_sectionlist)
    // setFieldValue("body", findSelectedTemplate.body)
    // handleBlur("body")

  };

  const handleNameSelect = (e) => {
    // const findSelectedTemplate = classes.find(data => data.id === e.target.value);
    // if (!findSelectedTemplate) return;
    setFieldValue("name", e.target.value)
    // setFieldValue("body", findSelectedTemplate.body)
    // handleBlur("body")
  };

  return (
    <>
      <DynamicDropDownSelectWrapper label="Select Role" name="role_id" value={values.role_id} menuItems={selectRolesList} handleChange={handleRoleSelect} />

      <DynamicDropDownMuilipleSelectWrapper label="Select name" name="name" value={values.name} menuItems={selectNameList} handleChange={handleNameSelect} />
    </>
  )
}


const DynamicTypeSelect = () => {
  // const { data: sms_datas } = useClientDataFetch("/api/")
  // const { values, handleSubmit, touched, setTouched, errors, handleBlur, setFieldValue } = useFormikContext()
  const { values, setFieldValue }: any = useFormikContext()

  const types = [{ value: "SELECT", title: "SELECT" }, { value: "CLASS", title: "CLASS" }, { value: "GROUP", title: "GROUP" }, { value: 'INDIVIDUAL', title: "INDIVIDUAL" }]

  const handleTypeChange = (e) => {
    setFieldValue("recipient_type", e.target.value)
    setFieldValue("class_id", undefined)
    setFieldValue("section_id", [])
  }

  // return <DropDownSelectWrapper   label="Type" handleChange={handleTypeChange} menuItems={types} />
  return (
    <>
      <DynamicDropDownSelectWrapper required={true} value={values.recipient_type} name="recipient_type" label="Type" menuItems={types} handleChange={handleTypeChange} />

    </>
  )


}

function PageHeader({ sms_gateway }) {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [selectSheetHeaders, setSelectSheetHeaders] = useState([]);

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
      showNotification(err?.response?.data?.message, 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };


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
      <Card sx={{ mt: 1, borderRadius: 0, boxShadow: "none", mb: 'auto' }}>
        {/* dialog title */}
        {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

        <Formik
          initialValues={{
            campaign_name: '',
            sms_gateway: sms_gateway?.details?.sender_id || '',
            sms_gateway_id: sms_gateway?.id || undefined,
            contact_column: null,
            // template_id: undefined,
            body: '',
            // recipient_type: undefined,
            // class_id: undefined,
            // section_id: [],
            // role_id: [],
            // name: [],
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
            console.log({ values })
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

                    <FileUploadFieldWrapper
                      htmlFor="files"
                      label="File File"
                      name="file_upload"
                      value={values.logo?.name || ''}
                      handleChangeFile={(event) => {
                        if (!event.target.files[0]) return;
                        const reader = new FileReader();
                        console.log({ file___: event });


                        reader.onload = async function (e) {
                          const data = e.target.result;
                          const workbook = read(data, { type: 'array' })
                          /* DO SOMETHING WITH workbook HERE */
                          const firstSheetName = workbook.SheetNames[0]
                          /* Get worksheet */
                          const worksheet = workbook.Sheets[firstSheetName]
                          const excelArrayDatas = utils.sheet_to_json(worksheet, { raw: true });
                          setFieldValue("body", '')
                          setFieldValue("contact_column", null)

                          if (excelArrayDatas.length > 30_000) {
                            showNotification("file is to large", "error")
                            setFieldValue("file_upload", null);
                            setSelectSheetHeaders(() => []);
                            return;
                          }
                          const fileHeads = Object.keys(excelArrayDatas[0]);
                          console.log({ fileHeads })
                          setSelectSheetHeaders(() => fileHeads);
                          if (event.target?.files?.length) setFieldValue("file_upload", event.target.files[0]);

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


                      }}
                      handleRemoveFile={() => { setFieldValue("file_upload", undefined) }}
                    />

                    {values?.file_upload?.name ?
                      <Grid ml={1} ><Chip variant='outlined' label="File Name: " sx={{ borderRadius: 0, height: 40 }} /><Chip color="success" variant="outlined" label={values.file_upload?.name} sx={{ borderRadius: 0, height: 40 }} /></Grid>
                      : ''
                    }

                    <Grid width="100%">
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
                    </Grid>

                    <Grid display="flex" width={'100%'} gap={1} mt={1} mb={0.5} justifyContent={'right'} >
                      {/* {selectSheetHeaders.map((value)=><Card sx={{p:1,my:'auto', borderRadius:0.5}} elevation={3}> {`\#{${value}}`}</Card>)} */}

                      <Grid display={"flex"} justifyContent={"right"} flexWrap={"wrap"} gap={0.5}>
                        {selectSheetHeaders.map((value, index) => <Chip key={index} color="primary" onClick={(e) => {
                          setFieldValue("body", (values.body || '') + ` #${value}#`)
                        }} sx={{ borderRadius: 0.5, fontSize: 13, fontWeight: 700 }} label={`#${value}#`} clickable />)}
                      </Grid>

                    </Grid>
                    {/* <DynamicSelectTemplate /> */}
                    <Grid container>
                      <Grid> Enter SMS Content: *</Grid>
                      <TextAreaWrapper
                        sx={{ pb: 0 }}
                        label=""
                        name="body"
                        value={values.body}
                        touched={touched.body}
                        errors={errors.body}
                        handleChange={(v) => {
                          if (v.target.value.length > 1000) return;
                          handleChange(v)
                        }}
                        handleBlur={handleBlur}
                      />
                    </Grid>
                    <Grid sx={{ pb: 1, ml: 'auto' }}>
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
                    {t(`${'Send Sms'}`)}
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

export default PageHeader;


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
