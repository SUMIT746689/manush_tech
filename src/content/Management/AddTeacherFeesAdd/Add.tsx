import { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { Grid, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { DisableTextWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, AutoCompleteWrapperWithDebounce } from '@/components/AutoCompleteWrapper';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { label } from 'aws-amplify';

function Add({ isOpen, setOpenModal }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(isOpen);
  const { user } = useAuth();
  const { showNotification } = useNotistick();
  const [checked, setChecked] = useState(false);
  const [subjectLists, setSubjectLists] = useState([]);
  const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {};

  const handleCreateClassClose = () => {
    setOpen(false);
    setOpenModal(null);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleCreateClassClose} sx={{ borderRadius: 0.5 }}>
        <DialogTitleWrapper editData={false} name="Student Subject" />

        <Formik initialValues={{}} validationSchema={Yup.object().shape({})} onSubmit={handleSubmit}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            console.log({ values });
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3,
                    borderRadius: 0.5
                  }}
                >
                  <Grid container columnSpacing={1} columns={12}>
                    {/* Class */}
                    <Grid item xs={12}>
                      <DisableTextWrapper label="Select Class" value={values.class_name} touched={touched?.class_name} errors={errors?.class_name} />
                    </Grid>
                  </Grid>

                  {
                    <Grid item columnGap={1}>
                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Subject"
                        placeholder="subjects..."
                        multiple
                        value={values.subjects}
                        options={subjectLists}
                        name="month"
                        error={errors?.subjects}
                        touched={touched?.subjects}
                        // @ts-ignore
                        handleChange={(e, value: any) => setFieldValue('subjects', value)}
                      />

                      {values.subjects?.map((subject, index) => (
                        <Grid key={index} display="grid" gridTemplateColumns="1fr 2fr" columnGap={1}>
                          <DisableTextWrapper label="Select Subject" value={subject?.label} touched={undefined} errors={undefined} />

                          <Grid display="grid" gridTemplateColumns="1fr 6fr">
                            <Grid minWidth={100}>
                              <DropDownSelectWrapper
                                name="teacher_search_type"
                                label="Search By"
                                menuItems={['name', 'id']}
                                value={subject.teacher_search_type}
                                handleChange={(e, value: any) => {
                                  const subjects_ = values.subjects;
                                  subjects_[index]['teacher_search_type'] = e.target.value;
                                  setFieldValue('subjects', subjects_);
                                }}
                              />
                            </Grid>
                            <SearchTeacher
                              setFieldValue={setFieldValue}
                              index={index}
                              values={values}
                              searchType={subject.teacher_search_type}
                              disabled={!!!subject.teacher_search_type}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  }
                </DialogContent>
                <DialogActionWrapper title="Fees" errors={errors} editData={false} handleCreateClassClose={() => {}} isSubmitting={isSubmitting} />
              </form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

const SearchTeacher = ({ setFieldValue, index, values, searchType, disabled }) => {
  const [searchValue, setSearchValue] = useState();
  const [searchOptionData, setSearchOptionData] = useState([]);

  const handleDebounce = async (value) => {
    try {
      if (value?.length >= 2) {
        const res = await axios.get(`/api/teacher/search-teachers?search_type=${searchType}&search_value=${value?.toLowerCase()}`);
        const userInfoArr = res?.data?.map((item) => {
          return {
            label: `${item.name} | ${item.teacher_id || ''}`,
            id: item.id,
            teacher_id: item.student_id
            // student_table_id: item.student_table_id
          };
        });
        setSearchOptionData(userInfoArr);
      } else if (value?.length < 2) {
        setSearchOptionData([]);
      } else if (!value) {
        setSearchOptionData([]);
      }
    } catch (error) {}
  };

  const searchHandleChange = async (event: ChangeEvent<HTMLInputElement>, v) => {
    setSearchValue(v);
  };

  const searchHandleUpdate = (event: ChangeEvent<HTMLInputElement>, v) => {
    const subjects_ = values.subjects;
    subjects_[index]['teacher'] = v;
    setFieldValue('subjects', subjects_);
    setSearchValue(v || null);
  };

  return (
    <AutoCompleteWrapperWithDebounce
      disabled={disabled}
      debounceTimeout={500}
      handleDebounce={handleDebounce}
      // @ts-ignore
      searchHandleUpdate={searchHandleUpdate}
      options={searchOptionData}
      value={searchValue}
      handleChange={searchHandleChange}
      label="Search Teacher"
      placeholder="Search Teacher"
    />
  );
};

export default Add;
