import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { DialogTitle, DialogActions, DialogContent, Typography, CircularProgress, Button, useTheme, Card, Grid, TextField } from '@mui/material';
// import { useSnackbar } from 'notistack';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
// import { DropDownSelectWrapper } from '@/components/DropDown';
import { NewFileUploadFieldWrapper, PreviewImageCard, TextFieldWrapper } from '@/components/TextFields';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { formatNumber } from '@/utils/numberFormat';


function PageHeader({ packages }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { school } = user || {};
  const { masking_sms_price, non_masking_sms_price, currency } = school || {};
  console.log({ school });
  // const [documentFile, setDocumentFile] = useState();
  const { showNotification } = useNotistick()
  useEffect(() => {
    if (packages) handleCreateClassOpen();
  }, [packages]);

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });
  const [resume, setResume] = useState([]);
  const [previewResume, setPreviewResume] = useState([]);

  const handlePublicProfile = (event) => {
    setPublicProfile({
      ...publicProfile,
      [event.target.name]: event.target.checked
    });
  };

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
  };

  const handleCreateUserSuccess = () => {
    // enqueueSnackbar(t('The user account was created successfully'), {
    //   variant: 'success',
    //   anchorOrigin: {
    //     vertical: 'top',
    //     horizontal: 'right'
    //   },
    //   TransitionComponent: Zoom
    // });
    setOpen(false);
  };

  const handleValidationSchema = Yup.object().shape({
    sms_type: Yup.string().min(1, "sms type required").required('sms type field is required'),
    amount: Yup.number().min(1, "number required").required('amount field is required'),
    document_photo: Yup.array().min(1, "a file is required").max(1, "only one file can upload").required('a file is required')
  });

  const handleSubmit = async (_values, resetForm, setErrors, setStatus, setSubmitting) => {
    try {
      const successResponse = (message) => {
        //@ts-ignore
        showNotification(`Package request ${message}`)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess();
        setPreviewResume(()=>[])
      };

      const formData = new FormData();
      formData.append('sms_type', _values.sms_type);
      formData.append('amount', _values.amount);
      formData.append('document_photo', _values.document_photo[0]);

      const response = await axios({
        method: 'post',
        url: '/api/buy_sms_requests',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response) {
        // console.log("response___XXXXXXX____", response);
        successResponse('submit successfully');
      }

    } catch (err) {
      console.error(err);

      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
      showNotification(err?.response?.data?.error, 'error')
    }
  };

  const FILE_SIZE = 160 * 1024;
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png',
    'application/pdf',
    'application/vnd.ms-excel'
  ];

  const handleFileChange = (e, setFile, setPreviewFile) => {
    if (e?.target?.files?.length === 0) {
      setFile('document_photo', []);
      setPreviewFile(() => []);
      return;
    }
    // setFile(() => e.target.files[0]);
    const imgPrev = [];
    const img = [];
    Array.prototype.forEach.call(e.target.files, (file) => {
      img.push(file);
      const objectUrl = URL.createObjectURL(file);
      imgPrev.push({ name: file.name, src: objectUrl, type: file.type })
      // console.log({ objectUrl });
      // console.log({ file })
    });
    setFile('document_photo', img);
    setPreviewFile(() => imgPrev)
  }

  const handleRemove = (values, setFile, setPreviewFile) => {
    return (index) => {
      setPreviewFile((images) => {
        const imagesFilter = images?.filter((image, imgIndex) => imgIndex !== index);
        return imagesFilter;
      })
      const imagesFilter = values.document_photo?.filter((image, imgIndex) => imgIndex !== index);
      // console.log({ imagesFilter })
      setFile('document_photo', imagesFilter)
    }
  }
  return (
    <>
      <Card>
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Request for Buy Sms')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to request for add a package')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            sms_type: undefined,
            amount: undefined,
            document_photo: undefined,
            submit: null
          }}
          validationSchema={handleValidationSchema}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) =>
            handleSubmit(_values, resetForm, setErrors, setStatus, setSubmitting)
          }
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
          }) => {
            // console.log({ values, errors })
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <DropDownSelectWrapper
                    label="Sms Type*"
                    name="sms_type"
                    value={values.sms_type || ''}
                    menuItems={['masking', 'non-masking']}
                    // touched={touched.sms_type}
                    // errors={errors.sms_type}
                    handleChange={handleChange}
                  // handleBlur={handleBlur}
                  // required={true}
                  />
                  {<Grid color="red" pb={1} fontWeight={600} fontSize={13} pl={1}>{touched?.sms_type && errors?.sms_type && errors.sms_type}</Grid>}

                  <TextFieldWrapper
                    label="Amount*"
                    errors={errors?.amount}
                    touched={touched?.amount}
                    name="amount"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values?.amount || ''}
                    type="number"
                  // required={true}
                  />
                  {<Grid color="green" pb={1} fontWeight={600} fontSize={13} pl={1}>
                    Sms Qty({values.sms_type}): 
                    {values.sms_type === "masking" && formatNumber(Math.round((values.amount || 0) / (masking_sms_price || 0)))}
                    {values.sms_type === "non-masking" && formatNumber(Math.round((values.amount || 0) / (non_masking_sms_price || 0)))}
                  </Grid>}

                  <Grid item>
                    <Grid item>
                      <b>{t('Document')}:*</b>
                    </Grid>

                    <NewFileUploadFieldWrapper
                      htmlFor="document"
                      // name="left_images"
                      // multiple={true}
                      accept={SUPPORTED_FORMATS.join(',')}
                      handleChangeFile={(e) => handleFileChange(e, setFieldValue, setPreviewResume)}
                    />

                    {
                      previewResume?.length > 0 &&
                      <Grid>
                        Preview:
                      </Grid>
                    }

                    <Grid item >

                      {previewResume?.map((image, index) => (
                        <React.Fragment key={index} >
                          {
                            image.type === 'application/pdf' ?
                              <>
                                <iframe src={image.src} width="100%" />
                                <Button onClick={() => handleRemove(values, setFieldValue, setPreviewResume)(index)} size='small' color="error" sx={{ borderRadius: 0.5, height: 30 }}>Remove</Button>
                              </>
                              :
                              // <Card sx={{p:0.5,width:"300", height:"300px", overflow:"hidden"}}>
                              // <img src={image.src} alt={image.name} style={{ border:"1px solid gray",borderRadius:5,padding:10,boxShadow:"1p", objectFit:"contain",objectPosition:"center"}} />
                              // </Card>
                              <PreviewImageCard data={image} index={index} handleRemove={handleRemove(values, setFieldValue, setPreviewResume)} />
                            // ))}
                          }
                        </React.Fragment>
                      ))}
                      <Grid color="red" pb={1} fontWeight={600} fontSize={13} pl={1}>{touched?.document_photo && errors?.document_photo && errors.document_photo}</Grid>
                    </Grid>
                  </Grid>

                  {/* </Grid> */}
                </DialogContent>
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  {/* <Button color="secondary" onClick={handleCreateClassClose}>
                    {t('Cancel')}
                  </Button> */}
                  <Button
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    //@ts-ignore
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t(`Submit`)}
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
