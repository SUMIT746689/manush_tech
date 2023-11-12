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
    if (editSubject) handleCreateClassOpen();
  }, [editSubject]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setSelectedClass([])
    setEditSubject(null);
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
      if (editSubject) {
        await axios.patch(`/api/subject/${editSubject.id}`, _values)
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateUserSuccess(t('The subject was updated successfully'));
      }
      else {

        // if (!_values?.class_id?.length) {
        //   throw new Error('please select class')
        // }
        // const data = _values?.class_id?.map(i => ({
        //   name: _values?.name,
        //   class_id: i.value
        // }))

        await axios.post(`/api/exam/addtional_marks`, { ..._values, addtional_marks: addlmarkingCats })
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
    console.log({ id, total_mark });
    setSelectedAddlMarkingCats((values) => {
      return values.map((value) => {
        if (value.id !== id) return value
        return { ...value, total_mark: parseInt(total_mark) }
      })
      // values.find(v=>v.id === id)
    })
  }
  console.log({ selectedAddlMarkingCats })
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
            exam_id: editSubject ? editSubject?.exam_id : undefined,
            // addlmarkingCats: editSubject ? editSubject?.addtional_mark_ids : [],
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
            console.log({ errors })
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
                      minWidth="100%"
                      value={exams.find((exam) => exam.value === values.exam_id) || null}
                      options={exams}
                      label="Select Exam"
                      placeholder={"select exam..."}
                      handleChange={(event, value) => setFieldValue('exam_id', value?.value || null)}
                    />
                    <AutoCompleteWrapper
                      multiple={editSubject ? false : true}
                      minWidth="100%"
                      value={editSubject ? (addlmarkingCats.find((cls) => cls.value === values.addtional_mark_ids) || null) : selectedClass}
                      options={addlmarkingCats}
                      label="Class"
                      placeholder={"select class..."}
                      // @ts-ignore
                      handleChange={(event, value) => {
                        console.log("value__", value);
                        if (editSubject) {
                          setFieldValue('addtional_mark_ids', value?.value || null)
                        }
                        else {
                          setSelectedClass(value)
                          setSelectedAddlMarkingCats((cats) => value?.map(v => {
                            const category = cats.find(cat => cat.id === v.value);
                            if (category) return category
                            return { id: v.value }
                          }))
                          setFieldValue('addtional_mark_ids', value)
                        }

                      }}
                    />


                    {
                      values.addtional_mark_ids?.map((value) => <AddlMarkingCategories key={value.id} id={value} selectedAddlMarkingCats={selectedAddlMarkingCats} handleAddlMarkingCats={handleAddlMarkingCats} />)
                    }
                    {/* <AutoCompleteWrapper
                      multiple={editSubject ? false : true}
                      minWidth="100%"
                      value={editSubject ? (classList.find((cls) => cls.value === values.class_id) || null) : selectedClass}
                      options={classList}
                      label="Class"
                      placeholder={"select class..."}
                      // @ts-ignore
                      handleChange={(event, value) => {
                        console.log("value__", value);
                        if (editSubject) {
                          setFieldValue('class_id', value?.value || null)
                        }
                        else {
                          setSelectedClass(value)
                          setFieldValue('class_id', value)
                        }

                      }}
                    /> */}
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

const AddlMarkingCategories = ({ id, handleAddlMarkingCats }) => {
  console.log({ id })
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
        value={id.value}
        disabled={true}
      />
      <TextFieldWrapper
        type='number'
        min={0}
        label={"Total Mark"}
        name={"total_mark"}
        handleChange={(e) => handleAddlMarkingCats(id.value, e.target.value)}
      // value={values.total_mark}
      // handleChange={handleChange}
      // handleBlur={handleBlur}
      // errors={errors.total_mark}
      // touched={touched.total_mark}

      />
    </Grid>
  )
}