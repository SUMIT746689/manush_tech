import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, DialogContent, Avatar, Button } from '@mui/material';
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

      const formData = new FormData();
      for (const [key, value] of Object.entries(_values)) {
        console.log(`${key}: ${value}`);
        // @ts-ignore
        formData.append(key, value);
      }
      if (editData) {
        const res = await axios.patch(`/api/notices/${editData.id}`, formData);
        // fetchData('')
        console.log({ res })
        successResponse(' updated ');
      }
      else {
        const res = await axios.post(`/api/notices`, formData);
        console.log({ res })
        successResponse('created');
      }
    } 
    catch (err) {
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
      <PageHeaderTitleWrapper name="notice" handleCreateClassOpen={handleCreateClassOpen} />

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        {/* dialog title */}
        <DialogTitleWrapper name={"Notice"} editData={editData} />

        <Formik
          initialValues={{
            title: editData?.title || undefined,
            description: editData?.description || undefined,
            photo: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
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
                  <Grid container gap={1} >
                    {/* <Grid container display="grid" sx={{ gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }} > */}
                    <TextFieldWrapper
                      label="Title"
                      name="title"
                      value={values.title}
                      touched={touched.title}
                      errors={errors.title}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />

                    <RichTextEditorWrapper
                      value={values.description}
                      handleChange={(newValue, editor) => {
                        setFieldValue('description', newValue);
                        // setText(editor.getContent({ format: 'text' }));
                        editor.getContent({ format: 'text' });
                      }}
                    />

                    <Grid sx={{ gap: 1 }}>

                      <FileUploadFieldWrapper
                        htmlFor="photo"
                        label="Photo Image"
                        name="photo"
                        value={values.photo?.name || ''}

                        handleChangeFile={(e) => { setFieldValue("photo", e.target.files[0]) }}
                        handleRemoveFile={() => { setFieldValue("photo", undefined) }}
                      />

                      {editData?.photo_url
                        &&
                        <Avatar variant="square" sx={{ border: '1px solid lightgray', background: 'none', mb: 1, width: 100, height: 100 }}>
                          {/* <Image src={editData?.background_url} width={100} height={100} alt="logo" /> */}
                          <img src={editData?.photo_url} alt="photo" className=" h-fit w-20" />
                        </Avatar>
                      }
                      {/* </Grid> */}
                    </Grid>
                  </Grid>
                </DialogContent>

                {/* handle cancel dilog / close / submit dialog click cancel or add button */}
                <DialogActionWrapper
                  title="Notice"
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
