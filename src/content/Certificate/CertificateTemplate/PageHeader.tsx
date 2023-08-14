import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, DialogContent, Avatar, Button, Typography } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { FileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { DropDownSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { RichTextEditorWrapper } from '@/components/RichTextEditorWrapper';
import Image from 'next/image';
import { fetchData } from '@/utils/post';
import { ButtonWrapper } from '@/components/ButtonWrapper';

function PageHeader({ editData, setEditData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [dynamicContent, setDynamicContent] = useState([]);

  useEffect(() => {
    if (editData) setOpen(true);
  }, [editData])

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successResponse = (message) => {
        showNotification('sms template' + message + ' successfully');
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        reFetchData();
        handleCreateClassClose();
      };
      console.log("_values__", _values);

      if (editData) {
        const res = await axios.patch(`/api/certificate_templates/${editData.id}`, _values);
        successResponse('updated');
      } else {
        const formData = new FormData();
        for (const [key, value] of Object.entries(_values)) {
          console.log(`${key}: ${value}`);
          // @ts-ignore
          formData.append(key, value);
        }
        if (editData) {
          const res = await axios.patch(`/api/certificate_template/${editData.id}`, formData);
          // fetchData('')
          console.log({ res })
          successResponse(' updated ');
        }
        else {
          const res = await axios.post(`/api/certificate_templates`, formData);
          console.log({ res })
          successResponse('created');
        }
      }
    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.message, 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleDynamicContent = async (userType) => {
    const [err, res] = await fetchData('/api/certificate_templates/dynamic_content', 'get', {})
    setDynamicContent(() => (!err && res.success) ? res.data : []);
  }

  return (
    <>
      {/* page head title and create button ui */}
      <PageHeaderTitleWrapper name="certificate template" handleCreateClassOpen={handleCreateClassOpen} />

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateClassClose}
      >
        {/* dialog title */}
        <DialogTitleWrapper name={"Certificate Templates"} editData={editData} />

        <Formik
          initialValues={{
            name: editData?.name || undefined,
            user_type: editData?.user_type || undefined,
            page_layout: editData?.page_layout || undefined,
            student_qr_code: editData?.user_type === "student" ? editData.student_qr_code : undefined,
            employee_qr_code: editData?.user_type === "employee" ? editData.employee_qr_code : undefined,
            photo_style: editData?.photo_style || undefined,
            photo_size: editData?.photo_size || undefined,
            top_space: editData?.top_space || undefined,
            bottom_space: editData?.bottom_space || undefined,
            right_space: editData?.right_space || undefined,
            left_space: editData?.left_space || undefined,
            content: editData?.content || '',
            logo: '',
            signature: '',
            background_image: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The name field is required')),
            // content: Yup.string()
            //   .max(255)
            //   .required(t('The content field is required'))
          })}
          onSubmit={handleFormSubmit}
        >
          {({
            errors, handleBlur, handleChange, handleSubmit,
            isSubmitting, touched, values,
            setFieldValue
          }) => {
            console.log({ values, errors })
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container >
                    <Grid container display="grid" sx={{ gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }} >
                      <TextFieldWrapper
                        label="Certificate Name"
                        name="name"
                        value={values.name}
                        touched={touched.name}
                        errors={errors.name}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                      />

                      <DropDownSelectWrapper
                        label="User Type"
                        name="user_type"
                        value={values.user_type}
                        menuItems={['student', 'employee']}
                        handleChange={({ target }) => {
                          const { name, value } = target;
                          setFieldValue(name, value);
                          handleDynamicContent(value);
                        }}
                        required={true}
                      />

                      <DynamicDropDownSelectWrapper
                        label="Page Layout"
                        name={"page_layout"}
                        value={values.page_layout}
                        menuItems={[{ title: 'a4-potrait', value: 'a4_potrait' }, { title: 'a4-landscape', value: 'a4_landscape' }]}
                        handleChange={handleChange}
                        required={true}
                      />

                      {values.user_type === "student" && <DropDownSelectWrapper
                        label="Student QR Code "
                        name="student_qr_code"
                        value={values.student_qr_code}
                        menuItems={['name', 'date_of_birth', 'registration_no', 'roll']}
                        // touched={touched.name}
                        // errors={errors.name}
                        handleChange={handleChange}
                        // handleBlur={handleBlur}
                        required={true}
                      />
                      }

                      {values.user_type === "employee" && <DropDownSelectWrapper
                        label="Employee QR Code "
                        name="employee_qr_code"
                        value={values.employee_qr_code}
                        menuItems={['name', 'date_of_birth', 'registration_no', 'roll']}

                        // touched={touched.name}
                        // errors={errors.name}
                        handleChange={handleChange}
                        // handleBlur={handleBlur}
                        required={true}
                      />
                      }

                      <DropDownSelectWrapper
                        label="User Photo Style"
                        name="photo_style"
                        value={values.photo_style}
                        menuItems={['circular', 'rounded', 'square']}

                        // touched={touched.name}
                        // errors={errors.name}
                        handleChange={handleChange}
                        // handleBlur={handleBlur}
                        required={true}
                      />

                      <TextFieldWrapper
                        label="User Photo Size (PX) "
                        name="photo_size"
                        value={values.photo_size}
                        touched={touched.photo_size}
                        errors={errors.photo_size}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                        type="number"
                      />

                      <TextFieldWrapper
                        label="top space (PX)"
                        name="top_space"
                        value={values.top_space}
                        touched={touched.top_space}
                        errors={errors.top_space}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                        type="number"
                      />

                      <TextFieldWrapper
                        label="bottom space (PX)"
                        name="bottom_space"
                        value={values.bottom_space}
                        touched={touched.bottom_space}
                        errors={errors.bottom_space}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                        type="number"
                      />

                      <TextFieldWrapper
                        label="right space (PX)"
                        name="right_space"
                        value={values.right_space}
                        touched={touched.right_space}
                        errors={errors.right_space}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                        type="number"
                      />

                      <TextFieldWrapper
                        label="left space (PX)"
                        name="left_space"
                        value={values.left_space}
                        touched={touched.left_space}
                        errors={errors.left_space}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        required={true}
                        type="number"
                      />
                    </Grid>

                    <Grid sx={{ gap: 1 }}>

                      {/* <TextFieldWrapper
                        label="Logo Image"
                        name="logo"
                        value={undefined}
                        touched={touched.logo}
                        errors={errors.logo}
                        handleChange={(e) => { setFieldValue("logo", e.target.files[0]) }}
                        handleBlur={handleBlur}
                        required={editData?.logo_url ? false : true}
                        type="file"
                      /> */}
                      <FileUploadFieldWrapper
                        htmlFor="logo"
                        label="Logo Image"
                        name="logo"
                        value={values.logo?.name || ''}

                        handleChangeFile={(e) => { if (e.target?.files?.length) { setFieldValue("logo", e.target.files[0]) } }}
                        handleRemoveFile={() => { setFieldValue("logo", undefined) }}
                      />
                      {editData?.logo_url
                        &&
                        <Avatar variant="square" sx={{ border: '1px solid lightgray', background: 'none', mb: 1, width: 100, height: 100 }}>
                          {/* <Image src={editData?.logo_url} width={100} height={100} alt="logo" /> */}
                          <img src={`/api/get_file${editData?.logo_url}`} className=" h-fit w-20" alt='logo' />
                        </Avatar>
                      }

                      <FileUploadFieldWrapper
                        htmlFor="signature"
                        label="Signature Image"
                        name="signature"
                        value={values.signature?.name || ''}
                        handleChangeFile={(e) => { if (e.target?.files?.length) { setFieldValue("signature", e.target.files[0]) } }}
                        handleRemoveFile={(e) => { setFieldValue("signature", undefined) }}
                      />

                      {editData?.signature_url
                        &&
                        <Avatar variant="square" sx={{ border: '1px solid lightgray', background: 'none', mb: 1, width: 100, height: 100 }}>
                          {/* <Image src={editData?.signature_url} width={100} height={100} alt="logo" /> */}
                          <img src={`/api/get_file${editData?.signature_url}`} className=" h-fit w-20" alt="signature" />
                        </Avatar>
                      }

                      <FileUploadFieldWrapper
                        htmlFor="background_image"
                        label="Background Image"
                        name="background_image"
                        value={values.background_image?.name || ''}
                        // touched={touched.background_image}
                        // errors={errors.background_image}
                        handleChangeFile={(e) => { if (e.target?.files?.length) { setFieldValue("background_image", e.target.files[0]) } }}
                        handleRemoveFile={(e) => { setFieldValue("background_image", undefined) }}

                      // handleBlur={handleBlur}
                      // required={editData?.background_url ? false : true}
                      // type="file"
                      />
                      <Typography variant="body2" gutterBottom color="blue">
                        provide width 1123 pixel and height 794 pixel photo
                      </Typography>
                      {editData?.background_url
                        &&
                        <Avatar variant="square" sx={{ border: '1px solid lightgray', background: 'none', mb: 1, width: 100, height: 100 }}>
                          {/* <Image src={editData?.background_url} width={100} height={100} alt="logo" /> */}
                          <img src={`/api/get_file${editData?.background_url}`} className=" h-fit w-20" />
                        </Avatar>
                      }
                    </Grid>

                    {/* <TextAreaWrapper
                      name="content"
                      value={values.content}
                      touched={touched.content}
                      errors={errors.content}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      required={true}
                    /> */}

                    <RichTextEditorWrapper
                      value={values.content}
                      handleChange={(newValue, editor) => {
                        setFieldValue('content', newValue);
                        // setText(editor.getContent({ format: 'text' }));
                        editor.getContent({ format: 'text' });
                      }}
                    />
                    <Grid display="flex" flexWrap="wrap" gap={1} mt={1} >
                      {dynamicContent?.map((content, index) => <Button key={index} variant="contained" sx={{ borderRadius: 0.4, fontSize: 12, fontWeight: 400, py: 0.4, px: 1 }} onClick={() => { setFieldValue('content', values.content + content) }} >{content}</Button>)}

                    </Grid>
                  </Grid>
                </DialogContent>

                {/* handle cancel dilog / close / submit dialog click cancel or add button */}
                <DialogActionWrapper
                  title="Certificate Template"
                  handleCreateClassClose={handleCreateClassClose}
                  errors={errors}
                  editData={editData}
                  isSubmitting={isSubmitting}
                />
              </form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
