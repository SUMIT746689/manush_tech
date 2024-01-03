import * as Yup from 'yup';
import { Formik, useFormikContext, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Grid, DialogTitle, DialogContent, Typography, Card, DialogActions } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { TextFieldWrapper } from '@/components/TextFields';
import { useEffect, useRef, useState } from 'react';
import { LoadingIcon } from '@/components/Loading/Loading';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';


function PageHeader({ periods }): any {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleCreateProjectSuccess = (message) => {
    showNotification(message);
  };

  const handlePeriodChange = (e, value) => {
    setNote(null)
    if (!value?.id) return;
    const findPeriod = periods.find(period => period.id === value.id);
    setSelectedPeriod(() => findPeriod)
  }

  const handlePeriodSubmit = () => {
    if (!selectedPeriod) return;

    setIsLoading(true);
    // const todayString = getToday();
    // const date = new Date(); 
    const { subject_id, id: period_id } = selectedPeriod;
    axios.get(`/api/notes?period_id=${period_id}&subject_id=${subject_id}&get_type=individual`)
      .then((res: any) => {
        // @ts-ignore
        const { data } = res;
        // @ts-ignore
        if (data) setNote(() => data)
        // console.log({ response: data });
      })
      .catch(err => { console.log({ err }) })
      .finally(() => { setIsLoading(false) })
  };

  const handleSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successProcess = (message) => {
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateProjectSuccess(message);
        // reFetchData();
        resetForm();
      };
      const { subject_id, id: period_id } = selectedPeriod;
      if (!subject_id || !period_id) showNotification("required subject id", "error");

      _values["subject_id"] = subject_id;
      _values["period_id"] = period_id;

      const res = await axios.post('/api/notes', _values);
      if (res.status == 200) {
        successProcess(t('request successfully completed'));
        setNote(() => null)
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  return (
    <Grid display="grid" gap={2}>

      <Grid
        // sx={{ display: 'flex', marginX: 'auto' }}
        justifyContent="center"
        gap={2}
        px={1}
      >
        <Card sx={{ pt: 1, px: 1, mt: 1, display: 'grid', gridTemplateColumns: '2fr 100px', columnGap: 1, maxWidth: 700, mx: 'auto' }}>
          <AutoCompleteWrapper
            minWidth="100%"
            label='Select Period'
            placeholder='select a period...'
            options={periods?.map(period => {
              const { id } = period;
              return ({
                label: `Class - ${period?.section?.class?.name || ''} | Section - ${period.section?.name || ''} | Room - ${period.room?.name || ''} | Subject - ${period.subject?.name || ''}`,
                id
              })
            })}
            value={undefined}
            handleChange={handlePeriodChange}
          />

          <ButtonWrapper disabled={!selectedPeriod} handleClick={handlePeriodSubmit}>
            {isLoading ?
              <LoadingIcon color='inherit' />
              // <CircularProgress color="inherit" sx={{ width: 500 }} /> 
              : "Search"}
          </ButtonWrapper>

        </Card>


      </Grid>

      <Card
        sx={{ maxWidth: 500, mx: 'auto' }}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {note ? t('Edit Note') : t('Create New Note')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Use this dialog window to ${note ? 'Edit ' : 'add a new'
              } Note`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          validateOnMount={true}
          initialValues={{
            note: note?.note,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            note: Yup.string()
              .min(1)
              .max(255)
              .required(t('The note field is required')),
          })}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container >
                  {/* 
                  <TextFieldWrapper
                    name="note"
                    label={t('Note')}
                    errors={errors.note}
                    touched={touched.note}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.note}
                  /> */}
                  <GateWaySelect note={note?.note} />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Grid width={100} pr={2} pt={1}>
                  <ButtonWrapper width={100} disabled={Boolean(errors.submit) || isSubmitting} handleClick={handleSubmit}>
                    Submit
                  </ButtonWrapper>
                </Grid>
              </DialogActions>


            </form>
          )}
        </Formik>
      </Card>
    </Grid>
  );
}

const GateWaySelect = ({ note }) => {
  const { t }: { t: any } = useTranslation();
  const { handleBlur, handleChange, values, touched, blur, errors, setFieldValue }: any = useFormikContext()
  // const noteRef = useRef(null);

  useEffect(() => {
    setFieldValue("note", note || '');
    if (note) {
      // noteRef.current?.focus();
      handleBlur("note");
      // touched = {note:true}
    }
  }, [note])
  console.log({ blur, touched, values });

  return (

    <TextFieldWrapper
      // ref={noteRef}
      name="note"
      label={t('Note')}
      errors={errors.note}
      touched={touched.note}
      handleBlur={handleBlur}
      handleChange={handleChange}
      value={values.note}
    />
  )
}

export default PageHeader;
