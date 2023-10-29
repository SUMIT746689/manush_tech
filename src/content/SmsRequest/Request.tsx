import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { DialogTitle, DialogActions, DialogContent, Typography, CircularProgress, Button, useTheme, Card, Grid, TextField } from '@mui/material';
// import { useSnackbar } from 'notistack';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
// import { DropDownSelectWrapper } from '@/components/DropDown';
import { TextFieldWrapper } from '@/components/TextFields';


function PageHeader({ packages }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();
  // const { user } = useAuth();
  const theme = useTheme();
  // const [documentFile, setDocumentFile] = useState();
  const { showNotification } = useNotistick()
  useEffect(() => {
    if (packages) handleCreateClassOpen();
  }, [packages]);

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });

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
    // masking_count:  Yup.number()  ,
    // non_masking_count:  Yup.number()  ,
    // package_id: Yup.number()
    //   .min(1)
    //   .required(t('The package field is required')),
    document_photo: Yup.mixed().required('A file is required')
    // .test(
    //   "fileSize",
    //   "File too large",
    //   value => {
    //     console.log({value})
    //     return value && value?.size <= FILE_SIZE
    //   }
    // )
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   value => value && SUPPORTED_FORMATS.includes(value.type)
    // )
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
      };

      const formData = new FormData();
      formData.append('document_photo', _values.document_photo);
      formData.append('masking_count', _values.masking_count);
      formData.append('non_masking_count', _values.non_masking_count);

      const response = await axios({
        method: 'post',
        url: '/api/buy_sms_requests',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response) {
        console.log("response___XXXXXXX____", response);
        successResponse('created');
      }

    } catch (err) {
      console.error(err);

      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
      showNotification(err?.response?.data?.message, 'error')
    }
  };

  const FILE_SIZE = 160 * 1024;
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png'
  ];

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

            masking_count: undefined,
            non_masking_count: undefined,
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
            console.log({errors})
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  {/* <Grid container spacing={1}> */}
                  {/* <Grid
                      item
                      container
                      sx={{
                        mb: `${theme.spacing(1)}`
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        fullWidth
                        value={
                          packages?.data?.find(
                            (pkg: any) => pkg.id === values.package_id
                          ) || null
                        }
                        options={packages?.success ? packages.data : []}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.title === value.title
                        }
                        getOptionLabel={
                          (option) =>
                            option?.title + ' - ' + option?.price + ' '
                          // +
                          // option?.currency
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={Boolean(
                              touched?.package_id && errors?.package_id
                            )}
                            helperText={
                              touched?.package_id && errors?.package_id
                            }
                            name="package_id"
                            label={t('Select Package ')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(e, value: any) => {
                          console.log({ value });
                          setFieldValue('package_id', value?.id || 0);
                        }}
                      />
                    </Grid> */}


                  <TextFieldWrapper
                    label="No Of Sms ( Masking )"
                    errors={errors?.masking_count}
                    touched={touched?.masking_count}
                    name="masking_count"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values?.masking_count}
                    type="number"
                  />

                  <TextFieldWrapper
                    label="No Of Sms ( Non Masking )"
                    errors={errors?.non_masking_count}
                    touched={touched?.non_masking_count}
                    name="non_masking_count"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values?.non_masking_count}
                    type="number"
                  />

                  <Grid container item >
                    <TextField
                      // sx={{backgroundColor:'red',height:'100%',textDecoration:"none"}}
                      type="file"
                      id="outlined-basic"
                      error={Boolean(touched?.document_photo && errors?.document_photo)}
                      fullWidth
                      helperText={
                        touched?.document_photo && errors?.document_photo
                      }
                      name="document_photo"
                      // placeholder={t(`select related document here...`)}
                      onBlur={handleBlur}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        console.log(event.target.files[0]);
                        setFieldValue(
                          'document_photo',
                          event.target?.files[0]
                        );
                      }}
                      // value={values?.document_photo}
                      variant="outlined"
                    />
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
