import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button, Card, CircularProgress, DialogActions, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import Image from 'next/image';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { ButtonWrapper } from '@/components/ButtonWrapper';


const Results = ({ data, reFetchData }) => {

  console.log({ data });

  const { t }: { t: any } = useTranslation();
  const [notice, setNotice] = useState([{ title: '', headLine: '', body: '' }]);

  const [header_image, setHeader_image] = useState(null)
  const [carousel_image, setCarousel_image] = useState(null)
  const [gallery, setGallery] = useState(null)
  const [history_photo, setHistory_photo] = useState(null)
  const [chairman_photo, setChairman_photo] = useState(null)
  const [principal_photo, setPrincipal_photo] = useState(null)

  const { showNotification } = useNotistick();
  // useEffect(() => {
  //   console.log("carousel_image__", typeof (carousel_image), carousel_image);

  //   let cnt = []
  //   for (const i in carousel_image) {
  //     cnt.push(carousel_image[i])
  //   }
  //   console.log(cnt);
  // }, [carousel_image])

  useEffect(() => {
    if (data) {
      setNotice(data?.latest_news?.map(i => ({ title: i?.title, headLine: i?.headLine, body: i?.body })))
    }
  }, [data])

  const getValue = (carousel_image) => {
    let cnt = []
    for (const i in carousel_image) {
      cnt.push(carousel_image[i])
    }
    return cnt.map(j => j.name).join(', ')
  }
  return (
    <Formik
      enableReinitialize

      initialValues={{
        header_image: data ? data?.header_image : undefined,
        carousel_image: undefined,

        history_photo: data?.history_photo || '',
        school_history: data?.school_history || '',

        chairman_photo: data?.chairman_photo || '',
        chairman_speech: data?.chairman_speech || '',

        principal_photo: data?.principal_photo || '',
        principal_speech: data?.principal_speech || '',
        eiin_number: data?.eiin_number || '',

        facebook_link: data?.facebook_link || '',
        twitter_link: data?.twitter_link || '',
        google_link: data?.google_link || '',
        linkedin_link: data?.linkedin_link || '',
        youtube_link: data?.youtube_link || '',

        gallery: undefined,

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
            setStatus({ success: true });
            setSubmitting(false);
            showNotification(message)
          };

          console.log("_values", _values, notice);

          const formData = new FormData();

          for (let i in _values) {
            if (i == 'carousel_image') {
              const temp = _values[i]
              let nameList: any = []
              for (const j in temp) {
                if (typeof (temp[j]) == 'object') {
                  nameList.push({ name: temp[j].name })
                  formData.append('carousel_image', temp[j])
                }
              }
            }
            else if (i == 'gallery') {
              const temp = _values[i]
              let nameList: any = []
              for (const j in temp) {
                if (typeof (temp[j]) == 'object') {
                  nameList.push({ name: temp[j].name })
                  formData.append('gallery', temp[j])
                }
              }
            }
            else {
              formData.append(`${i}`, _values[i]);
            }
          }
          notice.forEach(element => {
            formData.append(`latest_news[]`, JSON.stringify(element));
          });

          axios.put('/api/front_end', formData)
            .then(res => {
              console.log(res);
              reFetchData();
              successResponse('Front end information updated !');
            }).catch(err => {
              console.log(err);
              showNotification('Front end information update failed !', 'error')
            })

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
        console.log("isSubmitting__", isSubmitting, errors);

        return (
          <>
            <form onSubmit={handleSubmit}>

              <Grid container spacing={2} gap={2} paddingTop={2} border='1px solid lightGray' p={2}>
                <Grid container item borderRadius='10px' marginBottom='10px'>
                  <TextField
                    id="outlined-basic"
                    label="Eiin number"
                    error={Boolean(touched?.eiin_number && errors?.eiin_number)}
                    fullWidth
                    helperText={touched?.eiin_number && errors?.eiin_number}
                    name="eiin_number"
                    placeholder={t(`Eiin number here...`)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.eiin_number}
                    variant="outlined"

                  />
                </Grid>

                {/* header_image */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image src={header_image ? header_image : `/api/get_file/${data?.header_image.replace(/\\/g, '/')}`}
                      height={150}
                      width={150}
                      alt='Header image'
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
                      value={values?.header_image?.name || values?.header_image || ''}
                      handleChangeFile={(e) => {
                        if (e.target?.files?.length) {
                          const photoUrl = URL.createObjectURL(e.target.files[0]);
                          setHeader_image(photoUrl)
                          setFieldValue('header_image', e.target.files[0])
                        }
                      }}
                      handleRemoveFile={(e) => {
                        setHeader_image(null);
                        setFieldValue('header_image', undefined)
                      }}
                    />

                  </Grid>

                </Grid>
                {/* carousel_image */}
                <Grid container gap={1} justifyContent='center' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>

                    {
                      carousel_image ? carousel_image?.map(j =>
                        <Grid >
                          <Image
                            src={j}
                            height={120}
                            width={120}
                            alt='Carousel Image'
                            loading='lazy'
                            objectFit='cover'
                          />

                        </Grid>) : data?.carousel_image?.map(i =>
                          <Grid  >
                            <Image
                              src={`/api/get_file/${i.path.replace(/\\/g, '/')}`}
                              height={120}
                              width={120}
                              alt='Carousel Image'
                              loading='lazy'
                              objectFit='cover'
                            />

                          </Grid>)
                    }
                  </Grid>

                  <Grid container justifyContent='center' sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="carousel_image"
                      label="select Carousel Image"
                      name="carousel_image"
                      multiple={true}
                      value={values?.carousel_image ? getValue(values?.carousel_image) : ''}
                      // carousel_image?.map(j=>j?.name)?.join(', ') ||
                      handleChangeFile={(e) => {
                        if (e.target.files.length) {
                          const container = []
                          for (const i of e.target.files) {
                            const photoUrl = URL.createObjectURL(i);
                            container.push(photoUrl)
                          }
                          setCarousel_image(container)
                          setFieldValue('carousel_image', e.target.files)
                        }

                      }}
                      handleRemoveFile={(e) => {
                        setCarousel_image(null)
                        setFieldValue('carousel_image', undefined)
                      }}

                    />
                  </Grid>
                </Grid>
                {/* gallery */}
                <Grid container gap={1} justifyContent='center' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>

                    {
                      gallery ? gallery?.map(j =>
                        <Grid >
                          <Image
                            src={j}
                            height={120}
                            width={120}
                            alt='Carousel Image'
                            loading='lazy'
                            objectFit='cover'
                          />

                        </Grid>) : data?.gallery?.map(i =>
                          <Grid  >
                            <Image
                              src={`/api/get_file/${i.path.replace(/\\/g, '/')}`}
                              height={120}
                              width={120}
                              alt='gallery'
                              loading='lazy'
                              objectFit='cover'
                            />

                          </Grid>)
                    }
                  </Grid>

                  <Grid container justifyContent='center' sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="gallery"
                      label="select gallery Image"
                      name="gallery"
                      multiple={true}
                      value={values?.gallery ? getValue(values?.gallery) : ''}
                      // carousel_image?.map(j=>j?.name)?.join(', ') ||
                      handleChangeFile={(e) => {
                        if (e.target.files.length) {
                          const container = []
                          for (const i of e.target.files) {
                            const photoUrl = URL.createObjectURL(i);
                            container.push(photoUrl)
                          }
                          setGallery(container)
                          setFieldValue('gallery', e.target.files)
                        }

                      }}
                      handleRemoveFile={(e) => {
                        setGallery(null)
                        setFieldValue('gallery', undefined)
                      }}

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
                    placeholder={t(`History Description here...`)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.school_history}
                    variant="outlined"
                    minRows={10}
                    maxRows={14}
                    multiline
                  />
                </Grid>

                {/* history_photo */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image
                      height={200}
                      width={200}
                      alt='History photo'
                      src={history_photo ? history_photo : `/api/get_file/${data?.history_photo?.replace(/\\/g, '/')}`}
                      loading='lazy'
                    />

                  </Grid>
                  <Grid item sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="history_photo"
                      label="select History photo"
                      name="history_photo"
                      value={values?.history_photo?.name || values?.history_photo || ''}
                      handleChangeFile={(e) => {
                        if (e.target.files?.length) {
                          const photoUrl = URL.createObjectURL(e.target.files[0]);
                          setHistory_photo(photoUrl)
                          setFieldValue('history_photo', e.target.files[0])
                        }

                      }}
                      handleRemoveFile={(e) => {
                        setHistory_photo(null)
                        setFieldValue('history_photo', undefined)
                      }}
                    />

                  </Grid>
                </Grid>
                {/* chairman_photo */}
                <Grid container justifyContent='space-around' border='1px solid #cccccc' borderRadius='10px' marginBottom='10px'>
                  <Grid item>
                    <Image
                      height={200}
                      width={200}
                      alt='Chairman photo'
                      src={chairman_photo ? chairman_photo : `/api/get_file/${data?.chairman_photo?.replace(/\\/g, '/')}`}
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
                      value={values?.chairman_photo?.name || values?.chairman_photo || ''}
                      handleChangeFile={(e) => {
                        if (e.target.files?.length) {
                          console.log("e.target.files__", e.target.files);

                          const photoUrl = URL.createObjectURL(e.target.files[0]);
                          setChairman_photo(photoUrl)
                          setFieldValue('chairman_photo', e.target.files[0])
                        }

                      }}
                      handleRemoveFile={(e) => {
                        setChairman_photo(null)
                        setFieldValue('chairman_photo', undefined)
                      }}
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
                      src={principal_photo ? principal_photo : `/api/get_file/${data?.principal_photo?.replace(/\\/g, '/')}`}
                      loading='lazy'
                    />

                  </Grid>
                  <Grid item sx={{
                    pt: '25px'
                  }}>
                    <FileUploadFieldWrapper
                      htmlFor="principal photo"
                      label="select principal photo"
                      name="principal_photo"
                      value={values?.principal_photo?.name || values?.principal_photo || ''}
                      handleChangeFile={(e) => {
                        if (e.target.files?.length) {
                          const photoUrl = URL?.createObjectURL(e.target.files[0]);
                          setPrincipal_photo(photoUrl)
                          setFieldValue('principal_photo', e.target.files[0])
                        }

                      }}
                      handleRemoveFile={(e) => {
                        setPrincipal_photo(null);
                        setFieldValue('principal_photo', undefined);
                      }}
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
                <Grid container gap={2} display={'grid'} gridTemplateColumns={'50% 50%'}>

                  {/* facebook_link */}
                  <Grid item borderRadius='10px' marginBottom='10px'>
                    <TextField
                      id="outlined-basic"
                      label="Facebook page link"
                      error={Boolean(touched?.facebook_link && errors?.facebook_link)}
                      fullWidth
                      helperText={touched?.facebook_link && errors?.facebook_link}
                      name="facebook_link"
                      placeholder={t(`Facebook page link here...`)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.facebook_link}
                      variant="outlined"
                    />
                  </Grid>
                  {/* twitter_link */}
                  <Grid item borderRadius='10px' marginBottom='10px'>
                    <TextField
                      id="outlined-basic"
                      label="Twitter page link"
                      error={Boolean(touched?.twitter_link && errors?.twitter_link)}
                      fullWidth
                      helperText={touched?.twitter_link && errors?.twitter_link}
                      name="twitter_link"
                      placeholder={t(`Twitter link here...`)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.twitter_link}
                      variant="outlined"
                    />
                  </Grid>
                  {/* google_link */}
                  <Grid item borderRadius='10px' marginBottom='10px'>
                    <TextField
                      id="outlined-basic"
                      label="Google++ profile link"
                      error={Boolean(touched?.google_link && errors?.google_link)}
                      fullWidth
                      helperText={touched?.google_link && errors?.google_link}
                      name="google_link"
                      placeholder={t(`Google++ profile link here...`)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.google_link}
                      variant="outlined"
                    />
                  </Grid>
                  {/* linkedin_link */}
                  <Grid item borderRadius='10px' marginBottom='10px'>
                    <TextField
                      id="outlined-basic"
                      label="Linkedin profile link"
                      error={Boolean(touched?.linkedin_link && errors?.linkedin_link)}
                      fullWidth
                      helperText={touched?.linkedin_link && errors?.linkedin_link}
                      name="linkedin_link"
                      placeholder={t(`Linkedin link profile link here...`)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.linkedin_link}
                      variant="outlined"
                    />
                  </Grid>
                  {/* youtube_link */}
                  <Grid item borderRadius='10px' marginBottom='10px'>
                    <TextField
                      id="outlined-basic"
                      label="Youtube profile link"
                      error={Boolean(touched?.youtube_link && errors?.youtube_link)}
                      fullWidth
                      helperText={touched?.youtube_link && errors?.youtube_link}
                      name="youtube_link"
                      placeholder={t(`Linkedin link profile link here...`)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.youtube_link}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {notice.map((field, index) => (
                  <Card sx={{ p: 2 }} >
                    <Grid container gap={2} display={'grid'} gridTemplateColumns={'50% 50%'}>
                      <TextField
                        key={index}
                        value={field?.title}
                        onChange={(e) => {
                          const updatedFields = [...notice];
                          updatedFields[index]['title'] = e.target.value;
                          setNotice(updatedFields);
                        }}
                        label="Notice Title"
                        variant="outlined"
                        margin="normal"
                      />
                      <Grid display={'grid'} justifyContent={'center'} alignContent={'center'}>
                        <ButtonWrapper
                          handleClick={() => {
                            const temp = [...notice]
                            temp.splice(index, 1)
                            setNotice(temp)
                          }}>
                          Remove
                        </ButtonWrapper>
                      </Grid>
                    </Grid>
                    <TextField
                      key={index}
                      value={field?.headLine}
                      onChange={(e) => {
                        const updatedFields = [...notice];
                        updatedFields[index]['headLine'] = e.target.value;
                        setNotice(updatedFields);
                      }}
                      label="Notice head line"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      key={index}
                      value={field?.body}
                      onChange={(e) => {
                        const updatedFields = [...notice];
                        updatedFields[index]['body'] = e.target.value;
                        setNotice(updatedFields);
                      }}
                      label="Notice body"
                      variant="outlined"
                      margin="normal"
                      maxRows={4}
                      minRows={2}
                      multiline
                      fullWidth
                    />
                  </Card>

                ))}

                <Grid container display={'grid'} justifyContent={'center'}>
                  <ButtonWrapper handleClick={() => setNotice([...notice, { title: '', headLine: '', body: '' }])}>
                    Add notice
                  </ButtonWrapper>
                </Grid>
              </Grid>

              <Grid display={'flex'} justifyContent={'center'} paddingTop={4}>

                <Button
                  sx={{
                    borderRadius: 0.5,
                    height: 36,
                    width: '50%',
                  }}
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Save')}
                </Button>


              </Grid>
            </form>
          </>
        );
      }}
    </Formik>
  )
};

export default Results;
