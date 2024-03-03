import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, DialogContent, Button } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { NewFileUploadFieldWrapper, TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { handleFileChange } from 'utilities_api/handleFileUpload';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { getFile } from '@/utils/utilitY-functions';

function PageHeader({ editData, setEditData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [voiceFileRequiremntShow, setVoiceFileRequiremntShow] = useState(false);

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
      const formData = new FormData();
      // for (const property in _values) {
      //   console.log({ property })
      //   // formData.append()
      // }
      formData.append("name", _values.name);
      if (_values.voice_file) formData.append("voice_file", _values.voice_file[0]);
      console.log({ _values });

      const successResponse = (message) => {
        showNotification('voice sms template' + message + ' successfully');
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        reFetchData();
        handleCreateClassClose();
      };
      if (editData) {
        const res = await axios.patch(`/api/voice_msgs/templates/${editData.id}`, formData);
        successResponse('updated');
      } else {
        const res = await axios.post(`/api/voice_msgs/templates`, formData);
        successResponse('created');
      }
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
      {/* page head title and create button ui */}
      <PageHeaderTitleWrapper name="voice sms template" handleCreateClassOpen={handleCreateClassOpen} />

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        {/* dialog title */}
        <DialogTitleWrapper name={"Voice Sms Templates"} editData={editData} />

        <Formik
          initialValues={{
            name: editData?.name || undefined,
            voice_file: undefined,
            preview_voice_file: [],
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The name field is required')),
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
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container>
                    <Grid>Name:</Grid>
                    <TextFieldWrapper
                      label=""
                      name="name"
                      value={values.name}
                      touched={touched.name}
                      errors={errors.name}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      required={true}
                    />

                    <Grid item width="100%">
                      <Grid item pb={0.5}>Select Audio File: (wav) *</Grid>
                      <NewFileUploadFieldWrapper
                        label='Upload Audio File '
                        htmlFor="voice_file"
                        accept=".wav,.WAV"
                        handleChangeFile={(event) => { handleFileChange(event, setFieldValue, "voice_file", "preview_voice_file") }}
                      />
                      <Button size="small" onClick={() => setVoiceFileRequiremntShow(true)} >File format instructions </Button> | <a href='https://g711.org/'><Button size="small">Convert file</Button></a>
                    </Grid>

                    {
                      Array.isArray(values?.preview_voice_file) &&
                      values.preview_voice_file.length > 0 &&
                      <>
                        Preview Audio File: <br />
                        {
                          values?.preview_voice_file?.map((preview_file, id) => (
                            <React.Fragment key={id} >
                              <audio
                                style={{ width: "100%" }}
                                controls
                                src={preview_file.src}>
                                Your browser does not support the
                                <code>audio</code> element.
                              </audio>
                              <Grid container pt={0.5}>File Name: {preview_file.name}</Grid>
                              {/* <ButtonWrapper sx={{ color: minWidth: "fit-content" }} handleClick={() => handleFileRemove(setFieldValue, "file_upload", "preview_file_upload")} >Remove</ButtonWrapper> */}
                            </React.Fragment>
                          ))
                        }
                      </>
                    }

                    {
                      editData?.voice_url &&
                      <>
                        <audio
                          style={{ width: "100%" }}
                          controls
                          src={getFile(editData?.voice_url)}>
                          Your browser does not support the
                          <code>audio</code> element.
                        </audio>
                      </>
                    }

                  </Grid>
                </DialogContent>

                {/* handle cancel dilog / close / submit dialog click cancel or add button */}
                <DialogActionWrapper
                  title={'sms template'}
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
