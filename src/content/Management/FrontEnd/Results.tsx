import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, DialogActions, DialogContent, Grid, TextField, Zoom } from '@mui/material';
import { NewHTTPClient } from '@/lib/HTTPClient';
import { FC, useEffect, useState } from 'react';
import { ResultProps } from '@/models/front_end';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import Image from 'next/image';

// @ts-ignore
const Results = ({ data, reFetchData }) => {
  console.log("data__", data);
  const { t }: { t: any } = useTranslation();
  const [header_image, setHeader_image] = useState(null)
  const [carousel_image, setCarousel_image] = useState(null)
  const [chairman_photo, setChairman_photo] = useState(null)
  const [principal_photo, setPrincipal_photo] = useState(null)

  useEffect(() => {
    console.log("carousel_image__", typeof (carousel_image), carousel_image);

    let cnt = []
    for (const i in carousel_image) {
      cnt.push(carousel_image[i])
    }
    console.log(cnt);
  }, [carousel_image])


  const getValue = () => {
    let cnt = []
    for (const i in carousel_image) {
      cnt.push(carousel_image[i])
    }
    return cnt.length > 0 ? (cnt.map(j => j.name).join(', ')) : false
  }
  return (
    <Formik
      initialValues={{
        header_image: data ? data?.header_image : '',
        carousel_image: data ? data?.carousel_image : '',

        school_history: data ? data?.school_history : '',

        chairman_photo: data ? data?.chairman_photo : '',
        chairman_speech: data ? data?.chairman_speech : '',

        principal_photo: data ? data?.principal_photo : '',
        principal_speech: data ? data?.principal_speech : '',

        submit: null
      }}
      // validationSchema={Yup.object().shape({
      //   title: Yup.string().max(255).required(t('The title field is required')),
      //   price: Yup.number().min(1).required(t('The price field is required')),
      //   duration: Yup.number()
      //     .min(1)
      //     .required(t('The duration field is required'))
      // })}
      onSubmit={async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          const successResponse = (message) => {
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            reFetchData();
          };


        } catch (err) {
          console.error(err);

          setStatus({ success: false });
          //@ts-ignore
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
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
        console.log("values__", values);

        return (
          <>
            <form onSubmit={handleSubmit}>

              <Grid spacing={2} gap={2} >

                {/* header_image */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image src={`/${data?.header_image}`}
                      height={200}
                      width={200}
                      alt='Header Image'
                      loading='lazy'
                    />

                  </Grid>
                  <Grid item sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="header_image"
                      label="select Header image"
                      name="header_image"
                      value={header_image?.name || ''}
                      handleChangeFile={(e) => { setHeader_image(e.target.files[0]) }}
                      handleRemoveFile={(e) => { setHeader_image(undefined) }}
                    />

                  </Grid>
                </Grid>
                {/* carousel_image */}
                <Grid container gap={1} justifyContent='center' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image
                      src={`/${data?.header_image}`}
                      height={200}
                      width={200}
                      alt='Carousel Image'
                      loading='lazy'
                    />

                  </Grid>

                  <Grid container justifyContent='center' sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="carousel_image"
                      label="select Carousel Image"
                      name="carousel_image"
                      multiple={true}
                      value={getValue() || ''}
                      // carousel_image?.map(j=>j?.name)?.join(', ') ||
                      handleChangeFile={(e) => { setCarousel_image(e.target.files) }}
                      handleRemoveFile={(e) => { setCarousel_image(undefined) }}
                    />

                  </Grid>
                </Grid>

                {/* school_history */}
                <Grid container item borderRadius='10px' marginBottom='10px'>
                  <TextField
                    id="outlined-basic"
                    label="School history"
                    error={Boolean(touched?.school_history && errors?.school_history)}
                    fullWidth
                    helperText={touched?.school_history && errors?.school_history}
                    name="school_history"
                    placeholder={t(`school history here...`)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.school_history}
                    variant="outlined"
                    minRows={4}
                    maxRows={5}
                    multiline
                  />
                </Grid>

                {/* chairman_photo */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image
                      height={200}
                      width={200}
                      alt='Chairman photo'
                      src={`/${data?.header_image}`}
                      loading='lazy'
                    />

                  </Grid>
                  <Grid item sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="chairman_photo"
                      label="select chairman photo"
                      name="chairman_photo"
                      value={chairman_photo?.name || ''}
                      handleChangeFile={(e) => { setChairman_photo(e.target.files[0]) }}
                      handleRemoveFile={(e) => { setChairman_photo(undefined) }}
                    />

                  </Grid>
                </Grid>
                {/* chairman_speech */}
                <Grid container item borderRadius='10px' marginBottom='10px'>
                  <TextField
                    id="outlined-basic"
                    label="Chairman Speech"
                    error={Boolean(touched?.chairman_speech && errors?.chairman_speech)}
                    fullWidth
                    helperText={touched?.chairman_speech && errors?.chairman_speech}
                    name="chairman_speech"
                    placeholder={t(`Chairman Speech here...`)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.chairman_speech}
                    variant="outlined"
                    minRows={4}
                    maxRows={5}
                    multiline
                  />
                </Grid>

                {/* principal_photo */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image
                      height={200}
                      width={200}
                      alt='Principal photo'
                      src={`/${data?.header_image}`}
                      loading='lazy'
                    />

                  </Grid>
                  <Grid item sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="principal photo"
                      label="select principal photo"
                      name="chairman_photo"
                      value={principal_photo?.name || ''}
                      handleChangeFile={(e) => { setPrincipal_photo(e.target.files[0]) }}
                      handleRemoveFile={(e) => { setPrincipal_photo(undefined) }}
                    />

                  </Grid>
                </Grid>
                {/* principal_speech */}
                <Grid container item borderRadius='10px' marginBottom='10px'>
                  <TextField
                    id="outlined-basic"
                    label="Principal speech"
                    error={Boolean(touched?.principal_speech && errors?.principal_speech)}
                    fullWidth
                    helperText={touched?.principal_speech && errors?.principal_speech}
                    name="principal_speech"
                    placeholder={t(`Principal speech here...`)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.principal_speech}
                    variant="outlined"
                    minRows={4}
                    maxRows={5}
                    multiline
                  />
                </Grid>
              </Grid>

              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={() => { }}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                  //@ts-ignore
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Add frontend')}
                </Button>
              </DialogActions>
            </form>
          </>
        );
      }}
    </Formik>
  )
};

export default Results;
