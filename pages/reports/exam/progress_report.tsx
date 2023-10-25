import Head from 'next/head';
import { useState, useEffect, useContext, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Avatar, Box, Button, Card, Checkbox, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { ClassAndSectionSelect } from '@/components/Attendence';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { useAuth } from '@/hooks/useAuth';

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
    const { user } = useAuth();
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
        setFinalResultList(null)
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
        setFinalResultList(null)
        setSelectedItems(event.target.checked ? students.map(i => i.id) : []);
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
                <title>Progress Report Section</title>
            </Head>

            <PageTitleWrapper >

                <PageHeader title={'Progress Report Section'} />

            </PageTitleWrapper>

            <Grid
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                sx={{ px: { xs: 2, sm: 4 } }}
            >
                <Grid item xs={12}>
                    <Card sx={{ p: 1, pb: 0, mb: 3, display: "grid", gridTemplateColumns: { sm: "1fr 1fr 1fr", md: "1fr 1fr 1fr 1fr 1fr" }, columnGap: 1 }}>

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
                            selectedSection && <ButtonWrapper handleClick={handleFindStudents}>Find</ButtonWrapper>
                        }
                        {
                            selectedBulkActions && <ButtonWrapper handleClick={handleFinalResultGenerate}>Generate</ButtonWrapper>
                        }
                        {
                            selectedBulkActions && finalResultList &&
                            <ReactToPrint
                                content={() => progressReportPrint.current}
                                // pageStyle={`{ size: 2.5in 4in }`}
                                trigger={() => (
                                    <ButtonWrapper
                                        startIcon={<LocalPrintshopIcon />}
                                        handleClick={undefined} >{t('Print')}</ButtonWrapper>
                                )}
                            // pageStyle="@page { size: A4; }"
                            // pageStyle={` .printable-item { page-break-after: always; }`}
                            />

                        }
                    </Card>
                </Grid>
                <Divider />
                <Card sx={{ minHeight: 'calc(100vh - 413px)' }}>

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
                                <Table aria-label="collapsible table" size="small">
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
                </Card>
            </Grid>

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
                                    <Typography variant="h6" align="center">Final result</Typography>
                                    <Typography variant="h6" align="center">Student name : {finalResult?.student?.student_info?.first_name} {finalResult?.student?.student_info?.middle_name} {finalResult?.student?.student_info?.last_name}</Typography>
                                    <Typography variant="h6" align="center">Class roll : {finalResult?.student?.class_roll_no}</Typography>
                                    <Typography variant="h6" align="center">Total mark: {finalResult?.termWiseTotalMark?.reduce(
                                        (accumulator, currentValue) => accumulator + currentValue?.calculatedTotalMark, 0
                                    ).toFixed(2)}</Typography>
                                </Grid>

                                <Grid item>
                                    <Typography variant="h4" >
                                        Progress Report
                                    </Typography>
                                </Grid>


                            </Grid>

                            <Grid container sx={{
                                display: 'flex',
                                justifyContent: 'left',
                            }}>


                                {
                                    finalResult?.termWiseTotalMark?.map(i => <Grid item sx={{
                                        p: 2
                                    }}>
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            Total mark counted from {i?.title} exam : {i?.calculatedTotalMark?.toFixed(2)}
                                        </Box>
                                        <Table size='small'>
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
                                        </Table>

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
