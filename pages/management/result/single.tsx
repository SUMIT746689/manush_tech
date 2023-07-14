import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Autocomplete, Box, Button, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';

import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import prisma from '@/lib/prisma_client';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';

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
        console.log("newOptions__", newOptions);

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
                    console.log(res.data);

                })
                .catch(err => console.log(err))
        }
    }

    const handleClassSelect = (event, newValue) => {

        console.log(newValue);
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


        console.log("selectedExamPercentageOptions___", selectedExamPercentageOptions, "   ", selectedStudent);

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

                <Grid sx={{ px: 4, my: 1 }}
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="stretch"
                    spacing={4}>
                    {/* select class */}

                    <Grid

                        sx={{
                            mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12} sm={6} md={2}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'right' }}
                    >
                        <Autocomplete
                            id="tags-outlined"
                            options={classes?.map(i => {
                                return {
                                    label: i.name,
                                    id: i.id,
                                    has_section: i.has_section
                                }
                            })}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    {...params}
                                    label={t('Select class')}
                                    placeholder="Name"
                                />
                            )}
                            onChange={handleClassSelect}
                        />

                    </Grid>

                    {
                        selectedClass && sections && selectedClass.has_section && <>

                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`
                                }}
                                item
                                xs={12} sm={6} md={2}
                                justifyContent="flex-end"
                                textAlign={{ sm: 'right' }}
                            >
                                <Autocomplete
                                    id="tags-outlined"
                                    options={sections}
                                    value={selectedSection}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="select section"
                                            placeholder="Name"
                                        />
                                    )}
                                    onChange={(e, v) => {
                                        setSelectedSection(v)
                                        setSelectedStudent(null);
                                        setSelectedExam(null)

                                    }}
                                />

                            </Grid>
                        </>
                    }
                    {
                        selectedClass && selectedSection && exams && <>

                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`
                                }}
                                item
                                xs={12} sm={6} md={2}
                                justifyContent="flex-end"
                                textAlign={{ sm: 'right' }}
                            >
                                <Autocomplete
                                    id="tags-outlined"
                                    options={studentList}
                                    value={selectedStudent}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField

                                            {...params}
                                            label="select student"
                                            placeholder="Roll number"
                                        />
                                    )}
                                    onChange={(e, v) => setSelectedStudent(v)}
                                />

                            </Grid>
                        </>
                    }
                    {
                        selectedClass && selectedSection && studentList && <>

                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`
                                }}
                                item
                                xs={12} sm={6} md={3}
                                justifyContent="flex-end"
                                textAlign={{ sm: 'right' }}
                            >
                                <Autocomplete
                                    id="tags-outlined"
                                    options={exams}
                                    value={selectedExam}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="select exam"
                                            placeholder="Name"
                                        />
                                    )}
                                    onChange={(e, v) => {
                                        setSelectedExam(v)
                                        if (!v) {
                                            setResult(null)
                                        }

                                    }}
                                />

                            </Grid>
                            {
                                selectedExam && <Grid
                                    sx={{
                                        mb: `${theme.spacing(3)}`
                                    }}
                                    item
                                    xs={12} sm={6} md={2}
                                    justifyContent="flex-end"
                                    textAlign={{ sm: 'right' }}
                                >
                                    <Button variant='contained' onClick={handleSearchResult}>Find single exam result</Button>

                                </Grid>
                            }



                        </>
                    }


                    {
                        selectedSection && selectedStudent && !selectedExam && <Grid
                            sx={{
                                mb: `${theme.spacing(3)}`
                            }}
                            item
                            xs={12} sm={6} md={2}
                            justifyContent="flex-end"
                            textAlign={{ sm: 'right' }}
                        >
                            <Button variant='contained' onClick={handleFinalResultGenerate} >Generate Final result</Button>

                        </Grid>
                    }


                </Grid>






            </PageTitleWrapper>

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


                                <Table>
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

                                {
                                    finalResult?.termWiseTotalMark?.map(i => <>
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            Total mark counted from {i?.title} exam : {i?.calculatedTotalMark?.toFixed(2)}
                                        </Box>
                                        <Table>
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
