import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme,
  Checkbox
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { DatePicker, DateTimePicker, MobileDatePicker } from '@mui/lab';
import useNotistick from '@/hooks/useNotistick';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, AutoCompleteWrapperWithoutRenderInput } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(i => ({ label: i, value: i.toLocaleLowerCase() }))

function PageHeader({ name, feesHeads, editData, seteditData, classData, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (editData) handleCreateClassOpen();
  }, [editData]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setChecked(false)
    setOpen(false);
    seteditData(null);
  };

  const handleCreateUserSuccess = () => {
    seteditData(null);
    setOpen(false);
  };

  const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    try {

      console.log("submit");

      const successResponse = (message) => {
        showNotification('fees ' + message + ' successfully');
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess();
        reFetchData();
      };
      _values['last_date'] = new Date(_values.last_date).setHours(23, 59, 0, 0);
      _values['late_fee'] = parseFloat(_values.late_fee)
      _values['months'] = _values.months.map(month => month.value)
      // dayjs(_values.last_date).format('YYYY-MM-DD')

      if (editData) {
        const res = await axios.patch(`/api/fee/${editData.id}`, _values);
        successResponse('updated');
      } else {
        _values['late_fee'] = _values?.late_fee ? _values?.late_fee : 0;
        const res = await axios.post(`/api/fee`, _values);
        successResponse('created');
      }
    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.message, 'error')
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  const handleSelectAllMonths = (setValue) => {
    setValue('months', month)
  }
  const handleRemoveAllMonths = (setValue) => {
    setValue('months', [])
  }

  return (
    <>
      <PageHeaderTitleWrapper
        name="Fees Management"
        handleCreateClassOpen={handleCreateClassOpen}
      />
      {/* <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Fees Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the fees can be managed from this page'
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateClassOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create fees')}
          </Button>
        </Grid>
      </Grid> */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >

        <DialogTitleWrapper editData={editData} name="fees" />

        <Formik
          initialValues={{
            fees_head_id: editData?.fees_head_id || undefined,
            title: editData?.title || undefined,
            amount: editData?.amount || undefined,
            school_id: user?.school_id || undefined,
            last_date: editData?.last_date || null,
            _for: editData?.for || undefined,
            academic_year_id: editData?.academic_year_id || academicYear?.id || undefined,
            class_id: editData?.class_id || undefined,
            frequency: editData?.frequency || undefined,
            months: [],
            late_fee: editData?.late_fee || 0,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            // title: Yup.string()
            //   .max(255)
            //   .required(t('The title field is required')),
            fees_head_id: Yup.number()
              .min(1, 'The fees head is required')
              .required(t('The fees head is required')),
            amount: Yup.number()
              .min(1)
              .required(t('The amount code field is required')),
            school_id: Yup.number()
              .min(1)
              .required(t('The school id is required')),
            // last_date: !checked && Yup.date().required(t('Date is required')),
            months: !editData && Yup.array().min(1, "select a month"),
            // academic_year_id: Yup.number()
            //   .min(1)
            //   .required(t('academic field is required')),
            class_id: Yup.number()
              .min(1)
              .required(t('class filed field is required'))
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            console.log({ values, errors })
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid display={'grid'} columnGap={2} rowGap={1} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>

                    {/* fees heads */}
                    <AutoCompleteWrapperWithoutRenderInput
                      minWidth="100%"
                      label="Select Fees Head"
                      placeholder="select a fees head..."
                      value={feesHeads.find((cls) => cls.value === values.fees_head_id) || null}
                      options={feesHeads}
                      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                      name="fees_head_id"
                      error={errors?.fees_head_id}
                      touched={touched?.fees_head_id}
                      // @ts-ignore
                      handleChange={(e, value: any) => setFieldValue('fees_head_id', value?.value || 0)}
                    />

                    {/* title  */}
                    {/* <TextFieldWrapper
                      errors={errors?.title}
                      touched={touched?.title}
                      name="title"
                      label="Title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.title}
                    /> */}

                    {/* fee's for which month */}
                    <TextFieldWrapper
                      name="_for"
                      label="Fee For"
                      errors={errors?._for}
                      touched={touched?._for}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?._for}
                    />


                    {/* Class */}
                    <AutoCompleteWrapperWithoutRenderInput
                      minWidth="100%"
                      label="Select Class"
                      placeholder="select a class..."
                      value={classData.find((cls) => cls.value === values.class_id) || null}
                      options={classData}
                      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                      name="class_id"
                      error={errors?.class_id}
                      touched={touched?.class_id}
                      // @ts-ignore
                      handleChange={(e, value: any) => setFieldValue('class_id', value?.value || 0)}
                    />

                    <Grid item minWidth="100%">
                      <DropDownSelectWrapper
                        value={values.frequency}
                        name='frequency'
                        label='Frequency'
                        handleChange={handleChange}
                        menuItems={['on_demand', 'half_yearly', 'monthly', 'annual']}
                      />
                    </Grid>

                    {/* Amount */}
                    <TextFieldWrapper
                      type="number"
                      errors={errors?.amount}
                      touched={touched?.amount}
                      name="amount"
                      label="Amount"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.amount}
                    />

                    {/* Last Date */}
                    {/* {
                      !checked && <MobileDatePicker
                        label="Last Date"
                        inputFormat='dd/MM/yyyy'
                        value={values?.last_date}
                        onChange={(value) => setFieldValue('last_date', value)}
                        renderInput={(params) => (
                          <TextField
                            size='small'
                            sx={{
                              [`& fieldset`]: {
                                borderRadius: 0.6,
                              },
                              mb: 1
                            }}
                            {...params}
                            name="last_date"
                            error={Boolean(errors?.last_date && touched?.last_date)}
                            fullWidth
                            defaultValue={''}
                            helperText={touched?.last_date && errors?.last_date}
                          />
                        )}
                      />
                    } */}

                    {/* late_fee */}
                    <TextFieldWrapper
                      type='number'
                      errors={errors?.late_fee}
                      touched={touched?.late_fee}
                      name="late_fee"
                      label={t(`Late Fee`)}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values?.late_fee}
                    />

                  </Grid>

                  {/* {
                    !editData && <Grid
                      container
                      display={'grid'}
                      gridTemplateColumns={'10% 90%'}
                      gap={1}
                    >
                      <Checkbox
                        sx={{ p: 0 }}
                        checked={checked}
                        onChange={(event) => {
                          console.log(event.target.checked);
                          if (!event.target.checked) {

                            setFieldValue('months', [])
                          } else {
                            setFieldValue('last_date', null)
                          }
                          setChecked(event.target.checked);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      <>
                        Do yo want monthly repetition ?
                      </>

                    </Grid>
                  } */}

                  {
                    !editData && <Grid item columnGap={1} pt={1}>
                      <AutoCompleteWrapperWithoutRenderInput
                        minWidth="100%"
                        label="Select multiple month"
                        placeholder="Month..."
                        multiple
                        value={values.months}
                        options={month}
                        name="month"
                        error={errors?.months}
                        touched={touched?.months}
                        // @ts-ignore
                        handleChange={(e, value: any) => setFieldValue('months', value)}
                      />
                      {
                        !editData && (
                          <Grid display="flex" justifyContent="start" columnGap={1}>
                            <ButtonWrapper variant="outlined" handleClick={() => handleSelectAllMonths(setFieldValue)}>Select All</ButtonWrapper>
                            <ButtonWrapper variant="outlined" handleClick={() => handleRemoveAllMonths(setFieldValue)}>Remove All</ButtonWrapper>
                          </Grid>
                        )
                      }

                    </Grid>
                  }


                  {
                    // !editData && checked && <Grid pt={1}>

                    //   {
                    //     values?.months?.map((option, index) => {
                    //       const onKeyDown = (e) => {
                    //         e.preventDefault();
                    //       };

                    //       return <>
                    //         <DatePicker
                    //           label={`${option.label} Last Date`}
                    //           inputFormat='dd/MM/yyyy'
                    //           value={option.last_date || null}
                    //           onChange={(n: any) => {
                    //             const temp = [...values.months];
                    //             temp[index].last_date = n;
                    //             console.log(temp);
                    //             setFieldValue('months', temp);
                    //           }}
                    //           renderInput={(params) => (
                    //             <TextField
                    //               required
                    //               size='small'
                    //               sx={{
                    //                 [`& fieldset`]: {
                    //                   borderRadius: 0.6,
                    //                 },
                    //                 mb: 1
                    //               }}
                    //               {...params}
                    //               onKeyDown={onKeyDown}
                    //               fullWidth
                    //             />
                    //           )}
                    //         />
                    //       </>
                    //     })
                    //   }


                    // </Grid>
                  }

                </DialogContent>
                <DialogActionWrapper
                  title="Fees"
                  errors={errors}
                  editData={editData}
                  handleCreateClassClose={handleCreateClassClose}
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
