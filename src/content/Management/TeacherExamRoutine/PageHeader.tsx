import { useState, useEffect, useContext, useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SearchIcon from '@mui/icons-material/Search';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
  Divider,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

function PageHeader({ editExam, setEditExam, classList, classes, setSeatPlan, seatPlan, teachers }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [rooms, setRooms] = useState([]);
  const [pdf, setPdf] = useState(false)


  useEffect(() => {
    console.log('editExam__', editExam);
    if (editExam) {
      handleCreateProjectOpen()
    }
  }, [editExam]);
  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setEditExam(null);
    setOpen(false);
  };

  const handleCreateProjectSuccess = (message: string) => {
    showNotification(message);
    setOpen(false);
  };


  return (
    <>

      <PageHeaderTitleWrapper
        name={"Teacher Exam Routine"}
        handleCreateClassOpen={handleCreateProjectOpen}
      />

      {/* <FormControl
        seatPlan={seatPlan}
        pdf={pdf}
        setPdf={setPdf}
        rooms={rooms} setRooms={setRooms}
        open={open} editExam={editExam}
        classes={classes} classList={classList} setSeatPlan={setSeatPlan}
        handleOperationSuccess={handleCreateProjectSuccess}
        handleModalClose={handleCreateProjectClose}
      /> */}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(`${editExam ? 'Edit teacher exam routine' : 'Create teacher exam routine'}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add a teacher exam routine')}
          </Typography>
        </DialogTitle>
        <FormControl
          seatPlan={seatPlan}
          rooms={rooms} setRooms={setRooms}
          open={open} editExam={editExam}
          classes={classes} classList={classList} setSeatPlan={setSeatPlan}
          teachers={teachers}
          handleOperationSuccess={handleCreateProjectSuccess}
          handleModalClose={handleCreateProjectClose}
        />

      </Dialog>

    </>
  );
}

const FormControl = ({ pdf = false, setPdf = null, rooms, seatPlan, setRooms, open, editExam, classes, classList, setSeatPlan, handleOperationSuccess, handleModalClose, teachers }) => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();

  const [subjectList, setSubjectList] = useState([]);
  const [sections, setSections] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [exams, setExams] = useState([]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const seat_plan_print = useRef()
  const seatPlanStickerRef = useRef()
  const [seatPlanSticker, setSeatPlanSticker] = useState([])
  const handlePrint = useReactToPrint({
    content: () => seatPlanStickerRef.current,
    // pageStyle: `@media print {
    //   @page {
    //     size: 210mm 115mm;
    //   }
    // }`
  });

  const { showNotification } = useNotistick();

  useEffect(() => {
    if (selectedSection && academicYear) {
      console.log("called");

      axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${selectedSection.id}`)
        .then((res) =>
          setExams(
            res.data?.map((i) => {
              return {
                label: i.title,
                id: i.id
              };
            })
          )
        )
        .catch((err) => console.log(err));

      if (selectedSubject && open == false) {
        fetchSeatPlan(selectedSection?.id, selectedSubject?.id)
      }
    }
  }, [selectedSection, academicYear, selectedSubject]);

  useEffect(() => {
    if (!open && selectedSection && selectedSubject) fetchSeatPlan(selectedSection?.id, selectedSubject?.id)
  }, [open])

  const fetchSeatPlan = (section_id, exam_details_id) => {
    axios.get(`/api/exam/seat_plan?academic_year_id=${academicYear?.id}&section_id=${section_id}&exam_details_id=${exam_details_id}`)
      .then(res => {
        setSeatPlan(res.data?.seatPlan?.map((i, index) => ({ sl: index + 1, ...i })))
      })
      .catch(err => console.log(err));
  }

  const gettingRoom = (exam_details_id) => {
    if (exam_details_id) {
      console.log("subjectList__", subjectList);
      const temp = subjectList?.find(j => j.id == exam_details_id)?.exam_room?.map(i => ({
        label: i.name,
        id: i.id
      }))
      console.log({ temp })
      setRooms(temp)
    }
  }

  const handleExamSelect = (e, newvalue, setFieldValue = null) => {
    setSelectedExam(newvalue)
    setSelectedSubject(null)
    open == false && setSeatPlan([])
    if (setFieldValue) {
      setFieldValue("exam_id", newvalue?.id)
      setFieldValue('exam_details_id', undefined)
    }
    if (newvalue) {
      settingStudentList(selectedSection.id)
      axios.get(`/api/exam/exam-subject-list?exam_id=${newvalue.id}`)
        .then(res => {
          setSubjectList(res.data?.map(i => ({
            label: i.subject.name,
            id: i.id,
            exam_room: i.exam_room
          })
          ))
        })

        .catch(err => console.log(err))
    }
    else {
      setSeatPlanSticker([])
    }
  }

  const handleClassSelect = (event, newValue, setFieldValue = null) => {
    setSelectedClass(newValue)
    setSelectedSection(null)
    setSelectedExam(null)
    setSelectedSubject(null)
    open == false && setSeatPlan([])
    setSeatPlanSticker([])
    console.log("class changed__");
    if (setFieldValue) {
      setFieldValue('section_id', undefined);
      setFieldValue('class_id', newValue?.id);
    }

    if (newValue) {
      sectionSelection(newValue, setFieldValue)
    }
  }

  const settingStudentList = (section_id) => {
    axios.get(`/api/student/student-list?academic_year_id=${academicYear.id}&section_id=${section_id}`)
      .then(res => setSeatPlanSticker(res.data))
      .catch(err => console.log(err)
      )
  }

  const sectionSelection = (newValue, setFieldValue = null) => {
    setSelectedSubject(null)

    const targetClass = classes?.find(i => i.id == newValue?.id)
    if (targetClass) {
      if (targetClass.has_section == false) {
        setSelectedSection(targetClass.sections[0])
        setFieldValue && setFieldValue('section_id', targetClass.sections[0].id);

      } else {
        setSections(targetClass?.sections?.map(i => ({
          label: i.name,
          id: i.id
        })
        ))
      }
    }
  }

  const handleSearchSeatPlan = (room_id, exam_details_id, setFieldValue) => {
    console.log({ room_id });
    axios.get(`/api/seat_plans?room_id=${room_id}&exam_details_id=${exam_details_id}`)
      .then(({ data }) => {
        console.log({ data });
        if (!data?.success) {
          showNotification('exam routine not created', 'error');
          return;
        }
        setFieldValue('seat_plan_id', data.seat_plan.id)
      })
  }

  const handleErrorSnackbar = (err) => {
    showNotification(err?.response?.data?.message, 'error')
  }

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successProcess = (message) => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleOperationSuccess(message);
        handleModalClose();
      };
      _values['academic_year_id'] = academicYear?.id
      _values['teacher_ids'] = _values.teacher_ids.map((teacher) => {
        return { id: teacher.id }
      })
      if (editExam) {
        axios
          .patch(`/api/exam/seat_plan`, _values)
          .then((res) => {
            console.log(res);
            fetchSeatPlan(_values.section_id, _values.exam_details_id)
            successProcess(t(`${res?.data?.message ? res?.data?.message : 'Seat plan has been updated successfully'}`))
          })
          .catch((err) => {
            console.log(err)
            handleErrorSnackbar(err)
          });
      }
      else {
        const res = await axios.patch('/api/teacher/exam_seat_plans', _values);
        if (res.data?.success) successProcess(t('Seat plan has been created successfully'))
        else throw new Error('Seat plan creation failed')
      }
    } catch (err) {
      console.error(err);
      handleErrorSnackbar(err)
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }


  return (
    <>
      <Formik
        initialValues={{
          class_id: editExam ? editExam?.exam_details?.exam?.section?.class_id : undefined,
          section_id: editExam ? editExam?.exam_details?.exam?.section?.id : undefined,
          exam_id: editExam ? editExam?.exam_details?.exam_id : undefined,
          exam_details_id: editExam ? editExam?.exam_details_id : undefined,
          seat_plan_id: undefined,
          teacher_ids: [],
          room_id: editExam ? editExam?.room_id : undefined,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          class_id: Yup.number().min(1).required(t('class is required')),
          section_id: Yup.number().min(1).required(t('section is required')),
          exam_id: Yup.number().min(1).required(t('exam is required')),
          exam_details_id: Yup.number().min(1).required(t('subject is required')),
          room_id: Yup.number().min(1).required(t('Room is required'))
        })}


        onSubmit={handleFormSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
          console.log({ values, errors });

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ py: 2 }}>
                <Grid container spacing={0} >
                  <AutoCompleteWrapper
                    minWidth="100%"
                    name='class_id'
                    label="Select Class"
                    placeholder="Select class"
                    options={classList}
                    value={selectedClass}
                    required={true}
                    handleChange={(event, newValue) => handleClassSelect(event, newValue, setFieldValue)}
                  />
                  {/* select section */}
                  {((selectedClass && sections && (editExam?.section?.class?.has_section || selectedClass?.has_section))) &&
                    <AutoCompleteWrapper
                      minWidth="100%"
                      name='section_id'
                      label="Select Section"
                      placeholder="Section a name ..."
                      options={sections}
                      value={selectedSection}
                      handleChange={(e, v) => {
                        setSelectedSection(v)
                        setSeatPlanSticker([])
                        setFieldValue('section_id', v?.id)
                        setFieldValue('exam_id', undefined)
                        setSelectedSubject(null);
                        setSelectedExam(null)
                        open == false && setSeatPlan([])
                      }}
                    />

                  }
                  {
                    selectedClass && selectedSection && <AutoCompleteWrapper
                      minWidth="100%"
                      name='exam_id'
                      label="Select exam"
                      placeholder="Exam"
                      options={exams}
                      value={selectedExam}
                      handleChange={(event, newValue) => handleExamSelect(event, newValue, setFieldValue)}
                    />
                  }
                  {
                    selectedSection && values?.exam_id && <AutoCompleteWrapper
                      minWidth="100%"
                      name='exam_details_id'
                      label="Select subject exam"
                      placeholder="Subject exam"
                      options={subjectList}
                      value={selectedSubject}
                      handleChange={(e, v) => {
                        setSelectedSubject(v)
                        setFieldValue('exam_details_id', v?.id)
                        gettingRoom(v?.id)
                      }}
                    />
                  }

                  {/* select room */}
                  {
                    <AutoCompleteWrapper
                      error={Boolean(touched.room_id && errors.room_id)}
                      helperText={touched.room_id && errors.room_id}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      minWidth="100%"
                      name='room_id'
                      label="Select room"
                      placeholder="Room"
                      options={rooms}
                      required={true}
                      value={rooms?.find((i) => i.id == values?.room_id)}
                      handleChange={(e, v) => {
                        setFieldValue('room_id', v?.id);
                        if (v?.id) handleSearchSeatPlan(v.id, values?.exam_details_id, setFieldValue);
                      }}
                    />
                  }

                  {
                    <AutoCompleteWrapper
                      error={Boolean(touched.teacher_ids && errors.teacher_ids)}
                      helperText={touched.teacher_ids && errors.teacher_ids}
                      multiple
                      onBlur={handleBlur}
                      onChange={handleChange}
                      minWidth="100%"
                      name='teacher_ids'
                      label="Select Teachers "
                      placeholder="Teachers"
                      options={teachers}
                      // required={true}
                      value={undefined}
                      // value={values?.teacher_ids?.map((option) => option?.label) || []}
                      handleChange={(e, v) => {
                        setFieldValue('teacher_ids', v);
                      }}
                    />
                  }

                </Grid>
              </DialogContent>
              {
                open === true && <DialogActionWrapper
                  title="Teacher exam routine"
                  editData={editExam}
                  errors={errors}
                  handleCreateClassClose={handleModalClose}
                  isSubmitting={isSubmitting}
                />
              }

            </form>
          )
        }}
      </Formik>

      {/* {
        pdf
          &&
        <Grid sx={{
          display: 'none'
        }}>
          <Grid sx={{
            p: 1
          }} ref={seat_plan_print}>

            <Grid py={2} spacing={2} sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2.75fr 1fr'
            }} px={7}>

              <Grid item>
                <Avatar variant="rounded"  >
                  {user?.school?.image && <img src={`/${user.school.image}`} />}
                </Avatar>
              </Grid>

              <Grid item>
                <Typography
                  variant="h3"
                  align="center"
                >
                  {user?.school?.name}
                </Typography>
                <Typography variant="h6" align="center" sx={{ borderBottom: 1 }}>
                  {user?.school?.address}, {user?.school?.phone}
                </Typography>
                <Typography variant="h6" align="center" >
                  Class : {selectedClass?.label}, Section : {selectedSection?.label}
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="h4" >
                  Seat plan
                </Typography>
              </Grid>


            </Grid>
            <Grid sx={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              < TableContainer sx={{ marginX: 1, p: 0.5 }}>
                <Table aria-label="collapsible table" size="small">
                  <TableHead>
                    <TableRow>


                      <TableCell >{t('Sl')}</TableCell>
                      <TableCell >{t('Room')}</TableCell>
                      <TableCell >{t('Class roll from')}</TableCell>
                      <TableCell >{t('Class roll to')}</TableCell>
                      <TableCell >{t('Student count')}</TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {
                      seatPlan?.map((exam, index) => {

                        return <TableRow>

                          <TableCell >{exam?.sl}</TableCell>
                          <TableCell >{exam?.room?.name}</TableCell>
                          <TableCell > {exam?.class_roll_from}</TableCell>
                          <TableCell >  {exam?.class_roll_to}</TableCell>
                          <TableCell > {exam?.student_count}</TableCell>
                        </TableRow>
                      }

                      )
                    }

                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

          </Grid>


        </Grid>
      } */}
    </>

  )
};

export default PageHeader;
