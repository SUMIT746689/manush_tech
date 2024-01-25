import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, FileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DynamicDropDownMuilipleSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { useClientDataFetch } from '@/hooks/useClientFetch';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/post';
import Link from 'next/dist/client/link';
import { verifyIsUnicode } from 'utilities_api/verify';

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

// const GateWaySelect = () => {
//   const { values, touched, errors, setFieldValue }: any = useFormikContext()
//   const { data: sms_gateway } = useClientDataFetch('/api/sms_gateways?is_active=true');
//   useEffect(() => {
//     sms_gateway[0]?.id && setFieldValue("sms_gateway_id", sms_gateway[0]?.id)
//   }, [sms_gateway])

//   return values.sms_gateway_id ?
//     <DisableTextWrapper label="Sms Gateway" touched={touched.sms_gateway_id} errors={errors.sms_gateway_id} value={sms_gateway[0]?.title} />
//     :
//     <DisableTextWrapper label="Sms Gateway" touched={touched.sms_gateway_id} errors={errors.sms_gateway_id} value={'No Gateway Selected'} />
// }


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


function PageHeader({ sms_gateway }) {

  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

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

      _values["recipient_type"] = "INDIVIDUAL"

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

  return (
    <>
      <Card sx={{ mt: 1, borderRadius: 0, boxShadow: "none",mb:'auto' }}>
        {/* dialog title */}
        {/* <DialogTitleWrapper name={"Sms Templates"} /> */}

        <Formik
          enableReinitialize={true}
          initialValues={{
            campaign_name: '',
            sms_gateway: sms_gateway?.details?.sender_id || '',
            sms_gateway_id: sms_gateway?.id || undefined,
            template_id: undefined,
            body: '',
            // recipient_type: undefined,
            class_id: undefined,
            section_id: [],
            role_id: [],
            name: [],
            schedule_date: undefined,
            schedule_time: undefined,
            submit: null,
            file_upload: undefined,
          }}
          validationSchema={Yup.object().shape({
            campaign_name: Yup.string()
              .max(255)
              .required(t('The campaign name field is required')),
            body: Yup.string()
              .max(1000)
              .required(t('The body field is required')),
            sms_gateway_id: Yup.number()
              .min(0)
              .required(t('The sms gateway field is required')),
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
            console.log({ errors, values });
            console.log({ sms_gateway })
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  sx={{ p: 3, }}
                >
                  <Grid container rowGap={1}>

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

                    {
                      // sms_gateway &&
                      <Grid container>
                        <DisableTextWrapper
                          label="Selected Sms Gateway"
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
                    }
                    {/* <GateWaySelect /> */}

                    <DynamicSelectTemplate />

                    <Grid container>
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
                      <Grid sx={{ ml: 'auto' }}>
                        <SmsHelpInfoWrapper value={values.body} />
                      </Grid>
                    </Grid>


                    {/* <DynamicTypeSelect /> */}

                    {/* {values.recipient_type === "CLASS" && <TypeClass />} */}
                    {/* {values.recipient_type === "GROUP" && <TypeGroup />} */}
                    {/* {values.recipient_type === "INDIVIDUAL" &&  */}
                    <TypeIndividual />
                    {/* } */}
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

const SmsHelpInfoWrapper = ({ value }) => {
  const isUnicode = verifyIsUnicode(value);
  console.log({ isUnicode })
  const updatedValue = isUnicode ? value * 2 : value;
  return (
    <Grid sx={{ ml: 'auto' }}>
      {`
        ${updatedValue?.length ?? 0} characters | 
        ${1000 - (updatedValue?.length ?? 0)} characters left |
        ${!updatedValue?.length || updatedValue?.length === 0 ?
          0
          :
          updatedValue?.length <= 160 ? 1 : Math.ceil(updatedValue?.length / 153)} SMS                
        `}
    </Grid>
  )
}