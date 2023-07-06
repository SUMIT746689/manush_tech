import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Autocomplete, Box, Button, Card, Checkbox, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, selectClasses, useTheme } from '@mui/material';
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

    const [exams, setExams] = useState(null);

    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [subjectList, setSubjectList] = useState(null)
    const paginatedResults = applyPagination(result, page, limit);


    const reportCardPrint = useRef()

    const selectedSomeUsers = selectedItems.length > 0 && selectedItems.length < result.length;
    const selectedAllUsers = selectedItems.length === result.length;
    const selectedBulkActions = selectedItems.length > 0;
    const subjectListLength = subjectList?.length;

    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };
    const handleSelectOneUser = (_event, row) => {
        if (selectedItems.findIndex(i => i.id == row.id) == -1) {
            setSelectedItems((prevSelected) => [...prevSelected, row]);
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((i) => i.id !== row.id)
            );
        }
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
                // console.log(res.data);

                setSubjectList(res.data.subject_list.exam_details.map(i => {
                    return {
                        name: i.subject.name,
                        id: i.subject.id,
                        subject_total: i.subject_total
                    }
                }))
                setResult(res.data.sections_result);
            })
            .catch((err) => console.log(err));
    };


    useEffect(() => {
        setResult([])
        setSubjectList(null)
        setSelectedItems([])
    }, [selectClasses, selectedSection, selectedExam]);

    useEffect(() => {
        console.log(result);

    }, [result])

    const handleSelectAllUsers = (event): void => {
        setSelectedItems(event.target.checked ? result : []);
    };
    return (
        <>
            <Head>
                <title>Report card section</title>
            </Head>
            <Card sx={{ minHeight: '78vh' }}>
                <PageTitleWrapper>
                    <PageHeader title={'Report card section'} />
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
                                        content={() => reportCardPrint.current}
                                        // pageStyle={`{ size: 2.5in 4in }`}
                                        trigger={() => (
                                            <Button variant="contained"
                                                startIcon={<LocalPrintshopIcon />}
                                                size="medium" onClick={() => {
                                                    console.log("selectedItems__", selectedItems);

                                                    showNotification('Not possible for now !', 'error')

                                                }}>{t('print')}</Button>
                                        )}
                                        // pageStyle="@page { size: A4; }"
                                        pageStyle={`@page { size: A4; } .printable-item { page-break-after: always; }`}
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
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedAllUsers}
                                                    indeterminate={selectedSomeUsers}
                                                    onChange={handleSelectAllUsers}
                                                />
                                            </TableCell>
                                            <TableCell>{t('class roll')}</TableCell>
                                            <TableCell>{t('Total marks obtained')}</TableCell>
                                            <TableCell>{t('GPA')}</TableCell>
                                            <TableCell>{t('Grade')}</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedResults?.map((row) => {
                                            const isUserSelected = selectedItems.findIndex(i => i.id == row.id) > -1;
                                            return (
                                                <TableRow >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isUserSelected}
                                                            onChange={(event) =>
                                                                handleSelectOneUser(event, row)
                                                            }
                                                            value={isUserSelected}
                                                        />
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                        {row?.student?.class_roll_no}
                                                    </TableCell>
                                                    <TableCell >{row?.total_marks_obtained?.toFixed(2)}</TableCell>
                                                    <TableCell >{(row?.calculated_point).toFixed(2)}</TableCell>
                                                    <TableCell >{row?.calculated_grade}</TableCell>

                                                </TableRow>

                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    )}

                </Grid>
            </Card>

            {/* print report Card */}
            <Grid sx={{
                display: 'none'
            }}>
                <Grid ref={reportCardPrint}>
                    {
                        selectedItems?.map(i => {
                            const resultDetailsLength = i?.result_details?.length
                            return <Grid sx={{
                                p: '15px',
                                pageBreakAfter: 'always'
                            }}>

                                <Grid container sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    maxHeight: '200px'
                                }}>
                                    <Grid sx={{
                                        // border:'1px solid red'
                                        maxWidth: '200px'
                                    }}>

                                        <img src="/elitbuzz.png" alt='logo' />
                                    </Grid>

                                    <Grid sx={{
                                        paddingRight: 10
                                    }}>
                                        <h1>{user?.school?.name}</h1>
                                        <h6>{academicYear?.label}</h6>
                                        <h5>{user?.school?.address}</h5>
                                        <h5>{user?.school?.phone}</h5>
                                        <h5>{user?.school?.email}</h5>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: 2,
                                }}>
                                    <Grid sx={{
                                        maxWidth: '85%',
                                        maxHeight: 'auto'
                                    }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={tableStyle}>Name</th>
                                                    <th style={tableStyle}>{i?.student?.student_info?.first_name} {i?.student?.student_info?.middle_name} {i?.student?.student_info?.last_name}</th>
                                                    <th style={tableStyle}>Registration no</th>
                                                    <th style={tableStyle}>{i?.student?.class_registration_no} </th>
                                                    <th style={tableStyle}>Roll no</th>
                                                    <th style={tableStyle}>{i?.student?.class_roll_no} </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{
                                                overflowX: 'auto',
                                                overflowY: 'auto'
                                            }}>
                                                <tr>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Father name</td>
                                                    <td style={tableStyle}>{i?.student?.student_info?.father_name}</td>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Admission date</td>
                                                    <td style={tableStyle}>{dayjs(i?.student?.student_info?.admission_date).format('YYYY-MM-DD')}</td>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Date of Birth</td>
                                                    <td style={tableStyle}>{dayjs(i?.student?.student_info?.date_of_birth).format('YYYY-MM-DD')}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Mother name</td>
                                                    <td style={tableStyle}>{i?.student?.student_info?.mother_name}</td>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Class</td>
                                                    <td style={tableStyle}>{i?.student?.section?.class?.name}</td>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Gender</td>
                                                    <td style={tableStyle}>{i?.student?.student_info?.gender}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Grid>
                                    <Grid sx={{
                                        maxWidth: '80PX'
                                    }}>
                                        {/* <Image width={200} height={300} alt='student_photo' src={`/files/${i?.student?.student_photo}` || "/dumy_teacher.png"}/> */}
                                        <img src={i?.student?.student_photo ? `/files/${i?.student?.student_photo}` : "/dumy_teacher.png"} alt='photo' />
                                    </Grid>
                                </Grid>

                                <Grid item sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: 'auto'
                                }}>
                                    <Table sx={{
                                        width: '97.5%',
                                        p: 2
                                    }}>
                                        <thead>
                                            <tr>
                                                <th style={tableStyle}>Subject</th>
                                                <th style={tableStyle}>Subject Obtain Marks</th>
                                                <th style={tableStyle}>Subject Total Marks</th>
                                                <th style={tableStyle}>Grade </th>
                                                <th style={tableStyle}>point</th>
                                                <th style={tableStyle}>Remark </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{
                                            overflowX: 'auto',
                                            overflowY: 'auto'
                                        }}>
                                            {
                                                subjectList?.map(j => {
                                                    const found = i?.result_details?.find(a => a?.exam_details?.subject?.id == j.id)



                                                    if (found) {
                                                        return <tr>
                                                            <td style={tableStyle}>{found?.exam_details?.subject?.name}</td>
                                                            <td style={tableStyle}>{found?.mark_obtained}</td>
                                                            <td style={tableStyle}>{found?.exam_details?.subject_total}</td>
                                                            <td style={tableStyle}>{found?.grade?.grade}</td>
                                                            <td style={tableStyle}>{found?.grade?.point}</td>
                                                            <td style={tableStyle}>{found?.remark}</td>
                                                        </tr>
                                                    }
                                                    else {
                                                        return <tr>
                                                            <td style={tableStyle}>not inserted</td>
                                                            <td style={tableStyle}>not inserted</td>
                                                            <td style={tableStyle}>{j?.subject_total}</td>
                                                            <td style={tableStyle}>not inserted</td>
                                                            <td style={tableStyle}>not inserted</td>
                                                            <td style={tableStyle}></td>
                                                        </tr>
                                                    }
                                                })
                                            }

                                        </tbody>
                                    </Table>
                                </Grid>

                                <Grid sx={{
                                    p: 1,

                                }}>
                                    <Table sx={{
                                        width: '40vh',
                                        paddingLeft: 5
                                    }}>
                                        <thead>
                                            <tr>
                                                <th style={tableStyle}>GPA</th>
                                                <th style={tableStyle}>{subjectListLength === resultDetailsLength ? i?.calculated_point : 'not inserted'}</th>

                                            </tr>
                                            <tr>
                                                <th style={tableStyle}>Grand Total marks</th>
                                                <th style={tableStyle}>{subjectListLength === resultDetailsLength ? i?.total_marks_obtained : 'not inserted'}</th>

                                            </tr>
                                            <tr>
                                                <th style={tableStyle}>Result</th>
                                                <th style={tableStyle}>{subjectListLength === resultDetailsLength ? i?.calculated_grade : 'not inserted'}</th>

                                            </tr>
                                        </thead>

                                    </Table>
                                </Grid>

                                <Grid container sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                }}>
                                    <Grid sx={{
                                        px: 2
                                    }}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <td colSpan={2} style={{ ...tableStyle, fontWeight: 'bold' }}>Attendence</td>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>No. of working days</td>
                                                    <td style={tableStyle}>0</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>No. of days attended</td>
                                                    <td style={tableStyle}>0</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ ...tableStyle, fontWeight: 'bold' }}>Attended percentage</td>
                                                    <td style={tableStyle}>0.00%</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Grid>

                                    <Grid sx={{
                                        px: 2
                                    }}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <td colSpan={3} style={{ ...gradeTableStyle, fontWeight: 'bold' }}>Grading Scale</td>

                                                </tr>
                                                <tr>
                                                    <td style={{ ...gradeTableStyle, fontWeight: 'bold' }}>Grade</td>
                                                    <td style={{ ...gradeTableStyle, fontWeight: 'bold' }}>Min percentage</td>
                                                    <td style={{ ...gradeTableStyle, fontWeight: 'bold' }}>Max percentage</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={gradeTableStyle}>A+</td>
                                                    <td style={gradeTableStyle}>80%</td>
                                                    <td style={gradeTableStyle}>100%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>A</td>
                                                    <td style={gradeTableStyle}>70%</td>
                                                    <td style={gradeTableStyle}>79%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>A-</td>
                                                    <td style={gradeTableStyle}>60%</td>
                                                    <td style={gradeTableStyle}>69%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>B</td>
                                                    <td style={gradeTableStyle}>50%</td>
                                                    <td style={gradeTableStyle}>59%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>C</td>
                                                    <td style={gradeTableStyle}>40%</td>
                                                    <td style={gradeTableStyle}>49%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>D</td>
                                                    <td style={gradeTableStyle}>33%</td>
                                                    <td style={gradeTableStyle}>39%</td>
                                                </tr>
                                                <tr>
                                                    <td style={gradeTableStyle}>F</td>
                                                    <td style={gradeTableStyle}>0%</td>
                                                    <td style={gradeTableStyle}>32%</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </Grid>

                                </Grid>
                            </Grid>
                        }

                        )
                    }
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
