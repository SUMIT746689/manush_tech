import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Button, Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import { ClassAndSectionSelect } from '@/components/Attendence';
import { useTranslation } from 'next-i18next';
import useNotistick from '@/hooks/useNotistick';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';

const applyPagination = (array, page, limit) => {
    return array.slice(page * limit, page * limit + limit);
};
const tableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    textAlign: 'center',
    padding: '2px',
    fontSize: '0.8em'
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
    const [tableHeader, setTableHeader] = useState([])
    const [exams, setExams] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);


    const paginatedResults = applyPagination(result, page, limit);
    const tabulation_sheet_Print = useRef()


    const selectedBulkActions = result.length > 0;

    const tableHeaderLength = tableHeader?.length;

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
                setTableHeader(res.data.subject_list.exam_details.map(i => {
                    return {
                        name: i.subject.name,
                        id: i.subject.id,
                        subject_total: i.subject_total
                    }
                }))


            })
            .catch((err) => console.log(err));
    };


    useEffect(() => {
        setResult([])

    }, [selectedSection, selectedExam]);



    return (
        <>
            <Head>
                <title>Tabulation sheet section</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Tabulation sheet section'} />
            </PageTitleWrapper>

            {/* filter part */}
            <Card sx={{ maxWidth: 900, mx: "auto", pt: 1, px: 1, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr auto" }, gap: 1, justifyContent: "center" }}>
                <Grid item  >
                    <Box p={1}>
                        <ClassAndSectionSelect
                            selectedClass={selectedClass}
                            setSelectedClass={setSelectedClass}
                            classes={classes}
                            selectedDate={null}
                            selectedSection={selectedSection}
                            setSelectedSection={setSelectedSection}
                            flag={true}

                        />
                    </Box>
                </Grid>
                {
                    selectedSection && exams && <Grid item>

                        {/* <Box p={1}>
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
            </Box> */}
                        <AutoCompleteWrapper
                            options={exams}
                            value={selectedExam}
                            label="Select Exam"
                            placeholder="input an exam..."
                            handleChange={(e, newvalue) => { setSelectedExam(newvalue) }}
                        />

                    </Grid>
                }
                {
                    selectedExam && <ButtonWrapper handleClick={handleSearchResult}> Search</ButtonWrapper>
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
            </Card>

            {/* result */}
            <Card sx={{ minHeight: '78vh', mt: 1 }}>
                <Grid p={2}>

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
                                            {
                                                tableHeader.map(j => <TableCell>{t(`${j.name}(${j.subject_total})`)}</TableCell>)
                                            }
                                            <TableCell >{t('Total marks')}</TableCell>
                                            <TableCell >{t('GPA')}</TableCell>
                                            <TableCell >{t('Result')}</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {
                                            paginatedResults.map((i, index) => {
                                                const resultDetailsLength = i?.result_details?.length
                                                return <TableRow>

                                                    <TableCell >{index + 1}</TableCell>
                                                    <TableCell >{i.student.student_info.first_name}</TableCell>
                                                    <TableCell >{i.student.class_roll_no}</TableCell>
                                                    {
                                                        tableHeader?.map(j => {
                                                            const found = i.result_details.find(sub => sub.exam_details.subject.id == j.id)
                                                            console.log(found);

                                                            if (found) {
                                                                return <TableCell >{found.mark_obtained}</TableCell>
                                                            } else {
                                                                return <TableCell >not taken</TableCell>
                                                            }
                                                        })
                                                    }
                                                    <TableCell >{tableHeaderLength == resultDetailsLength ? i?.total_marks_obtained : 'not inserted'}</TableCell>
                                                    <TableCell >{tableHeaderLength == resultDetailsLength ? i?.calculated_point : 'not inserted'}</TableCell>
                                                    <TableCell >{tableHeaderLength == resultDetailsLength ? i?.calculated_grade : 'not inserted'}</TableCell>
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


            {/* pdf  */}
            <Grid sx={{
                display: 'none'
            }}>
                <Grid container sx={{ p: 2 }} ref={tabulation_sheet_Print}>

                    <Grid sx={{
                        textAlign: 'center',
                        paddingBottom: 2
                    }}>
                        <h1>Tabulation sheet</h1>

                        <h3>Section :{selectedSection?.label}</h3>
                    </Grid>

                    <table>
                        <thead>
                            <tr>
                                <th style={tableStyle}>{t('Sl')}</th>
                                <th style={tableStyle}>{t('Students')}</th>
                                <th style={tableStyle}>{t('Roll')}</th>
                                {
                                    tableHeader.map(j => <th style={tableStyle}>{t(`${j.name}\n(${j.subject_total})`)}</th>)
                                }

                                <th style={tableStyle}>{t('Total marks')}</th>
                                <th style={tableStyle}>{t('GPA')}</th>
                                <th style={tableStyle}>{t('Result')}</th>
                            </tr>
                        </thead>
                        <tbody style={{
                            overflowX: 'auto',
                            overflowY: 'auto'
                        }}>

                            {
                                result.map((i, index) => {
                                    const resultDetailsLength = i?.result_details?.length
                                    return <tr>

                                        <td style={tableStyle} >{index + 1}</td>
                                        <td style={tableStyle} >{i.student.student_info.first_name}</td>
                                        <td style={tableStyle} >{i.student.class_roll_no}</td>
                                        {
                                            tableHeader?.map(j => {
                                                const found = i.result_details.find(sub => sub.exam_details.subject.id == j.id)
                                                console.log(found);

                                                if (found) {
                                                    return <td style={tableStyle} >{found.mark_obtained}</td>
                                                } else {
                                                    return <td style={tableStyle} >not taken</td>
                                                }
                                            })
                                        }
                                        <td style={tableStyle} >{tableHeaderLength == resultDetailsLength ? i?.total_marks_obtained : 'not inserted'}</td>
                                        <td style={tableStyle} >{tableHeaderLength == resultDetailsLength ? i?.calculated_point : 'not inserted'}</td>
                                        <td style={tableStyle} >{tableHeaderLength == resultDetailsLength ? i?.calculated_grade : 'not inserted'}</td>
                                    </tr>
                                }

                                )
                            }
                        </tbody>
                    </table>
                </Grid >


            </Grid >

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
