import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, DialogContent, Card, DialogActions, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DisableTextWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { useClientDataFetch } from '@/hooks/useClientFetch';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/post';
import Link from 'next/dist/client/link';
import SmsHelpInfoWrapper from './SmsHelpInfoWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';

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
      <Grid>Select Template:</Grid>
      <DynamicDropDownSelectWrapper label="" name="template_id" value={values.template_id} menuItems={select_template_value} handleChange={handleTemplateSelect} />
    </Grid>
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
  const [selectRolesList, setSelectRolesList]: any = useState([]);
  const [selectNameList, setSelecteNameList]: any = useState([]);

  useEffect(() => {
    const customize_select_roleslist = roles?.map(role => ({ value: role.id, label: role.title }))
    customize_select_roleslist && setSelectRolesList(value => [...value, ...customize_select_roleslist]);
  }, [roles])

  const handleRoleSelect = async (e, value) => {
    console.log({ value })
    const [err, res] = await fetchData(`/api/user/role_wise_users?role_id=${value?.value}`, 'get', {});

    if (!err) setSelecteNameList(() => res.map(user => ({ value: user.id, label: user.username })));
    setFieldValue("name", []);
    const findSelectedTemplate = roles.find(data => data.id === value?.value)
    if (!findSelectedTemplate) return;
    setFieldValue("role", value);
    setFieldValue("role_id", value.value);

    if (!findSelectedTemplate.has_section) return;
    const customize_select_sectionlist = findSelectedTemplate.sections.map(sms_data => ({ value: sms_data.id, title: sms_data.name }))
    setSelecteNameList((value) => customize_select_sectionlist)
  };

  const handleNameSelect = (e, value) => {
    setFieldValue("name", value)
    setFieldValue("name_ids", value.map((v) => v.value))
  };

  return (
    <>
      <Grid container>
        <Grid pb={0.5}>Select User Role: *</Grid>
        <AutoCompleteWrapper minWidth="100%" label="" placeholder="select a user role..." value={values.role} options={selectRolesList} handleChange={handleRoleSelect} />
      </Grid>
      <Grid container>
        <Grid pb={0.5}>Select Name: *</Grid>
        <AutoCompleteWrapper multiple={true} minWidth="100%" label="" placeholder="select users..." value={values.name} options={selectNameList} handleChange={handleNameSelect} />
      </Grid>
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
      handleShowErrMsg(err, showNotification)
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card sx={{ mt: 1, borderRadius: 0, boxShadow: "none", mb: 'auto' }}>
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
            role: undefined,
            name: [],
            name_ids: [],
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

                    <Grid container>
                      <Grid pb={0.5} >Campaign Name: *</Grid>
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

                    {
                      // sms_gateway &&
                      <Grid container>
                        <Grid pb={0.5}>Selected Sms Gateway: *</Grid>
                        <DisableTextWrapper
                          // label="Selected Sms Gateway"
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
                    }
                    {/* <GateWaySelect /> */}

                    <DynamicSelectTemplate />

                    <Grid container>
                      <Grid pb={0.5}>Body: *</Grid>
                      <TextAreaWrapper
                        sx={{ pb: 0 }}
                        label={''}
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

                    <TypeIndividual />

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

// const SmsHelpInfoWrapper = ({ value }) => {
//   const isUnicode = verifyIsUnicode(value);
//   console.log({ isUnicode, value: value.length })
//   const updatedValue = isUnicode ? value?.length * 2 : value.length;
//   return (
//     <Grid sx={{ ml: 'auto' }}>
//       {`
//         ${updatedValue ?? 0} characters | 
//         ${1000 - (updatedValue ?? 0)} characters left |
//         ${!updatedValue || updatedValue === 0 ?
//           0
//           :
//           updatedValue <= 160 ? 1 : Math.ceil(updatedValue / 153)} SMS                
//         `}
//     </Grid>
//   )
// }