import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DisableButtonWrapper } from '@/components/ButtonWrapper';

function PageHeader({
  editSubject,
  setEditSubject,
  reFetchSubjects,
  classList,
  exams,
  addlmarkingCats
}) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedAddlMarkingCats, setSelectedAddlMarkingCats] = useState([]);

  useEffect(() => {
    if (editSubject) {
      setSelectedAddlMarkingCats(() => editSubject?.examAddtinalMark?.map((addlMark => {
        return { ...addlMark?.addtionalMarkingCategorie, total_mark: addlMark.total_mark, exam_addtional_mark_id: addlMark.id }
      })) || []);
      handleCreateClassOpen();
    }
  }, [editSubject]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setSelectedClass([])
    setEditSubject(null);
    setSelectedAddlMarkingCats(() => [])
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message);
    handleCreateClassClose()
    reFetchSubjects();
  };
  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      // const addtional_marks = selectedAddlMarkingCats.map(({ id, total_mark }) => ({ addtional_mark_id: id, total_mark }))
      // const { id: exam_id } = editSubject; exam_addtional_mark_id
      if (editSubject) {
        const addtional_marks = selectedAddlMarkingCats.map(({ exam_addtional_mark_id, total_mark }) => ({ id: exam_addtional_mark_id, total_mark }))

        await axios.patch(`/api/exam/addtional_marks`, { ..._values, addtional_marks })
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t('The subject was updated successfully'));
      }
      else {

        const addtional_marks = selectedAddlMarkingCats.map(({ id, total_mark }) => ({ addtional_mark_id: id, total_mark }))

        if (addtional_marks.length === 0) throw new Error("no addtional marks ...")

        await axios.post(`/api/exam/addtional_marks`, { ..._values, addtional_marks })
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t('The subject was created successfully'));

      }

      // await wait(1000);
    } catch (err) {
      console.error(err);
      showNotification(t('There was an error, try again'), 'error');
      setStatus({ success: false });
      // @ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleAddlMarkingCats = (id, total_mark) => {
    setSelectedAddlMarkingCats((values) => {
      return values.map((value) => {
        if (value.id !== id) return value
        return { ...value, total_mark: parseInt(total_mark) }
      })
      // values.find(v=>v.id === id)
    })
  }
  return (
    <>
      <PageHeaderTitleWrapper
        handleCreateClassOpen={handleCreateClassOpen}
        name="Addtional marks"
      />

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(editSubject ? 'Edit Addtional Marks' : 'Add new Addtional Mark')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and edit a Exam Addtional Marks')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            // title: editSubject?.title || '',
            exam_id: editSubject ? editSubject?.id : undefined,
            addtional_mark_ids: editSubject ? editSubject?.examAddtinalMark?.map(v => ({ total_mark: v.total_mark, id: v.addtionalMarkingCategorie.id, label: v.addtionalMarkingCategorie.title })) : [],
          }}
          validationSchema={Yup.object().shape({
            // title: Yup.string()
            //   .max(255)
            //   .required(t('The class name field is required')),
            exam_id: Yup.number()
              .positive()
              .integer()
              .required(t('The exam id field is required')),
            // addtional_mark_ids: editSubject ? Yup.number()
            //   .positive()
            //   .integer()
            //   .required(t('The class field is required')) : Yup.array().required(t('The class field is required')),

          })}
          onSubmit={handleFormSubmit}
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
            console.log({ values })
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={1}>

                    <AutoCompleteWrapper
                      disabled={editSubject}
                      minWidth="100%"
                      value={exams.find((exam) => exam.value === values.exam_id) || null}
                      options={exams}
                      label="Select Exam"
                      placeholder={"select exam..."}
                      handleChange={(event, value) => setFieldValue('exam_id', value?.value || null)}
                    />
                    <AutoCompleteWrapper
                      disabled={editSubject ? true : false}
                      // multiple={editSubject ? false : true}
                      minWidth="100%"
                      multiple={true}
                      // value={editSubject ? (addlmarkingCats.find((cls) => cls.value === values.addtional_mark_ids) || null) : selectedClass}
                      // value={[{label:'Attendance',id:1}]}
                      value={values.addtional_mark_ids}
                      options={addlmarkingCats}
                      label="Select Addtional Mark Categories"
                      placeholder={"select addtional marking categories..."}
                      // @ts-ignore
                      handleChange={(event, value) => {
                        console.log("value__", value);
                        // if (editSubject) {
                        //   setFieldValue('addtional_mark_ids', value?.value || null)
                        // }
                        // else {
                        setSelectedClass(value);
                        setSelectedAddlMarkingCats((cats) => value?.map(v => {
                          const category = cats.find(cat => cat.id === v.value);
                          if (category) return category
                          return { id: v.value, title: v.label }
                        }))
                        setFieldValue('addtional_mark_ids', value)
                        // }

                      }}
                    />
                    {
                      values?.addtional_mark_ids &&
                      selectedAddlMarkingCats?.map((value) => <AddlMarkingCategories key={value.id} value={value} handleAddlMarkingCats={handleAddlMarkingCats} />)
                    }
                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  titleFront={"Add"}
                  title={"Exam Addtional Marks"}
                  editData={editSubject}
                  errors={errors}
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



const AddlMarkingCategories = ({ value, handleAddlMarkingCats }) => {
  console.log({ value })
  return (
    <Grid item width={"100%"} display="grid" gridTemplateColumns={"1fr 1fr"} columnGap={1}>
      {/* <TextFieldWrapper */}
      <TextField
        size='small'
        sx={{
          [`& fieldset`]: {
            borderRadius: 0.6,
          }
        }}
        id="outlined-basic"
        label={"Addtional Marking Category"}
        name={"addtinoal_marking_category"}
        value={value.title}
        disabled={true}
      />
      <TextField
        size='small'
        sx={{
          [`& fieldset`]: {
            borderRadius: 0.6,
          }
        }}
        value={value.total_mark}
        id='outlined-basic'
        label={'Total Mark'}
        name={'total_mark'}
        type='number'
        inputProps={{ min: 0 }}
        onChange={(e) => handleAddlMarkingCats(value.id, e.target.value)}
      // value={values.total_mark}
      // handleChange={handleChange}
      // handleBlur={handleBlur}
      // errors={errors.total_mark}
      // touched={touched.total_mark}

      />
    </Grid>
  )
}