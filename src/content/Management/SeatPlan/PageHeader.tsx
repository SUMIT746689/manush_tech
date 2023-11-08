import { useState, useEffect, useContext, useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
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
import ReactToPrint from 'react-to-print';

function PageHeader({ setSeatPlanSticker, editExam, setEditExam, classList, classes, setSeatPlan, seatPlan }): any {
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
        name={"Exam seat plan"}
        handleCreateClassOpen={handleCreateProjectOpen}
      />

      <FormControl
        seatPlan={seatPlan}
        pdf={pdf}
        setPdf={setPdf}
        rooms={rooms} setRooms={setRooms}
        open={open} editExam={editExam}
        classes={classes} classList={classList} setSeatPlan={setSeatPlan}
        handleOperationSuccess={handleCreateProjectSuccess}
        handleModalClose={handleCreateProjectClose}
        setSeatPlanSticker={setSeatPlanSticker}
      />

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
            {t(`${editExam ? 'Edit seat plan' : 'Create seat plan'}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add a seat plan')}
          </Typography>
        </DialogTitle>
        <FormControl
          seatPlan={seatPlan}
          rooms={rooms} setRooms={setRooms}
          open={open} editExam={editExam}
          classes={classes} classList={classList} setSeatPlan={setSeatPlan}
          handleOperationSuccess={handleCreateProjectSuccess}
          handleModalClose={handleCreateProjectClose}
        />

      </Dialog>

    </>
  );
}

const FormControl = ({ setSeatPlanSticker = null, pdf = false, setPdf = null, rooms, seatPlan, setRooms, open, editExam, classes, classList, setSeatPlan, handleOperationSuccess, handleModalClose }) => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();

  const [subjectList, setSubjectList] = useState([]);
  const [sections, setSections] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const seat_plan_print = useRef()

  const [exams, setExams] = useState([]);
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
        fetch(selectedSection?.id, selectedSubject?.id)
      }
    }
  }, [selectedSection, academicYear, selectedSubject]);

  const fetch = (section_id, exam_details_id) => {
    console.log({ selectedSection, selectedSubject });

    axios.get(`/api/exam/seat_plan?academic_year_id=${academicYear?.id}&section_id=${section_id}&exam_details_id=${exam_details_id}`)
      .then(res => {
        // console.log("res.data",res.data);

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
    setSelectedSubject(null)
    setSeatPlan([])
    if (setFieldValue) {
      setFieldValue("exam_id", newvalue?.id)
      setFieldValue('exam_details_id', undefined)
    }
    if (newvalue) {
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
  }
  const handleClassSelect = (event, newValue, setFieldValue = null) => {
    setSelectedClass(newValue)
    setSelectedSection(null)
    setSelectedSubject(null)
    setSeatPlan([])
    if(setSeatPlanSticker) setSeatPlanSticker([])
    console.log("class changed__");
    if (setFieldValue) {
      setFieldValue('section_id', undefined);
      setFieldValue('class_id', newValue?.id);
    }

    if (newValue) {
      sectionSelection(newValue, setFieldValue)
    }
  };

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

        if (settingStudentList) settingStudentList(targetClass.sections[0].id)

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

      if (editExam) {
        axios
          .patch(`/api/exam/seat_plan`, _values)
          .then((res) => {
            console.log(res);
            fetch(_values.section_id, _values.exam_details_id)
            successProcess(t(`${res?.data?.message ? res?.data?.message : 'Seat plan has been updated successfully'}`))
          })
          .catch((err) => {
            console.log(err)
            handleErrorSnackbar(err)
          });
      }
      else {
        const res = await axios.post('/api/exam/seat_plan', _values);
        if (res.data?.success) {
          fetch(_values.section_id, _values.exam_details_id)
          successProcess(t('Seat plan has been created successfully'))
        }
        else {
          throw new Error('Seat plan creation failed');
        }
      }
    } catch (err) {
      console.error(err);
      handleErrorSnackbar(err)
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  const design = (open === false) ?
    {
      width: "100%",
      display: "grid",
      gridTemplateColumns: {
        xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr'
      },
      p: 2,
      columnGap: 2
    } : {}

  console.log({ pdf });

  return (
    <>
      <Formik
        initialValues={{
          class_id: editExam ? editExam?.exam_details?.exam?.section?.class_id : undefined,
          section_id: editExam ? editExam?.exam_details?.exam?.section?.id : undefined,
          exam_id: editExam ? editExam?.exam_details?.exam_id : undefined,
          exam_details_id: editExam ? editExam?.exam_details_id : undefined,

          room_id: editExam ? editExam?.room_id : undefined,
          class_roll_from: editExam ? editExam?.class_roll_from : undefined,
          class_roll_to: editExam ? editExam?.class_roll_to : undefined,
          student_count: editExam ? editExam?.student_count : undefined,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          class_id: Yup.number().min(1).required(t('class is required')),
          section_id: Yup.number().min(1).required(t('section is required')),
          exam_id: Yup.number().min(1).required(t('exam is required')),
          exam_details_id: Yup.number().min(1).required(t('subject is required')),

          room_id: Yup.number().min(1).required(t('Room is required')),
          student_count: Yup.number().min(1).required(t('Student count field is required')),
          class_roll_from: Yup.string().max(255).required(t('Class roll from title field is required')),
          class_roll_to: Yup.string().max(255).required(t('Class roll to field is required')),

        })}


        onSubmit={handleFormSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
          console.log({ values });

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent

                sx={{
                  py: 2
                }}
              >
                <Grid container spacing={0} sx={design}>

                  {
                    !editExam && <>
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
                            if (settingStudentList) {
                              if (v) settingStudentList(v?.id)
                              else setSeatPlanSticker([])
                            }

                            setFieldValue('section_id', v?.id)
                            setFieldValue('exam_id', undefined)
                            setSelectedSubject(null);
                            setSeatPlan([])
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
                          value={exams?.find(i => i.id == values?.exam_id) || null}
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
                      {
                        open === false && selectedSubject && <ReactToPrint
                          content={() => seat_plan_print.current}
                          // pageStyle={`{ size: 2.5in 4in }`}
                          onBeforeGetContent={() => setPdf(true)}
                          // onBeforePrint={() => setPdf(true)}
                          onAfterPrint={() => setPdf(false)}
                          trigger={() => (
                            <ButtonWrapper
                              handleClick={undefined}
                              startIcon={<LocalPrintshopIcon />}
                            >{t('print')}</ButtonWrapper>
                          )}
                        // pageStyle={"@page { size: landscape; }"}
                        />
                      }
                    </>
                  }
                  {
                    open === true && <>
                      {/* select room */}
                      {
                        !editExam && <AutoCompleteWrapper
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
                          handleChange={(e, v) => setFieldValue('room_id', v?.id)}
                        />
                      }



                      <TextFieldWrapper
                        errors={errors.class_roll_from}
                        touched={touched.class_roll_from}
                        name="class_roll_from"
                        label="Class roll from"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.class_roll_from}
                      />
                      <TextFieldWrapper
                        errors={errors.class_roll_to}
                        touched={touched.class_roll_to}
                        name="class_roll_to"
                        label="Class roll to"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.class_roll_to}
                      />
                      <TextFieldWrapper
                        errors={errors.student_count}
                        touched={touched.student_count}
                        name="student_count"
                        label="Student count"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.student_count}
                        type='number'
                      />

                    </>
                  }

                </Grid>
              </DialogContent>
              {
                open === true && <DialogActionWrapper
                  title="Seat plan"
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

      {pdf && <Grid sx={{
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
                {/* {user?.school?.image && <img src={`/${user.school.image}`} />} */}
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


      </Grid>}
    </>

  )
}
export default PageHeader;
