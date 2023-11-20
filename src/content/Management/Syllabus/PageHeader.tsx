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
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { TextAreaWrapper, TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import ReactToPrint from 'react-to-print';
import { useAuth } from '@/hooks/useAuth';

const tableStyle: object = {
  border: '1px solid black',
  borderCollapse: 'collapse',
  textAlign: 'center',
  padding: '2px',
  fontSize: '0.8em'
  // backgroundColor: '#cccccc'
};
function PageHeader({ editSyllabus, setEditSyllabus, classList, classes, setSyllabus, syllabus,create_syllabus_permission }): any {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

  const [exams, setExams] = useState([]);
  const [allSyllabus, setAllSyllabus] = useState([]);

  const [subjectList, setSubjectList] = useState([]);
  const [sections, setSections] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const studyPlan = useRef()
  const allStudyPlan = useRef()
  useEffect(() => {
    console.log('editExam__', editSyllabus);
    if (editSyllabus) {
      handleCreateProjectOpen()
    }
  }, [editSyllabus]);

  const fetchData = () => {
    if (selectedExam && selectedSubject && academicYear) {
      axios.get(`/api/syllabus?exam_id=${selectedExam.id}&subject_id=${selectedSubject.id}&academic_year_id=${academicYear.id}`)
        .then(res => setSyllabus(res.data))
        .catch(err => console.log(err))
    }
  }
  useEffect(() => {
    fetchData()
  }, [selectedExam, selectedSubject, academicYear])

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };
  const handleCreateProjectClose = () => {
    setEditSyllabus(null);
    setOpen(false);
  };

  const handleCreateProjectSuccess = (message: string) => {
    showNotification(message);
    setOpen(false);
  };
  const handleExamSelect = (e, newvalue) => {
    setSelectedExam(newvalue)
    setSyllabus([])
    setAllSyllabus([])
  }
  const handleClassSelect = (event, newValue) => {
    setSelectedClass(newValue)
    setSelectedSection(null)
    setSelectedSubject(null)
    setSelectedExam(null)
    setSyllabus([])
    setAllSyllabus([])
    console.log("class changed__");

    if (newValue) {
      sectionSelection(newValue)
      axios.get(`/api/subject?class_id=${newValue.id}`)
        .then(res => {
          setSubjectList(res.data?.map(i => ({
            label: i.name,
            id: i.id,
          })
          ))
        })
        .catch(err => console.log(err))
    }
  };
  const sectionSelection = (newValue) => {
    setSelectedSubject(null)

    const targetClass = classes?.find(i => i.id == newValue?.id)
    if (targetClass) {
      if (targetClass.has_section == false) {
        gettingExam(targetClass.sections[0].id)
        setSelectedSection(targetClass.sections[0])

      } else {
        setSections(targetClass?.sections?.map(i => ({
          label: i.name,
          id: i.id
        })
        ))
      }
    }
  }

  const gettingExam = (section_id) => {
    axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${section_id}`)
      .then(res => {
        setExams(res.data?.map(i => ({
          label: i.title,
          id: i.id,
        })
        ))
      })
      .catch(err => console.log(err))
  }

  const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    try {

      const handleSubmitSuccess = () => {
        resetForm();
        setEditSyllabus(null);
        setStatus({ success: true });
        setSubmitting(false);
      }
      if (editSyllabus) {
        await axios.patch(`/api/syllabus?exam_id=${selectedExam.id}&subject_id=${selectedSubject.id}&syllabus_details_id=${editSyllabus.id}&academic_year_id=${academicYear.id}`, _values)
        handleSubmitSuccess()
        fetchData()

        handleCreateProjectSuccess(t('The subject was updated successfully'));
      }
      else {
        await axios.post(`/api/syllabus?exam_id=${selectedExam.id}&subject_id=${selectedSubject.id}&academic_year_id=${academicYear.id}`, _values)
        handleSubmitSuccess()
        fetchData()
        handleCreateProjectSuccess(t('The subject was created successfully'));

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

  }

  return (
    <>

      <PageHeaderTitleWrapper
        name={"Syllabus"}
        handleCreateClassOpen={handleCreateProjectOpen}
        //@ts-ignore
        actionButton={(selectedClass && selectedSection && selectedExam && selectedSubject && create_syllabus_permission) ? null : true}
      />

      <Grid container spacing={0} sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr'
        },
        p: 2,
        columnGap: 2
      }}>

        <AutoCompleteWrapper
          minWidth="100%"
          name='class_id'
          label="Select Class"
          placeholder="Select class"
          options={classList}
          value={selectedClass}
          required={true}
          handleChange={(event, newValue) => handleClassSelect(event, newValue)}
        />
        {/* select section */}
        {((selectedClass && sections && selectedClass?.has_section)) &&
          <AutoCompleteWrapper
            minWidth="100%"
            name='section_id'
            label="Select Section"
            placeholder="Section a name ..."
            options={sections}
            value={selectedSection}
            handleChange={(e, v) => {
              setSelectedSection(v)
              setSelectedSubject(null);
              setSelectedExam(null)
              if (v) {
                gettingExam(v.id)
              }
              setSyllabus([])
              setAllSyllabus([])
            }}
          />

        }
        {
          selectedSection && <AutoCompleteWrapper
            minWidth="100%"
            name='exam_details_id'
            label="Select subject"
            placeholder="Subject"
            options={subjectList}
            value={selectedSubject}
            handleChange={(e, v) => {
              setSelectedSubject(v)
              setSelectedExam(null)
            }}
          />

        }
        {
          selectedSubject && <AutoCompleteWrapper
            minWidth="100%"
            name='exam_id'
            label="Select exam"
            placeholder="Exam"
            options={exams}
            value={selectedExam}
            handleChange={(event, newValue) => handleExamSelect(event, newValue)}
          />
        }
        {
          syllabus.length > 0 && <>
            <ReactToPrint
              content={() => studyPlan.current}

              trigger={() => (
                <ButtonWrapper
                  handleClick={undefined}
                  startIcon={<LocalPrintshopIcon />}
                >{t(`Print ${selectedSubject?.label} Syllabus`)}</ButtonWrapper>
              )}
            // pageStyle={"@page { size: landscape; }"}
            />
            <ButtonWrapper handleClick={() => {
              axios.get(`/api/syllabus?exam_id=${selectedExam.id}&academic_year_id=${academicYear.id}`)
                .then(res => setAllSyllabus(res.data))
                .catch(err => console.log(err))
            }}>Generate Full term syllabus</ButtonWrapper>
            {
              allSyllabus.length > 0 && <ReactToPrint
                content={() => allStudyPlan.current}

                trigger={() => (
                  <ButtonWrapper
                    handleClick={undefined}
                    startIcon={<LocalPrintshopIcon />}
                  >{t(`Print Full term syllabus`)}</ButtonWrapper>
                )}
              // pageStyle={"@page { size: landscape; }"}
              />
            }

          </>
        }

      </Grid>

      <Grid sx={{
        display: 'none'
      }}>
        <Grid sx={{
          p: 1
        }} ref={studyPlan}>

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
                Class : {selectedClass?.label}, Section : {selectedSection?.label}, Exam title: {selectedExam?.label}
              </Typography>
              <Typography variant="h4" align="center" >
                Subject title: {selectedSubject?.label}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h4" >
                Syllabus
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
                  <TableRow sx={{
                    border: '1px solid'
                  }}>
                    <TableCell align='center' sx={{
                      border: '1px solid'
                    }}>{t('SL')}</TableCell>
                    <TableCell align='center' sx={{
                      border: '1px solid'
                    }} >{t('Content')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {
                    syllabus?.map((exam, index) => <TableRow sx={{
                      border: '1px solid'
                    }}>
                      <TableCell align='left' sx={{
                        border: '1px solid'
                      }}>{index + 1}</TableCell>
                      <TableCell align='left' sx={{
                        border: '1px solid'
                      }}>{exam?.body}</TableCell>
                    </TableRow>)
                  }

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

        </Grid>


      </Grid>
      <Grid sx={{
        display: 'none'
      }}>
        <Grid sx={{
          p: 1
        }} ref={allStudyPlan}>

          <Grid py={1} spacing={2} sx={{
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
                Class : {selectedClass?.label}, Section : {selectedSection?.label}, Academic year: {academicYear?.label}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h5" align='center' >
                অগ্রগতি সনাক্তকরন পরিকল্পনা
              </Typography>
            </Grid>


          </Grid>
          <Grid sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1
          }}>

            <table>
              <thead>
                <tr  >
                  <td style={{ ...tableStyle, fontWeight: 'bold' }} colSpan={6}>{t(`${selectedExam?.label} পরীক্ষার সিলেবাস`)}</td>
                </tr>
                <tr>
                  <th style={tableStyle}>{t('বিষয়')}</th>
                  <th style={tableStyle}>{t('ক্লাস নেয়া হয়েছে')}</th>
                  <th style={tableStyle}>{t('মুখস্ত করানো হয়েছে')}</th>
                  <th style={tableStyle}>{t('মৌখিক পরীক্ষা নেওয়া হয়েছে')}</th>
                  <th style={tableStyle}>{t('ক্লাস টেস্ট নেওয়া হয়েছে')}</th>
                  <th style={tableStyle}>{t('রিভিসন ক্লাস নেওয়া হয়েছে')}</th>

                </tr>
              </thead>

              <tbody style={{
                overflowX: 'auto',
                overflowY: 'auto'
              }}>

                {
                  allSyllabus?.map((exam, index) => <tr>
                    <td style={{ ...tableStyle, textAlign: 'left' }} ><span style={{ fontWeight: 'bold' }}>{exam?.syllabus?.subject?.name} :</span> {exam?.body}</td>
                    <td style={tableStyle} ></td>
                    <td style={tableStyle} ></td>
                    <td style={tableStyle} > </td>
                    <td style={tableStyle} > </td>
                    <td style={tableStyle} > </td>
                  </tr>)
                }

              </tbody>
            </table>

          </Grid>

        </Grid>


      </Grid>

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
            {t(`${editSyllabus ? 'Edit syllabus' : 'Create syllabus'}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add a syllabus')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            body: editSyllabus ? editSyllabus?.body : undefined
          }}
          validationSchema={Yup.object().shape({
            body: Yup.string()
              .max(455)
              .required(t('Syllabus body is required')),

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
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={1}>

                    <TextAreaWrapper
                      errors={errors.body}
                      touched={touched.body}
                      name="body"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.body}
                      minRows={2}
                    />

                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  title={"Syllabus"}
                  editData={editSyllabus}
                  errors={errors}
                  handleCreateClassClose={handleCreateProjectClose}
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
