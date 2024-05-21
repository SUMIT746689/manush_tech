import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import {
  Grid,
  Dialog,
  DialogContent,
} from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, AutoCompleteWrapperWithoutRenderInput } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';

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
      const customMonths = _values.months.map(month => month.value);
      const class_ids = _values.class_ids.map(cls => cls.value);
      // dayjs(_values.last_date).format('YYYY-MM-DD')

      if (editData) {
        const res = await axios.patch(`/api/fee/${editData.id}`, { ..._values, months: customMonths, class_ids });
        successResponse('updated');
      } else {
        _values['late_fee'] = _values?.late_fee ? _values?.late_fee : 0;
        const res = await axios.post(`/api/fee`, { ..._values, months: customMonths, class_ids });
        successResponse('created');
      }
    } catch (err) {
      handleShowErrMsg(err, showNotification);
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
            class_id: editData?.class_id || null,
            class_ids: [],
            // frequency: editData?.frequency || undefined,
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
            months: !editData && Yup.array().min(1, "select a month"),
            class_ids: !editData && Yup.array().min(1, "select a class"),
            // class_id: Yup.number()
            //   .min(1)
            //   .required(t('class filed field is required'))
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
                  {/* <Grid display={'grid'} columnGap={2} rowGap={1} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}> */}
                  <Grid container columnSpacing={1} columns={12}>

                    {/* fees heads */}
                    <Grid item xs={12} sm={6}>
                      <AutoCompleteWrapperWithoutRenderInput
                        sm={6}
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
                    </Grid>

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
                    <Grid item xs={12} sm={6}>
                      <TextFieldWrapper
                        name="_for"
                        label="Fee For"
                        errors={errors?._for}
                        touched={touched?._for}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values?._for}
                      />
                    </Grid>

                    {/* Class */}
                    <Grid item xs={12}>
                      <AutoCompleteWrapperWithoutRenderInput
                        multiple={editData ? false : true}
                        disabled={editData}
                        minWidth="100%"
                        label="Select Class"
                        placeholder="select a class..."
                        value={editData ? classData.find((cls) => cls.value === values.class_id) : values.class_ids}
                        options={classData}
                        name="class_ids"
                        error={errors?.class_ids}
                        touched={touched?.class_ids}
                        // @ts-ignore
                        handleChange={(event, value) => setFieldValue('class_ids', value || [])}
                      />
                    </Grid>

                    {/* <Grid item minWidth="100%">
                      <DropDownSelectWrapper
                        value={values.frequency}
                        name='frequency'
                        label='Frequency'
                        handleChange={handleChange}
                        menuItems={['on_demand', 'half_yearly', 'monthly', 'annual']}
                      />
                    </Grid> */}

                    {/* Amount */}
                    <Grid item xs={12} sm={6}>
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
                    </Grid>

                    {/* late_fee */}
                    <Grid item xs={12} sm={6}>
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
                  </Grid>

                  {
                    !editData && <Grid item columnGap={1}>
                      <AutoCompleteWrapperWithoutRenderInput
                        minWidth="100%"
                        label="Select Month"
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
