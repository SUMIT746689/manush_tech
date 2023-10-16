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
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import CsvExport from '@/components/Export/Csv';
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
    const [classData, setClassData] = useState<any>([]);
    const [classOptions, setClassOptions] = useState<any>([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null)

    const printPageRef = useRef();

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [filter, setFilter] = useState<string>('all');
    const [paginatedTransection, setPaginatedTransection] = useState<any>([]);

    const { user } = useAuth();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

    const export_data = () => {

        const customize_data = filteredFees.map((fee, index) => ({
            SL: index + 1,
            'Fee Title': fee?.title,
            'Fee Amount': fee?.amount.toFixed(1),
            'Paid Amount': fee?.paidAmount?.toFixed(1),
            'Status': fee?.status.toUpperCase(),
            'Fine': fee?.late_fee?.toFixed(1),
            'Last date': dayjs(fee?.last_date).format(
                'MMMM D, YYYY h:mm A'
            ),
            'Due': fee?.due?.toFixed(1),
            'Last payment date': fee?.status !== 'unpaid' ? dayjs(fee?.last_payment_date).format(
                'MMMM D, YYYY h:mm A'
            ) : '',
            'Collected by': fee?.collected_by_user,
            'Total payable amount': (fee?.today <= fee?.last_date || fee?.status === 'paid late') ? "" : `${Number(fee?.amount).toFixed(1)} + ${Number(fee?.late_fee).toFixed(1)} = ${(fee?.amount + fee?.late_fee).toFixed(1)}`,
        }));
        return customize_data;
    }
    useEffect(() => {
        axios.get('/api/class').then(res => {
            setClassData(res.data)
            setClassOptions(res.data?.map((i) => {
                return {
                    label: i.name,
                    id: i.id,
                    has_section: i.has_section
                };
            }))
        })
    }, [])

    const Find = () => {
        if (selectedStudent) {
            console.log(fromDate, ' ', toDate);

            axios
                // @ts-ignore
                .get(`/api/student_payment_collect/${selectedStudent.id}?academic_year_id=${academicYear?.id}&${fromDate ? `fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
                .then((res) => {
                    console.log("re_____", res.data);

                    if (res.data?.success) setDatas(res.data.data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }

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

    useEffect(() => {
        // @ts-ignore
        const filteredfeesdata = applyFilters(datas?.fees || [], filter);
        setFilteredFees(filteredfeesdata);
        const paginatedTransaction = applyPagination(filteredfeesdata, page, limit);

        const customizedData = paginatedTransaction.map(fee => {

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
            fee['due'] = due
            fee['status_color'] = status_color
            fee['changeColor'] = changeColor
            fee['today'] = today
            fee['last_date'] = last_date
            return fee
        })

        setPaginatedTransection(customizedData);
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

            <Card sx={{ display: 'grid', maxWidth: 1000, mx: 'auto', pt: 1, px: 1, gridTemplateColumns: { sm: '1.5fr 1.5fr 2fr 2.5fr 1fr' }, gap: 1 }}>
                <Grid item >

                    <AutoCompleteWrapper
                        minWidth="100%"
                        label={t('Select class')}
                        placeholder={t('Class...')}
                        limitTags={2}
                        options={classOptions}
                        value={selectedClass}
                        handleChange={handleClassSelect}
                    />
                </Grid>

                {selectedClass && sections && selectedClass.has_section && (

                    <Grid item >
                        <AutoCompleteWrapper
                            minWidth="100%"
                            label={t('Select section')}
                            placeholder={t('Section...')}
                            limitTags={2}
                            options={sections}
                            value={selectedSection}
                            handleChange={(e, v) => {
                                setSelectedSection(v);
                                setDatas([])
                                setSelectedStudent(null);
                            }}
                        />

                    </Grid>

                )}

                {selectedClass && selectedSection && (<>

                    <Grid item >
                        <AutoCompleteWrapper
                            minWidth="100%"
                            label={t('Select Student by roll')}
                            placeholder={t('Roll and name...')}
                            limitTags={2}
                            options={students}
                            value={selectedStudent}
                            isOptionEqualToValue={(option: any, value: any) =>
                                option.id === value.id
                            }
                            getOptionLabel={(option) => `${option.class_roll_no}  (${option.student_info.first_name})`}
                            handleChange={(e, value: any) => setSelectedStudent(value)}
                        />
                    </Grid>
                    <Grid item >
                        <DateRangePickerWrapper
                            startDate={fromDate}
                            setStartDate={setFromDate}
                            endDate={toDate}
                            setEndDate={setToDate}
                        />
                    </Grid>
                    <Grid item>
                        <ButtonWrapper handleClick={Find}>Find</ButtonWrapper>
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
                                    maxHeight: 30
                                }}>
                                    <FormControl sx={{ minWidth: '180px' }}>
                                        <InputLabel size='normal' sx={{ backgroundColor: 'white' }} id="demo-simple-select-label">Filter By</InputLabel>
                                        <Select
                                            fullWidth
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
                                            <ButtonWrapper handleClick={null} startIcon={<LocalPrintshopIcon />}>
                                                print
                                            </ButtonWrapper>
                                        )}
                                    />
                                    <Grid item>
                                        <ButtonWrapper handleClick={null} variant='outlined'>
                                            <CsvExport exportData={export_data()} />
                                        </ButtonWrapper>
                                    </Grid>

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
                                                            {fee?.due?.toFixed(1)}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell
                                                        sx={fee?.status_color}
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
                                                        <Typography noWrap variant="h5" sx={fee?.changeColor}>
                                                            {(fee?.today <= fee?.last_date || fee?.status === 'paid late') ? "" : `${Number(fee?.amount).toFixed(1)} + ${Number(fee?.late_fee).toFixed(1)} = ${(fee?.amount + fee?.late_fee).toFixed(1)}`}
                                                        </Typography>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
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
                                            <td style={tableStyle}>{project?.due?.toFixed(1)}</td>
                                            <td style={tableStyle}>

                                                {
                                                    project?.status !== 'unpaid' ? dayjs(project?.last_payment_date).format(
                                                        'MMMM D, YYYY h:mm A'
                                                    ) : ''}

                                            </td>
                                            <td style={tableStyle}>{project?.collected_by_user}</td>
                                            <td style={{ ...tableStyle, ...project.changeColor }}>

                                                {(project.today <= project.last_date || project?.status === 'paid late') ? "" : `${Number(project?.amount).toFixed(1)} + ${Number(project?.late_fee).toFixed(1)} = ${(project?.amount + project?.late_fee).toFixed(1)}`}

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
