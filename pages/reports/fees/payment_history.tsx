import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Autocomplete, Box, Button, Card, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import type { Project } from 'src/models/project';
import { useClientFetch } from 'src/hooks/useClientFetch';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import { TableHeadWrapper } from '@/components/TableWrapper';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
const tableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    textAlign: 'center',
    padding: '2px',
    fontSize: '0.8em'

    // backgroundColor: '#cccccc'
};
function FeesPaymentReport() {

    const { t }: { t: any } = useTranslation();
    const [datas, setDatas] = useState<any>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [students, setStudents] = useState<[object?]>([]);

    const [filteredFees, setFilteredFees] = useState<any>([]);
    const { data: classData, error: classError } = useClientFetch('/api/class');

    const printPageRef = useRef();

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [filter, setFilter] = useState<string>('all');
    const [paginatedTransection, setPaginatedTransection] = useState<any>([]);

    const { user } = useAuth();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

    useEffect(() => {
        if (selectedStudent) {
            axios
                // @ts-ignore
                .get(`/api/student_payment_collect/${selectedStudent.id}`)
                .then((res) => {
                    console.log("re_____",res.data);
                    
                    if (res.data?.success) setDatas(res.data.data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [selectedStudent]);


    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event): void => {
        setLimit(parseInt(event.target.value));
    };

    const applyPagination = (sessions, page, limit) => {
        return sessions.slice(page * limit, page * limit + limit);
    };
    const applyFilters = (sessions, filter) => {
        return sessions.filter((project) => {
            let matches = true;

            if (filter === 'all') return matches;
            else if (filter) if (project.status !== filter) matches = false;

            return matches;
        });
    };

    // @ts-ignore
    useEffect(() => {
        // @ts-ignore
        const filteredfeesdata = applyFilters(datas?.fees || [], filter);
        setFilteredFees(filteredfeesdata);
        const paginatedTransaction = applyPagination(filteredfeesdata, page, limit);

        console.log(paginatedTransaction, page, limit);

        setPaginatedTransection(paginatedTransaction);
    }, [datas, filter, page])

    const [sections, setSections] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        if (selectedSection && academicYear) {
            axios
                .get(
                    `/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection.id}&school_id=${user?.school_id}`
                )
                .then((res) => {
                    console.log("students__", res.data);

                    setStudents(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [selectedSection, academicYear]);

    const handleClassSelect = (event, newValue) => {
        console.log(newValue);
        setSelectedClass(newValue);
        setSelectedStudent(null);
        setDatas([])
        if (newValue) {
            const targetClassSections = classData.find((i) => i.id == newValue.id);
            setSections(
                targetClassSections?.sections?.map((i) => {
                    return {
                        label: i.name,
                        id: i.id
                    };
                })
            );
            if (!newValue.has_section) {
                setSelectedSection({
                    label: targetClassSections?.sections[0]?.name,
                    id: targetClassSections?.sections[0]?.id
                });
            } else {
                setSelectedSection(null);
            }
        }
    };

    return (
        <>
            <Head>
                <title>Payment history</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Payment history'} />
            </PageTitleWrapper>

            <Card sx={{ display: 'grid', maxWidth: 900, mx: 'auto', p: 1, gridTemplateColumns: { sm: 'auto auto auto' }, gap: 1 }}>
                <Grid item >
                    <Autocomplete
                        id="tags-outlined"
                        options={classData?.map((i) => {
                            return {
                                label: i.name,
                                id: i.id,
                                has_section: i.has_section
                            };
                        }) || []}
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

                {selectedClass && sections && selectedClass.has_section && (

                    <Grid item >
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
                                setSelectedSection(v);
                                setDatas([])
                                setSelectedStudent(null);
                            }}
                        />
                    </Grid>

                )}

                {selectedClass && selectedSection && (<>

                    <Grid item >
                        <Autocomplete
                            fullWidth
                            disablePortal
                            value={selectedStudent}
                            options={students}
                            isOptionEqualToValue={(option: any, value: any) =>
                                option.id === value.id
                            }
                            getOptionLabel={(option) => `${option.class_roll_no}  (${option.student_info.first_name})`}
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    {...params}
                                    label="Select Student by roll"
                                />
                            )}
                            // @ts-ignore
                            onChange={(e, value: any) => setSelectedStudent(value)}
                        />
                    </Grid>


                </>)}
            </Card>

            <Grid sx={{ mt: 1, px: 1 }} container item>
                <Card sx={{ width: '100%' }}>
                    <Grid item
                        sx={{
                            // maxHeight: 'calc(1080vh - 450px) !important',
                            minHeight: 'calc(108vh - 450px) !important',
                            overflow: 'auto',
                        }}
                        justifyContent={'flex-end'}>

                        {
                            selectedClass && selectedSection && selectedStudent &&
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                pt: 2,
                                pl: 1
                            }}>
                                <Grid item sx={{
                                    display: 'flex',
                                    gap: 1,
                                    maxHeight: 40
                                }}>
                                    <FormControl  >
                                        <InputLabel size='small' sx={{ backgroundColor: 'white' }} id="demo-simple-select-label">Filter By</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size="small"
                                            label="Filter By"

                                            sx={{
                                                [`& fieldset`]: {
                                                    borderRadius: 0.6
                                                },
                                                px: '10px',
                                                minWidth: '50px'
                                            }}

                                            value={filter}
                                            onChange={(e: any) => {
                                                setFilter(e.target.value);
                                            }}
                                        >
                                            <MenuItem value={'all'}>ALL</MenuItem>
                                            <MenuItem value={'paid'}>PAID</MenuItem>
                                            <MenuItem value={'paid late'}>PAID LATE</MenuItem>
                                            <MenuItem value={'partial paid'}>PARTIAL PAID</MenuItem>
                                            <MenuItem value={'unpaid'}>UNPAID</MenuItem>
                                        </Select>

                                    </FormControl>

                                    <ReactToPrint
                                        content={() => printPageRef.current}
                                        // pageStyle={`{ size: 2.5in 4in }`}
                                        trigger={() => (
                                            <Button
                                                startIcon={<LocalPrintshopIcon />}
                                                variant="contained">
                                                print
                                            </Button>
                                        )}
                                    />
                                </Grid>

                                <TableHeadWrapper
                                    title={'Transaction'}
                                    total={paginatedTransection.length}
                                    count={filteredFees.length}
                                    rowsPerPage={limit}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleLimitChange}
                                />
                            </Box>
                        }
                        <Divider />
                        {
                            paginatedTransection.length !== 0 && <>
                                <TableContainer  >
                                    <Table >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('Fee Title')}</TableCell>
                                                <TableCell>{t('Fee Amount')}</TableCell>
                                                <TableCell>{t('Paid Amount')}</TableCell>
                                                <TableCell>{t('Due')}</TableCell>
                                                <TableCell>{t('Status')}</TableCell>
                                                <TableCell>{t('Fine')}</TableCell>
                                                <TableCell>{t('Last date')}</TableCell>
                                                <TableCell>{t('Last payment date')}</TableCell>
                                                <TableCell>{t('Collected by ')}</TableCell>
                                                <TableCell>{t('Total payable amount')}</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {paginatedTransection?.map((fee) => {
                                                const last_date = dayjs(fee.last_date).valueOf()
                                                const today = fee.last_payment_date ? dayjs(fee.last_payment_date).valueOf() : 0;
                                                const changeColor = today > last_date ? {
                                                  color: 'red'
                                                } : {}
                                                 
                                                let due;
                                                if (fee?.status == 'paid' || fee?.status === 'paid late') {
                                                  due = 0
                                                }
                                                else {
                                                  due = (fee?.amount + (fee.late_fee ? fee.late_fee : 0) - (fee.paidAmount ? fee.paidAmount : ((fee?.status == 'unpaid') ? 0 : fee?.amount)))
                                                  if (today < last_date) {
                                                    due -= (fee.late_fee ? fee.late_fee : 0)
                                                  }
                                                }
                                                const status_color = { p: 0.5 };
                                                if (fee?.status === 'paid' || fee?.status === 'paid late') {
                                                  status_color['color'] = 'green'
                                                }
                                                else if (fee?.status === 'partial paid') {
                                                  status_color['color'] = 'blue'
                                                }
                                                else {
                                                  status_color['color'] = 'red'
                                                }
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={fee.id}
                                                    >

                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {fee?.title}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {fee?.amount.toFixed(1)}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {fee?.paidAmount?.toFixed(1)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {due?.toFixed(1)}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={status_color}
                                                        >
                                                            <Typography noWrap variant="h5">
                                                                {/* @ts-ignore */}
                                                                {fee?.status.toUpperCase()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {fee?.late_fee?.toFixed(1)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {dayjs(fee?.last_date).format(
                                                                    'MMMM D, YYYY h:mm A'
                                                                )}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {
                                                                    fee?.status !== 'unpaid' ? dayjs(fee?.last_payment_date).format(
                                                                        'MMMM D, YYYY h:mm A'
                                                                    ) : ''}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography noWrap variant="h5">
                                                                {fee?.collected_by_user}
                                                            </Typography>
                                                        </TableCell>


                                                        <TableCell>
                                                            <Typography noWrap variant="h5" sx={changeColor}>
                                                                {(today <= last_date || fee?.status === 'paid late') ? "" : `${Number(fee?.amount).toFixed(1)} + ${Number(fee?.late_fee).toFixed(1)} = ${(fee?.amount + fee?.late_fee).toFixed(1)}`}
                                                            </Typography>
                                                        </TableCell>

                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        }
                    </Grid>
                </Card>


            </Grid>
            <Grid sx={{
                display: 'none',
            }} >
                <Grid ref={printPageRef} sx={{
                    p: 1,
                }}>
                    <Grid sx={{
                        textAlign: 'center',
                        paddingBottom: 1
                    }}>
                        <h1>Name : {[datas?.first_name, datas?.middle_name, datas?.last_name].join(' ')}</h1>
                        <h2>Class roll : {datas?.class_roll_no}</h2>
                        <h2>Class registration no : {datas?.class_registration_no}</h2>
                        {/* <h2>Discount : {datas?.discount}</h2> */}

                    </Grid>
                    <Grid sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={tableStyle}>{t('Fee Title')}</th>
                                    <th style={tableStyle}>{t('Fee Amount')}</th>
                                    <th style={tableStyle}>{t('Paid Amount')}</th>
                                    <th style={tableStyle}>{t('Status')}</th>
                                    <th style={tableStyle}>{t('Fine')}</th>
                                    <th style={tableStyle}>{t('Last date')}</th>
                                    <th style={tableStyle}>{t('Due')}</th>
                                    <th style={tableStyle}>{t('Last payment date')}</th>
                                    <th style={tableStyle}>{t('Collected by')}</th>
                                    <th style={tableStyle}>{t('Total payable amount')}</th>
                                </tr>
                            </thead>
                            <tbody style={{
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }}>
                                {filteredFees?.map((project) => {

                                    const last_date = dayjs(project.last_date).valueOf()
                                    const today = dayjs(project.last_payment_date).valueOf();
                                    const changeColor = today > last_date ? {
                                        color: 'red'
                                    } : {}

                                    let due = project?.amount;


                                    if (today > last_date) {
                                        console.log(project?.title, dayjs(project?.last_payment_date).format(
                                            'MMMM D, YYYY h:mm A'
                                        ), "         ", dayjs(project.last_payment_date).format(
                                            'MMMM D, YYYY h:mm A'
                                        ), " late!!!!!!!!!!");

                                        due += (project.late_fee ? project.late_fee : 0);

                                        if (project.paidAmount) {
                                            due -= project.paidAmount
                                        }

                                    }
                                    else {
                                        if (project.paidAmount) {
                                            due -= project.paidAmount
                                        }
                                    }
                                    if (project?.status == 'paid' || project?.status === 'paid late') {
                                        due = 0;
                                    }

                                    return (
                                        <tr>
                                            <td style={tableStyle}>{project?.title}</td>
                                            <td style={tableStyle}>{project?.amount.toFixed(1)}</td>
                                            <td style={tableStyle}>{project?.paidAmount?.toFixed(1)}</td>
                                            <td style={{
                                                ...tableStyle,
                                                color: (project?.status === 'paid' || project?.status === 'paid late')
                                                    ? 'green'
                                                    :
                                                    project?.status === 'partial paid'
                                                        ? 'blue'
                                                        : 'red'
                                            }}

                                            >
                                                {project?.status.toUpperCase()}

                                            </td>
                                            <td style={tableStyle}>{project?.late_fee?.toFixed(1)}</td>
                                            <td style={tableStyle}>{dayjs(project?.last_date).format('MMMM D, YYYY h:mm A')}</td>
                                            <td style={tableStyle}>{due?.toFixed(1)}</td>
                                            <td style={tableStyle}>

                                                {
                                                    project?.status !== 'unpaid' ? dayjs(project?.last_payment_date).format(
                                                        'MMMM D, YYYY h:mm A'
                                                    ) : ''}

                                            </td>
                                            <td style={tableStyle}>{project?.collected_by_user}</td>
                                            <td style={{ ...tableStyle, ...changeColor }}>

                                                {(today <= last_date || project?.status === 'paid late') ? "" : `${Number(project?.amount).toFixed(1)} + ${Number(project?.late_fee).toFixed(1)} = ${(project?.amount + project?.late_fee).toFixed(1)}`}

                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Grid>

                </Grid>

            </Grid >
            <Footer />

        </>
    );
}




FeesPaymentReport.getLayout = (page) => (
    <Authenticated name="report">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default FeesPaymentReport;
