import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Autocomplete, Box, Button, Card, Checkbox, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, useTheme } from '@mui/material';
import Results from 'src/content/Management/Result/Results';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import { ClassAndSectionSelect } from '@/components/Attendence';
import { useTranslation } from 'next-i18next';
import useNotistick from '@/hooks/useNotistick';
import Image from 'next/image';
import ReactToPrint from 'react-to-print';
import dayjs from 'dayjs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const applyPagination = (array, page, limit) => {
    return array.slice(page * limit, page * limit + limit);
};
const tableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    minWidth: '60px',
    textAlign: 'center',
    padding: '8px'
    // backgroundColor: '#cccccc'
};
const gradeTableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    minWidth: '40px',
    textAlign: 'center',
    padding: '6px'
    // backgroundColor: '#cccccc'
};

function Managementschools() {
    const theme = useTheme();
    const { t }: { t: any } = useTranslation();
    const [result, setResult] = useState([]);

    const { showNotification } = useNotistick()
    const { user } = useAuth();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
    const [classes, setClasses] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [total_exam_mark, setTotal_exam_mark] = useState(null)
    const [subjectlistLength, setSubjectlistLength] = useState(null)
    const [exams, setExams] = useState(null);

    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);


    const paginatedResults = applyPagination(result, page, limit);
    const tabulation_sheet_Print = useRef()


    const selectedBulkActions = result.length > 0;

    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };

    useEffect(() => {
        axios
            .get(`/api/class?school_id=${user?.school_id}`)
            .then((res) => setClasses(res?.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (selectedSection && academicYear && user) {
            axios.get(`/api/exam/exam-list?school_id=${user?.school_id}&academic_year=${academicYear?.id}&section_id=${selectedSection.id}`)
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
            setSelectedExam(null);
        }
    }, [selectedSection, academicYear, user]);

    const handleSearchResult = () => {
        axios.get(`/api/result/?section_id=${selectedSection.id}&exam_id=${selectedExam.id}`)
            .then((res) => {
                setResult(res.data.sections_result);
                setTotal_exam_mark(res.data.subject_list.exam_details.reduce((a, c) => a + c.subject_total, 0))
                setSubjectlistLength(res.data.subject_list.exam_details.length)

            })
            .catch((err) => console.log(err));
    };


    useEffect(() => {
        setResult([])

    }, [selectedSection, selectedExam]);



    return (
        <>
            <Head>
                <title>Merit list section</title>
            </Head>
            <Card sx={{ minHeight: '78vh' }}>
                <PageTitleWrapper>
                    <PageHeader title={'Merit list section'} />
                </PageTitleWrapper>

                <Grid p={2}>
                    <Grid item container>
                        <Grid item  >
                            <Box p={1}>
                                <ClassAndSectionSelect
                                    classes={classes}
                                    selectedDate={null}
                                    selectedSection={selectedSection}
                                    setSelectedSection={setSelectedSection}
                                    flag={true}

                                />
                            </Box>
                        </Grid>

                        {
                            selectedSection && exams && <>
                                <Grid
                                    item xs={6} sm={4} md={3}
                                >
                                    <Box p={1}>
                                        <Autocomplete
                                            id="tags-outlined"
                                            options={exams}
                                            value={selectedExam}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select exam"
                                                    placeholder="exam"
                                                />
                                            )}
                                            onChange={(e, newvalue) => {
                                                setSelectedExam(newvalue)
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </>
                        }
                        {
                            selectedExam && <Grid item xs={2} sm={4} md={2} >
                                <Box p={1}>
                                    <Button variant="contained"
                                        size="medium" onClick={handleSearchResult}>Find</Button>
                                </Box>
                            </Grid>
                        }
                        {
                            selectedBulkActions && <Grid item xs={2} sm={4} md={1} >
                                <Box p={1}>


                                    <ReactToPrint
                                        content={() => tabulation_sheet_Print.current}
                                        // pageStyle={`{ size: 2.5in 4in }`}

                                        trigger={() => (
                                            <Button variant="contained"
                                                startIcon={<LocalPrintshopIcon />}
                                                size="medium">{t('print')}</Button>
                                        )}
                                    // pageStyle={"@page { size: landscape; }"}
                                    />
                                </Box>
                            </Grid>
                        }


                    </Grid>
                    <Divider />

                    {paginatedResults.length === 0 ? (
                        <>
                            <Typography
                                sx={{
                                    py: 10
                                }}
                                variant="h3"
                                fontWeight="normal"
                                color="text.secondary"
                                align="center"
                            >
                                {t(
                                    "We couldn't find any result matching your search criteria"
                                )}
                            </Typography>
                        </>
                    ) : (

                        <>
                            {
                                paginatedResults &&
                                <Box
                                    p={2}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography component="span" variant="subtitle1">
                                            {t('Showing')}:
                                        </Typography>{' '}
                                        <b>{paginatedResults.length}</b> <b>{t('result')}</b>
                                    </Box>
                                    <TablePagination
                                        component="div"
                                        count={paginatedResults.length}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleLimitChange}
                                        page={page}
                                        rowsPerPage={limit}
                                        rowsPerPageOptions={[5, 10, 15]}
                                    />
                                </Box>
                            }
                            < TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell >{t('Sl')}</TableCell>
                                            <TableCell >{t('Students')}</TableCell>
                                            <TableCell >{t('Roll')}</TableCell>
                                            <TableCell >{t('Total marks')}</TableCell>
                                            <TableCell >{t('GPA')}</TableCell>
                                            <TableCell >{t('Result')}</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {
                                            paginatedResults.map((i, index) => {
                                                const result_detailsLength = i.result_details.length;
                                                let name = i.student.student_info.first_name;
                                                if (i.student.student_info.middle_name) {
                                                    name += ' ' + i.student.student_info.middle_name
                                                }
                                                if (i.student.student_info.last_name) {
                                                    name += ' ' + i.student.student_info.last_name
                                                }
                                                return <TableRow>

                                                    <TableCell >{index + 1}</TableCell>
                                                    <TableCell >{name}</TableCell>
                                                    <TableCell >{i.student.class_roll_no}</TableCell>
                                                    <TableCell >{subjectlistLength == result_detailsLength ? `${i?.total_marks_obtained}/${total_exam_mark}` : 'not inserted'}</TableCell>
                                                    <TableCell >{subjectlistLength == result_detailsLength ? i?.calculated_point : 'not inserted'}</TableCell>
                                                    <TableCell >{subjectlistLength == result_detailsLength ? i?.calculated_grade : 'not inserted'}</TableCell>
                                                </TableRow>
                                            }

                                            )
                                        }

                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    )}

                </Grid>
            </Card>
            <Grid sx={{
                display: 'none'
            }}>
                <Grid sx={{
                    p: 1
                }} ref={tabulation_sheet_Print}>

                    <Grid sx={{
                        textAlign: 'center'
                    }}>
                        <h1>Tabulation sheet</h1>

                        <h3>Section :{selectedSection?.label}</h3>
                    </Grid>
                    <Grid sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        < TableContainer sx={{ marginX: 1, p: 0.5 }}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>

                                        <TableCell >{t('Sl')}</TableCell>
                                        <TableCell >{t('Students')}</TableCell>
                                        <TableCell >{t('Roll')}</TableCell>
                                        <TableCell >{t('Total marks')}</TableCell>
                                        <TableCell >{t('GPA')}</TableCell>
                                        <TableCell >{t('Result')}</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {
                                        result?.map((i, index) => {
                                            const result_detailsLength = i.result_details.length;
                                            let name = i.student.student_info.first_name;
                                            if (i.student.student_info.middle_name) {
                                                name += ' ' + i.student.student_info.middle_name
                                            }
                                            if (i.student.student_info.last_name) {
                                                name += ' ' + i.student.student_info.last_name
                                            }
                                            return <TableRow>

                                                <TableCell >{index + 1}</TableCell>
                                                <TableCell >{name}</TableCell>
                                                <TableCell >{i.student.class_roll_no}</TableCell>
                                                <TableCell >{subjectlistLength == result_detailsLength ? `${i?.total_marks_obtained}/${total_exam_mark}` : 'not inserted'}</TableCell>
                                                <TableCell >{subjectlistLength == result_detailsLength ? i?.calculated_point : 'not inserted'}</TableCell>
                                                <TableCell >{subjectlistLength == result_detailsLength ? i?.calculated_grade : 'not inserted'}</TableCell>
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

            <Footer />
        </>
    );
}

Managementschools.getLayout = (page) => (
    <Authenticated name="teacher">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Managementschools;
