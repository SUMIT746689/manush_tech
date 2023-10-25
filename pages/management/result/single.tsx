import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';

import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
import { TableEmptyWrapper } from '@/components/TableWrapper';

function Managementschools() {

    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const [result, setResult] = useState(null);
    const { user } = useAuth();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext)


    const [classes, setClasses] = useState([]);
    const [studentList, setStudentList] = useState(null);
    const [sections, setSections] = useState(null);
    const [exams, setExams] = useState(null);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [finalResult, setFinalResult] = useState(null);

    const [selectedExamPercentageOptions, setSelectedExamPercentageOptions] = useState([]);

    const handleInputChange = (event, index) => {
        const newOptions = [...selectedExamPercentageOptions];
        newOptions[index].percentage = event.target.value;
        setSelectedExamPercentageOptions(newOptions);
    };

    useEffect(() => {
        axios.get(`/api/class`)
            .then(res => setClasses(res?.data))
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        if (selectedSection && academicYear && user) {
            axios.get(`/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection.id}&school_id=${user?.school_id}`)
                .then(res => setStudentList(res.data?.map(i => {
                    return {
                        label: i.class_roll_no,
                        id: i.id
                    }
                })))
                .catch(err => console.log(err))

            axios.get(`/api/exam/exam-list?school_id=${user?.school_id}&academic_year=${academicYear?.id}&section_id=${selectedSection.id}`)
                .then(res => setExams(res.data?.map(i => {
                    return {
                        label: i.title,
                        id: i.id
                    }
                })))
                .catch(err => console.log(err))
        }
    }, [selectedSection, academicYear, user])

    const handleSearchResult = () => {
        if (selectedStudent) {
            axios.get(`/api/result/${selectedStudent.id}?exam_id=${selectedExam.id}`)
                .then(res => {
                    setResult(res.data)
                    setFinalResult(null)
                })
                .catch(err => console.log(err))
        }
    }

    const handleClassSelect = (event, newValue) => {

        setSelectedClass(newValue)
        if (newValue) {
            const targetClassSections = classes.find(i => i.id == newValue.id)
            setSections(targetClassSections?.sections?.map(i => {
                return {
                    label: i.name,
                    id: i.id
                }
            }))
            if (!newValue.has_section) {
                setSelectedSection({
                    label: targetClassSections?.sections[0]?.name,
                    id: targetClassSections?.sections[0]?.id
                })
            } else {
                setSelectedSection(null)
            }
        }
    }

    const handleFinalResultGenerate = () => {
        axios.get(`/api/result/${selectedStudent?.id}/final-result?section_id=${selectedSection?.id}`)
            .then(res => {
                setResult(null)
                setFinalResult(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    return (

        <>
            <Head>
                <title>Single Result - Management</title>
            </Head>
            <PageTitleWrapper >
                <Grid item>

                    <Typography variant="h3" component="h3" gutterBottom>
                        {t('Single student Result')}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t('These are your Results')}
                    </Typography>
                </Grid>
            </PageTitleWrapper>


            <Card sx={{ maxWidth: 1000, mx: 'auto', display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "1fr 1fr 1fr" }, columnGap: 1, pt: 1, px: 1, mb: 1 }} >

                {/* select class */}
                <AutoCompleteWrapper
                    minWidth="100%"
                    label={t('Select class')}
                    placeholder="select a class..."
                    value={undefined}
                    options={classes?.map(i => {
                        return {
                            label: i.name,
                            id: i.id,
                            has_section: i.has_section
                        }
                    })}
                    filterSelectedOptions
                    handleChange={handleClassSelect}
                />

                {/* select section */}
                {
                    (selectedClass && sections && selectedClass.has_section) ? <>

                        <AutoCompleteWrapper
                            label="Select Section"
                            placeholder="select a section name..."
                            options={sections}
                            value={selectedSection}
                            filterSelectedOptions
                            handleChange={(e, v) => {
                                setSelectedSection(v)
                                setSelectedStudent(null);
                                setSelectedExam(null)
                            }}
                        />

                    </>
                        :
                        <EmptyAutoCompleteWrapper
                            label="Select Section"
                            placeholder="select a section..."
                            options={[]}
                            value={undefined}
                        />
                }

                {
                    (selectedClass && selectedSection && exams) ? <>

                        <AutoCompleteWrapper
                            label="Select Student Roll"
                            placeholder="select a student roll..."
                            options={studentList}
                            value={selectedStudent}
                            filterSelectedOptions
                            handleChange={(e, v) => setSelectedStudent(v)}
                        />
                    </>
                        :
                        <EmptyAutoCompleteWrapper
                            label="Select Student Roll"
                            placeholder="select a student roll..."
                            options={[]}
                            value={undefined}
                        />
                }
                {
                    (selectedClass && selectedSection && studentList) ? <>

                        <AutoCompleteWrapper
                            label="Select Exam"
                            placeholder="select a exam..."
                            options={exams}
                            value={selectedExam}
                            filterSelectedOptions
                            handleChange={(e, v) => {
                                setSelectedExam(v)
                                if (!v) setResult(null)
                            }}
                        />

                    </>
                        :
                        <EmptyAutoCompleteWrapper
                            label="Select Exam"
                            placeholder="select a exam..."
                            options={[]}
                            value={undefined}
                        />
                }

                {
                    (selectedClass && selectedSection && studentList && selectedExam)
                        ?

                        <ButtonWrapper handleClick={handleSearchResult}>Find single exam result</ButtonWrapper>

                        :
                        <DisableButtonWrapper>Find single exam result </DisableButtonWrapper>
                }

                {
                    (selectedSection && selectedStudent && !selectedExam) ?
                        <ButtonWrapper variant='contained' handleClick={handleFinalResultGenerate} >Generate Final result</ButtonWrapper>
                        :
                        <DisableButtonWrapper >Generate Final result</DisableButtonWrapper>
                }

            </Card>

            <Card sx={{ minHeight: 'calc(100vh - 465px) !important' }}>
                <Grid
                    sx={{ px: 4 }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>

                        {
                            result &&
                            <>
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <h1>Exam Title: {result?.exam?.title}</h1>
                                    <h2 >Student name : {result?.student?.student_info?.first_name} {result?.student?.student_info?.middle_name} {result?.student?.student_info?.last_name}</h2>
                                    <h2>Class : {result?.student?.section?.class?.name}</h2>
                                    <h2>Section : {result?.student?.section?.name}</h2>
                                    <h2>Class roll : {result?.student?.class_roll_no}</h2>
                                </Grid>


                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('Subject Name')}</TableCell>
                                            <TableCell>{t('Subject obtain marks')}</TableCell>
                                            <TableCell>{t('Subject total marks')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result?.result_details?.map(i =>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography noWrap variant="h5">
                                                        {i?.exam_details?.subject?.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography noWrap variant="h5">
                                                        {i?.mark_obtained}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell><Typography noWrap variant="h5">
                                                    {i?.exam_details?.subject_total?.toFixed(2)}
                                                </Typography></TableCell>
                                            </TableRow>

                                        )}
                                    </TableBody>
                                </Table>

                            </>
                        }
                        {
                            finalResult && <>
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <h1>Final result</h1>

                                    <h2>Student name : {finalResult?.student?.student_info?.first_name} {finalResult?.student?.student_info?.middle_name} {finalResult?.student?.student_info?.last_name}</h2>
                                    <h2>Class : {finalResult?.student?.section?.class?.name}</h2>
                                    <h2>Section : {finalResult?.student?.section?.name}</h2>
                                    <h2>Class roll : {finalResult?.student?.class_roll_no}</h2>
                                </Grid>

                                <h2 className=' text-center font-bold'>Total mark: {finalResult?.termWiseTotalMark?.reduce(
                                    (accumulator, currentValue) => accumulator + currentValue?.calculatedTotalMark, 0
                                ).toFixed(2)}</h2>
                                ,
                                {
                                    finalResult?.termWiseTotalMark?.map(i => <>
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            Total mark counted from {i?.title} exam : {i?.calculatedTotalMark?.toFixed(2)}
                                        </Box>
                                        <Table size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{t('Subject Name')}</TableCell>
                                                    <TableCell>{t('Counted mark')}</TableCell>
                                                    <TableCell>{t('Subject total')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {i?.result?.map(j =>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {j?.subject_name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {j?.singleSubjectCalculetedMark}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell><Typography noWrap variant="h5">
                                                            {j?.subject_total}
                                                        </Typography></TableCell>
                                                    </TableRow>

                                                )}
                                            </TableBody>
                                        </Table>

                                    </>)
                                }





                            </>
                        }

                        {
                            (!result && !finalResult) && <TableEmptyWrapper title="" />
                        }
                    </Grid>
                </Grid>
            </Card>

            <Footer />
        </>

    );
}

Managementschools.getLayout = (page) => (
    <Authenticated name='student_wise_result'>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Managementschools;
