import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Button, Card, Checkbox, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { ClassAndSectionSelect } from '@/components/Attendence';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const tableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    minWidth: '60px',
    textAlign: 'center',
    padding: '8px'
    // backgroundColor: '#cccccc'
};
const applyPagination = (array, page, limit) => {
    return array.slice(page * limit, page * limit + limit);
};

function Managementschools() {

    const { t }: { t: any } = useTranslation();
    const theme = useTheme();

    const [academicYear, setAcademicYear] = useContext(AcademicYearContext)

    const [classes, setClasses] = useState([]);

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const progressReportPrint = useRef()

    const [selectedItems, setSelectedItems] = useState([])
    const [students, setStudents] = useState([])
    const [finalResultList, setFinalResultList] = useState(null);

    const paginatedResults = applyPagination(students, page, limit);

    const selectedAllUsers = selectedItems.length === students.length;
    const selectedBulkActions = selectedItems.length > 0;

    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };
    const handleSelectOneUser = (_event, row) => {
        if (selectedItems.findIndex(i => i == row.id) == -1) {
            setSelectedItems((prevSelected) => [...prevSelected, row.id]);
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((i) => i !== row.id)
            );
        }
    };

    useEffect(() => {
        axios.get(`/api/class`)
            .then(res => setClasses(res?.data))
            .catch(err => console.log(err));
    }, [])
    useEffect(() => {
        setStudents([])
        setFinalResultList(null)
        setSelectedItems([])
    }, [selectedSection])


    const handleSelectAllUsers = (event): void => {
        setSelectedItems(event.target.checked ? students.map(i => { return i.id }) : []);
    };


    const handleFindStudents = () => {
        try {
            if (academicYear && selectedSection) {
                axios.get(`/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection?.id}`)
                    .then((res) => {
                        setStudents(res.data);
                    });
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleFinalResultGenerate = () => {
        if (selectedBulkActions) {
            axios.post(`/api/result/final-result-all?section_id=${selectedSection?.id}&academic_year_id=${academicYear.id}`, {
                student_id_list: selectedItems
            })
                .then(res => {

                    setFinalResultList(res.data)


                }).catch((err) => {
                    console.log(err);
                })
        }


    }
    return (
        <>
            <Head>
                <title>progress Report Section</title>
            </Head>
            <Card sx={{ minHeight: '78vh' }}>
                <PageTitleWrapper >

                    <PageHeader title={'Progress Report Section'} />

                </PageTitleWrapper>

                <Grid p={2}>
                    <Grid item container>
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
                            selectedSection && <Grid item xs={2} sm={4} md={2} >
                                <Box p={1}>
                                    <Button variant="contained"
                                        size="medium" onClick={handleFindStudents}>Find</Button>
                                </Box>
                            </Grid>
                        }
                        {
                            selectedBulkActions && <Grid item xs={2} sm={4} md={2} >
                                <Box p={1}>
                                    <Button variant="contained"
                                        size="medium" onClick={handleFinalResultGenerate}>Generate</Button>

                                </Box>
                            </Grid>
                        }
                        {
                            finalResultList && <Grid item xs={2} sm={4} md={2} >
                                <Box p={1}>

                                    <ReactToPrint
                                        content={() => progressReportPrint.current}
                                        // pageStyle={`{ size: 2.5in 4in }`}
                                        trigger={() => (
                                            <Button variant="contained"
                                                startIcon={<LocalPrintshopIcon />}
                                                size="medium" >{t('print')}</Button>
                                        )}
                                    // pageStyle="@page { size: A4; }"
                                    // pageStyle={` .printable-item { page-break-after: always; }`}
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
                                !selectedAllUsers && <Box
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
                                                    onChange={handleSelectAllUsers}
                                                />
                                            </TableCell>

                                            <TableCell>{t('Name')}</TableCell>
                                            <TableCell>{t('class roll')}</TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedResults?.map((row) => {
                                            const isUserSelected = selectedItems.findIndex(i => i == row.id) > -1;
                                            let name = row?.student_info?.first_name;
                                            if (row?.student_info?.middle_name) {
                                                name += row?.student_info?.middle_name
                                            }
                                            if (row?.student_info?.last_name) {
                                                name += row?.student_info?.last_name
                                            }
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
                                                        {name}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row?.class_roll_no}
                                                    </TableCell>
                                                    <TableCell >{row?.total_marks_obtained?.toFixed(2)}</TableCell>
                                                    <TableCell >{row?.grade}</TableCell>

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
            {/* progressReportPrint */}
            <Grid sx={{
                display: 'none'
            }}>
                <Grid ref={progressReportPrint}>
                    {
                        finalResultList?.map(finalResult => <Grid sx={{
                            p: '15px',
                            pageBreakAfter: 'always'
                        }}>
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
                            <Grid container sx={{
                                display: 'flex',
                                justifyContent: 'left'
                            }}>


                                {
                                    finalResult?.termWiseTotalMark?.map(i => <Grid item sx={{
                                        p: 2
                                    }}>
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            Total mark counted from {i?.title} exam : {i?.calculatedTotalMark?.toFixed(2)}
                                        </Box>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={tableStyle}>{t('Subject Name')}</th>
                                                    <th style={tableStyle}>{t('Counted mark')}</th>
                                                    <th style={tableStyle}>{t('Subject total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{
                                                overflowX: 'auto',
                                                overflowY: 'auto'
                                            }}>
                                                {i?.result?.map(j =>
                                                    <tr>
                                                        <td style={tableStyle}>

                                                            {j?.subject_name}

                                                        </td>
                                                        <td style={tableStyle}>

                                                            {j?.singleSubjectCalculetedMark}

                                                        </td>
                                                        <td style={tableStyle}>
                                                            {j?.subject_total}

                                                        </td>
                                                    </tr>

                                                )}
                                            </tbody>
                                        </table>

                                    </Grid>)
                                }



                            </Grid>

                        </Grid>)

                    }
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}

Managementschools.getLayout = (page) => (
    <Authenticated name='teacher'>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Managementschools;
