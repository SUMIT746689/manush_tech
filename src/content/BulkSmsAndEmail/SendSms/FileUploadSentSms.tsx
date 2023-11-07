import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, FileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DynamicDropDownMuilipleSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/post';
import {read} from "xlsx";

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

function PageHeader() {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

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
      <Card sx={{ mt: 1, borderRadius: 0.6, boxShadow: "" }}>
        {/* dialog title */}
        {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

        <Formik
          initialValues={{
            campaign_name: undefined,
            sms_gateway_id: undefined,
            template_id: undefined,
            body: undefined,
            recipient_type: undefined,
            class_id: undefined,
            section_id: [],
            role_id: [],
            name: [],
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
                  <Grid container>

                    <TextFieldWrapper
                      label="Campaign Name"
                      name="campaign_name"
                      value={values.campaign_name}
                      touched={touched.campaign_name}
                      errors={errors.campaign_name}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      required={true}
                    />


                    <FileUploadFieldWrapper
                      htmlFor="files"
                      label="File File"
                      name="file_upload"
                      value={values.logo?.name || ''}
                      handleChangeFile={(e) => {
                        const reader = new FileReader();
                        console.log({ file___: e});

                        reader.onload = function (e) {
                          const data = e.target.result;
                          console.log({data})
                          const workbook = read(data,{type:"array"});
                          console.log({workbook})
                          const {Sheets } = workbook ;
                          console.log({Sheets})
                          const {Sheet1:{A1} } = {} = Sheets || {};
                          console.log({A1})
                        }
                        reader.readAsArrayBuffer(e.target.files[0]);

                        // const input = e.target.files[0];
                        // // handleFile(input)
                        // // const parser = new DOMParser();
                        // // const xmlDoc = parser.parseFromString(parser,"text/xml");
                        // const reader = new FileReader();
                        // reader.onload = function (e) {

                        //   console.log({e})
                        //   // const text = JSON.parse(e.target.result);
                        //   // const splitText = text.split(",")
                        //   console.log({eeeeee____: e.target.result.toString().split(/\r?\n/) });
                        // };
                        // reader.readAsText(input);

                        if (e.target?.files?.length) setFieldValue("file_upload", e.target.files[0])
                      }}
                      handleRemoveFile={() => { setFieldValue("file_upload", undefined) }}
                    />
                    {/* {editData?.logo_url */}
                    {/* && */}
                    {/* // <Avatar variant="square" sx={{ border: '1px solid lightgray', background: 'none', mb: 1, width: 100, height: 100 }}> */}
                    {/* <Image src={editData?.logo_url} width={100} height={100} alt="logo" /> */}
                    {/* <img src={`/api/get_file${editData?.logo_url}`} className=" h-fit w-20" alt='logo' /> */}
                    {/* </Avatar> */}
                    {/* } */}


                    {/* <DynamicSelectTemplate /> */}

                    <TextAreaWrapper
                      sx={{ pb: 0 }}
                      name="body"
                      value={values.body}
                      touched={touched.body}
                      errors={errors.body}
                      handleChange={(v) => {
                        if (v.target.value.length > 1000) return;
                        handleChange(v)
                      }
                      }
                      handleBlur={handleBlur}
                    />
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

                    <GateWaySelect />

                    <DynamicTypeSelect />

                    {values.recipient_type === "CLASS" && <TypeClass />}
                    {values.recipient_type === "GROUP" && <TypeGroup />}
                    {values.recipient_type === "INDIVIDUAL" && <TypeIndividual />}
                    {/* <DropDownSelectWrapper required={true} label="Type" menuItems={[]} />
                    <DropDownSelectWrapper required={true} label="Role" menuItems={[]} /> */}
                    {/* <DropDownSelectWrapper menuItems={[]} /> */}
                    {/* <MobileDatePicker />
                    <MobileDatePicker /> */}

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
  .map(function(x) {
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
