import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Avatar, Box, Button, Card, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
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
    // textAlign: 'center',
    padding: '2px',
    fontSize: '0.8em',
    // backgroundColor: '#cccccc'
};
const gradeTableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    fontSize: '11px',
    fontWeight: 'bold',
    //  width: '5px',
    textAlign: 'center',
    padding: '3px'
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
    const [examList, setExamList] = useState([])
    const [exams, setExams] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [grade, setGrade] = useState([])

    const paginatedResults = applyPagination(result, page, limit);
    const tabulation_sheet_Print = useRef()


    const selectedBulkActions = result.length > 0;

    const tableHeaderLength = examList?.length;

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

    const handleSearchResult = () => {

        axios.get(`/api/result/result_sheet?section_id=${selectedSection.id}&academic_year_id=${academicYear.id}`)
            .then((res) => {
                // setResult(res.data.student_result_list);
                // setExamList(res.data.examList)

            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        setResult([])

    }, [selectedSection, selectedExam, academicYear]);
    useEffect(() => {
        axios.get(`/api/grade?academic_year_id=${academicYear?.id}`)
            .then(res => setGrade(res.data))
            .catch(err => console.log(err));

    }, [academicYear]);



    return (
        <>
            <Head>
                <title>Result sheet section</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Result sheet section'} />
            </PageTitleWrapper>

            {/* filter part */}
            <Grid
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                sx={{ px: { xs: 2, sm: 4 } }}
            >
                <Grid item xs={12}>
                    <Card sx={{ p: 1, pb: 0, mb: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr" }, gap: 1, justifyContent: "center" }}>

                        <ClassAndSectionSelect
                            selectedClass={selectedClass}
                            setSelectedClass={setSelectedClass}
                            classes={classes}
                            selectedDate={null}
                            selectedSection={selectedSection}
                            setSelectedSection={setSelectedSection}
                            flag={true}

                        />

                        {
                            selectedClass && selectedSection && <ButtonWrapper handleClick={handleSearchResult}> Search</ButtonWrapper>
                        }
                        {
                            // selectedBulkActions &&
                            <ReactToPrint
                                content={() => tabulation_sheet_Print.current}
                                // pageStyle={`{ size: 2.5in 4in }`}

                                trigger={() => (
                                    <ButtonWrapper handleClick={undefined}
                                        startIcon={<LocalPrintshopIcon />}
                                        size="medium">{t('print')}</ButtonWrapper>
                                )}
                            // pageStyle={"@page { size: landscape; }"}
                            />

                        }
                    </Card>
                </Grid>
                <Divider />
                {/* result */}
                <Card sx={{ minHeight: 'calc(100vh - 418px)' }}>
                    {!selectedBulkActions && (
                        <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography component="span" variant="subtitle1">
                                    {t('Showing')}:
                                </Typography>{' '}
                                <b>{paginatedResults.length}</b> <b>{t('Result')}</b>
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
                    )}
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
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell >{t('Sl')}</TableCell>
                                            <TableCell >{t('Students')}</TableCell>
                                            <TableCell >{t('Roll')}</TableCell>
                                            {
                                                examList.map(j => <TableCell>{t(`${j.name}(${j.subject_total})`)}</TableCell>)
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
                                                        examList?.map(j => {
                                                            const found = i.result_details.find(sub => sub.exam_details.subject.id == j.id)
                                                            console.log(found);

                                                            if (found) {
                                                                return <TableCell >{found.mark_obtained}</TableCell>
                                                            } else {
                                                                return <TableCell >not taken</TableCell>
                                                            }
                                                        })
                                                    }
                                                    <TableCell >{tableHeaderLength == resultDetailsLength ? i?.total_marks_obtained?.toFixed(2) : 'not inserted'}</TableCell>
                                                    <TableCell >{tableHeaderLength == resultDetailsLength ? i?.calculated_point?.toFixed(2) : 'not inserted'}</TableCell>
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

                </Card>
            </Grid>

            {/* pdf  */}
            <Grid sx={{
                //  display: 'none'
            }}>
                <Grid ref={tabulation_sheet_Print}>

                    <Grid sx={{
                        height: 'auto',
                        pageBreakAfter: 'always',
                        p: 3
                    }}>


                        <Grid sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '5%',
                            pb: 1
                        }}>
                            <Grid sx={{
                                maxWidth: '10em'
                            }}>
                                <img src="/mram.png" alt='logo' />
                            </Grid>
                            <Grid sx={{
                                textAlign: 'center'
                            }}>
                                <Typography variant="h1" gutterBottom>
                                    {user?.school?.name}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {user?.school?.address},{user?.school?.phone}
                                </Typography>

                            </Grid>
                            <Typography variant="h4" align='center' gutterBottom py={1.5}>
                                Academic year<br />
                                ({academicYear?.label})
                            </Typography>
                        </Grid>

                        <Grid display={'grid'} gridTemplateColumns={'auto 30%'} gap={2}>
                            {/* student info  */}
                            <table>
                                <thead>
                                    <tr>
                                        <th style={gradeTableStyle}>Date</th>
                                        <th style={{ ...gradeTableStyle, width: '18%' }}>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                        <th style={gradeTableStyle}>Tests</th>
                                        <th style={gradeTableStyle}>Total</th>
                                        <th style={gradeTableStyle}>Pass</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td style={gradeTableStyle}>Class</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}>Written</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={gradeTableStyle}>Batch</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}>MCQ</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={gradeTableStyle}>Exam type</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}>Practical</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={gradeTableStyle}>শাখা</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}>Viva Voce</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Grading */}
                            <table>
                                <thead>
                                    <tr>
                                        <td colSpan={3} style={gradeTableStyle}>Grading Scale</td>
                                    </tr>
                                    <tr>
                                        <td style={gradeTableStyle}>Marks</td>
                                        <td style={gradeTableStyle}>Grade</td>
                                        <td style={gradeTableStyle}>Point</td>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        grade?.map(i => <tr>
                                            <td style={gradeTableStyle}>{i?.lower_mark} - {i?.upper_mark}</td>
                                            <td style={gradeTableStyle}>{i?.grade}</td>
                                            <td style={gradeTableStyle}>{i?.point}</td>
                                        </tr>)
                                    }


                                </tbody>
                            </table>
                        </Grid>

                        <Typography variant="h3" align='center' py={1.5}>
                            <u>Result Sheet</u>
                        </Typography>


                        <Grid item sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 1,

                        }}>
                            <table style={{ width: '100%' }}>

                                <tbody style={{
                                    overflowX: 'auto',
                                    overflowY: 'auto'
                                }}>
                                    <tr>
                                        <th rowSpan={2} style={gradeTableStyle}>Roll</th>
                                        <th rowSpan={2} style={gradeTableStyle}>Name</th>
                                        {
                                            [1, 2, 3].map(j =>
                                                <>
                                                    <th colSpan={3} style={gradeTableStyle}>{j}</th>

                                                </>
                                            )
                                        }

                                        <th rowSpan={2} style={gradeTableStyle}>Total</th>
                                        <th rowSpan={2} style={gradeTableStyle}>GPA</th>
                                    </tr>
                                    <tr>

                                        {
                                            [1, 2, 3].map(j =>
                                                <>
                                                    <th style={gradeTableStyle}>Obtain</th>
                                                    <th style={gradeTableStyle}>Counted</th>
                                                    <th style={gradeTableStyle}>Status</th>

                                                </>
                                            )
                                        }


                                    </tr>

                                    {
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(j => (
                                            <tr>
                                                <th style={gradeTableStyle}>{j}</th>
                                                <th style={gradeTableStyle}></th>
                                                {
                                                    [1, 2, 3].map(j =>
                                                        <>
                                                            <th style={gradeTableStyle}></th>
                                                            <th style={gradeTableStyle}></th>
                                                            <th style={gradeTableStyle}></th>

                                                        </>
                                                    )
                                                }

                                                <th style={gradeTableStyle}></th>
                                                <th style={gradeTableStyle}></th>
                                                
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                            <br />
                            <table style={{ width: '100%' }}>
                                <tbody style={{
                                    overflowX: 'auto',
                                    overflowY: 'auto'
                                }}>
                                    <tr >
                                        <th style={gradeTableStyle}>Signature</th>
                                        <th style={gradeTableStyle}>Prepared By</th>
                                        <th style={gradeTableStyle}>Checked By</th>
                                        <th style={gradeTableStyle}>Exam Controller</th>
                                        <th style={gradeTableStyle}>Result Publication Date</th>

                                    </tr>

                                    <tr style={{
                                        borderTop:'1px solid',
                                        borderRight:'1px solid',
                                        borderLeft:'1px solid',
                                    }}>
                                        <td rowSpan={1} style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td rowSpan={1} style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td rowSpan={1} style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td rowSpan={1} style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td rowSpan={1} style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>

                                    </tr>
                                    
                                    <tr style={{
                                        borderRight:'1px solid',
                                        borderLeft:'1px solid',
                                        borderBottom:'1px solid'
                                    }}>
                                        <td style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>
                                        <td style={{...gradeTableStyle,border:'0px',borderRight:'1px solid'}}>&nbsp;</td>

                                    </tr>



                                    <tr>
                                        <td style={gradeTableStyle}>Date</td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                        <td style={gradeTableStyle}></td>
                                    </tr>

                                </tbody>
                            </table>
                        </Grid>

                    </Grid >

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
