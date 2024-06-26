import { useState } from 'react';
import * as Yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { Grid, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { TextFieldWrapper } from '@/components/TextFields';

function Add({ reFetchData, isOpen, setTeacherId, teacherId, schoolId }) {
  const { data: classData, error: classError } = useClientFetch('/api/class');
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(isOpen);
  const { user } = useAuth();
  const { showNotification } = useNotistick();
  const [checked, setChecked] = useState(false);
  const [sections, setSections] = useState<Array<any>>([]);
  const [subjectList, setSubjectList] = useState<Array<any>>([]);
  const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    try {
      //  teacherId
      // schoolId
      // _values.section_id
      // _values.subject_id
      // _values.class_id
      // payment_type: _values.payment_type_id
      // _values.amount
      const feesObj = {};
      if (_values.payment_type_id === 'percentage') {
        feesObj['percentage_amount'] = _values.amount;
      } else if (_values.payment_type_id === 'flat') {
        feesObj['fixed_amount'] = _values.amount;
      }
      const res = await axios.post('/api/teacher/teacher_fees', {
        ...feesObj,
        teacher_id: teacherId,
        school_id: schoolId,
        section_id: _values.section_id,
        subject_id: _values.subject_id,
        class_id: _values.class_id,
        payment_type: _values.payment_type_id
      });

      if (res) {
        showNotification(`Teacher fees added successfully!`, 'success');

        setTeacherId(null);
        resetForm();

        //reFetchData();
      }
    } catch (err) {
      if (err?.response?.data?.error) {
        showNotification(`${err?.response?.data?.error}`, 'error');
      }
    }
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setTeacherId(null);
  };

  const handleClassSelect = (newValue) => {
    if (newValue) {
      const targetClassSections = classData.find((i) => i.id == newValue.id);
      //setSelectedClass(newValue);

      const setTargetSection = targetClassSections?.sections?.map((i) => {
        return {
          label: i.name,
          id: i.id
        };
      });
      setSections([...setTargetSection]);
    } else {
      setSections([]);
    }
  };

  // subject list function
  const subjectListFn = (classInfo) => {
    axios
      .get(`/api/subject?class_id=${classInfo.id}`)
      .then((res) => {
        const filterArr = res?.data.map((item) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setSubjectList(filterArr);
      })
      .catch((error) => {
        setSubjectList([]);
      });
  };
  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleCreateClassClose} sx={{ borderRadius: 0.5 }}>
        <DialogTitleWrapper editData={false} name="Teacher Fees" />

        <Formik
          initialValues={{
            class: '',
            class_id: undefined,
            section: '',
            section_id: undefined,
            subject: '',
            subject_id: undefined,
            payment_type: '',
            payment_type_id: undefined,
            amount: ''
          }}
          validationSchema={Yup.object().shape({
            class_id: Yup.number().min(1).required(t('The class field is required')),
            section_id: Yup.number().min(1).required(t('The section field is required')),
            subject_id: Yup.number().min(1).required(t('The subject field is required')),
            payment_type_id: Yup.string().min(1).required(t('The payment field is required')),
            amount: Yup.string().min(1).required(t('The amount field is required'))
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3,
                    borderRadius: 0.5
                  }}
                >
                  <Grid container spacing={1}>
                    {/* class related code */}
                    <Grid item md={6}>
                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Class"
                        placeholder="Select Class"
                        multiple={false}
                        value={values.class || null}
                        options={
                          classData?.map((i) => {
                            return {
                              label: i.name,
                              id: i.id,
                              has_section: i.has_section
                            };
                          }) || []
                        }
                        name="class"
                        error={errors?.class_id}
                        touched={touched?.class_id}
                        // @ts-ignore
                        handleChange={(e, value: any) => {
                          if (value) {
                            subjectListFn(value);
                            setFieldValue('class', value);
                            setFieldValue('class_id', value.id);
                            setFieldValue('section', undefined);
                            setFieldValue('section_id', undefined);
                            setFieldValue('subject', undefined);
                            setFieldValue('subject_id', undefined);
                            handleClassSelect(value);
                          } else {
                            setFieldValue('class', undefined);
                            setFieldValue('class_id', undefined);
                            setFieldValue('section', undefined);
                            setFieldValue('section_id', undefined);
                            setFieldValue('subject', undefined);
                            setFieldValue('subject_id', undefined);
                            setSections([]);
                            setSubjectList([]);
                          }
                        }}
                      />
                      {/* @ts-ignore */}
                      <ErrorMessage name="class_id" component="div" style={{ color: 'red' }} />
                    </Grid>
                    {/* section related code */}
                    <Grid item md={6}>
                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Batch"
                        placeholder="Select Batch"
                        multiple={false}
                        value={values.section || null}
                        options={sections}
                        name="section"
                        error={errors?.section_id}
                        touched={touched?.section_id}
                        // @ts-ignore
                        handleChange={(e, value: any) => {
                          if (value) {
                            setFieldValue('section', value);
                            setFieldValue('section_id', value.id);
                          } else {
                            setFieldValue('section', undefined);
                            setFieldValue('section_id', undefined);
                          }
                        }}
                      />
                      {/* @ts-ignore */}
                      <ErrorMessage name="section_id" component="div" style={{ color: 'red' }} />
                    </Grid>
                    {/* subject related code */}
                    <Grid item md={6}>
                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Subject"
                        placeholder="Select Subject"
                        multiple={false}
                        value={values.subject || null}
                        options={subjectList}
                        name="subject"
                        error={errors?.subject_id}
                        touched={touched?.subject_id}
                        // @ts-ignore
                        handleChange={(e, value: any) => {
                          if (value) {
                            setFieldValue('subject', value);
                            setFieldValue('subject_id', value.value);
                          } else {
                            setFieldValue('subject', undefined);
                            setFieldValue('subject_id', undefined);
                          }
                        }}
                      />
                      {/* @ts-ignore */}
                      <ErrorMessage name="subject_id" component="div" style={{ color: 'red' }} />
                    </Grid>
                    {/* pay type */}
                    <Grid item md={6}>
                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Payment Type"
                        placeholder="Select Payment Type"
                        multiple={false}
                        value={values.payment_type || null}
                        options={[
                          {
                            id: 'percentage',
                            label: 'Percentage-Based'
                          },
                          {
                            id: 'flat',
                            label: 'Fixed-Amount-Based'
                          }
                        ]}
                        name="payment_type"
                        error={errors?.payment_type_id}
                        touched={touched?.payment_type_id}
                        // @ts-ignore
                        handleChange={(e, value: any) => {
                          if (value) {
                            setFieldValue('payment_type', value);
                            setFieldValue('payment_type_id', value.id);
                          } else {
                            setFieldValue('payment_type', undefined);
                            setFieldValue('payment_type_id', undefined);
                          }
                        }}
                      />
                      {/* @ts-ignore */}
                      <ErrorMessage name="payment_type_id" component="div" style={{ color: 'red' }} />
                    </Grid>
                    {/* amount  */}
                    <Grid item md={6}>
                      <TextFieldWrapper
                        disabled={values.payment_type_id ? false : true}
                        label="Amount"
                        name="amount"
                        type="number"
                        touched={undefined}
                        errors={undefined}
                        value={values.amount || null}
                        handleChange={(e) => {
                          if (values.payment_type_id === 'percentage' && parseInt(e?.target?.value) > 100) {
                          } else {
                            setFieldValue('amount', Math.abs(parseInt(e?.target?.value)));
                          }
                        }}
                        handleBlur={undefined}
                      />
                      {/* @ts-ignore */}
                      <ErrorMessage name="amount" component="div" style={{ color: 'red' }} />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  title="Fees"
                  errors={errors}
                  editData={false}
                  handleCreateClassClose={() => setTeacherId(null)}
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

// const SearchTeacher = ({ setFieldValue, index, values, searchType, disabled }) => {
//   const [searchValue, setSearchValue] = useState();
//   const [searchOptionData, setSearchOptionData] = useState([]);

//   const handleDebounce = async (value) => {
//     try {
//       if (value?.length >= 2) {
//         const res = await axios.get(`/api/teacher/search-teachers?search_type=${searchType}&search_value=${value?.toLowerCase()}`);
//         const userInfoArr = res?.data?.map((item) => {
//           return {
//             label: `${item.name} | ${item.teacher_id || ''}`,
//             id: item.id,
//             teacher_id: item.student_id
//             // student_table_id: item.student_table_id
//           };
//         });
//         setSearchOptionData(userInfoArr);
//       } else if (value?.length < 2) {
//         setSearchOptionData([]);
//       } else if (!value) {
//         setSearchOptionData([]);
//       }
//     } catch (error) {}
//   };

//   const searchHandleChange = async (event: ChangeEvent<HTMLInputElement>, v) => {
//     setSearchValue(v);
//   };

//   const searchHandleUpdate = (event: ChangeEvent<HTMLInputElement>, v) => {
//     const subjects_ = values.subjects;
//     subjects_[index]['teacher'] = v;
//     setFieldValue('subjects', subjects_);
//     setSearchValue(v || null);
//   };

//   return (
//     <AutoCompleteWrapperWithDebounce
//       disabled={disabled}
//       debounceTimeout={500}
//       handleDebounce={handleDebounce}
//       // @ts-ignore
//       searchHandleUpdate={searchHandleUpdate}
//       options={searchOptionData}
//       value={searchValue}
//       handleChange={searchHandleChange}
//       label="Search Teacher"
//       placeholder="Search Teacher"
//     />
//   );
// };

export default Add;
