import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Autocomplete, Box, Button, Card, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import dayjs from 'dayjs';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { MobileDatePicker } from '@mui/lab';
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

    const printPageRef = useRef();

    const { showNotification } = useNotistick();

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [filter, setFilter] = useState<string>('all');
    const [paginatedTransection, setPaginatedTransection] = useState<any>([]);



    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [payment_method, setPayment_method] = useState(null);

    const handlePageChange = (_event: any, newPage: number): void => {

        setPage(newPage);
    };

    const handleLimitChange = (event): void => {
        setLimit(parseInt(event.target.value));
    };

    const applyPagination = (sessions, page, limit) => {
        return sessions.slice(page * limit, page * limit + limit);
    };

    useEffect(() => {
        // @ts-ignore

        const paginatedTransaction = applyPagination(datas.data || [], page, limit);

        console.log(paginatedTransaction, page, limit);

        setPaginatedTransection(paginatedTransaction);
    }, [datas, filter, page])

    useEffect(() => {
        getData(dayjs().startOf('date'),dayjs().endOf('date'),'All')
    }, [])

    const getData = (startDate,endDate,payment_method) => {
        const tempToDate = new Date(endDate)
        tempToDate.setDate(tempToDate.getDate() + 1)
        axios.get(`/api/reports/student_payment_collection_history?from_date=${startDate}&to_date=${dayjs(tempToDate).format('YYYY-MM-DD')}${payment_method == 'All' ? '' : `&payment_method=${payment_method}`}`)
            .then(res => {
                let sumTotal = 0, SumCollectedAmount = 0
                for (const c of res.data) {
                    sumTotal += (c?.collected_amount - c?.student?.discount)
                    SumCollectedAmount += c?.collected_amount
                }
                setDatas({
                    sumTotal: sumTotal?.toFixed(2),
                    SumCollectedAmount: SumCollectedAmount?.toFixed(2),
                    data: res.data
                })
            }).catch(err => console.log(err))
    }
    const handlePaymentHistoryFind = (e) => {
        e.preventDefault();
        if (startDate && endDate && payment_method) {
            getData(startDate,endDate,payment_method)
        }

    }

    const bulkAction = datas?.data?.length;


    return (
        <>
            <Head>
                <title>Recipt report</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Recipt report'} />
            </PageTitleWrapper>


            <form onSubmit={handlePaymentHistoryFind}>
                <Card sx={{
                    display: 'grid', maxWidth: 900, mx: 'auto', p: 1, gridTemplateColumns: { sm: 'auto auto auto auto auto' }, gap: 1
                }}>
                    <Grid item >
                        <Autocomplete
                            id="tags-outlined"
                            options={['All', 'Cash', 'Bkash', 'Nagad', 'Rocket', 'Upay', 'Trustpay', 'UCash', 'Card']}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    {...params}
                                    label={t('Payment Via')}
                                    placeholder="Select Payment Via"
                                    required
                                />
                            )}
                            onChange={(e, v) => {
                                setPayment_method(v)
                            }}
                        />
                    </Grid>
                    <Grid item >
                        <MobileDatePicker
                            label="Select start Date"
                            inputFormat='dd/MM/yyyy'
                            value={startDate}

                            onChange={(newValue) => {

                                setStartDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : null);
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} required />}
                        />
                    </Grid>


                    <Grid item >
                        <MobileDatePicker
                            label="Select end Date"
                            inputFormat='dd/MM/yyyy'
                            value={endDate}

                            onChange={(newValue) => {


                                setEndDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : null);
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} required />}
                        />
                    </Grid>
                    <Grid item>
                        <Button type='submit' variant='contained'>Search</Button>
                    </Grid>
                    {
                        datas?.data && <Grid item>
                            <ReactToPrint
                                content={() => printPageRef.current}
                                // pageStyle={`{ size: 2.5in 4in }`}
                                pageStyle={`@page { size: A4; } .printable-item { page-break-after: always; }`}
                                trigger={() => (
                                    <Button
                                        startIcon={<LocalPrintshopIcon />}
                                        variant="contained">
                                        print
                                    </Button>
                                )}
                            />
                        </Grid>
                    }

                </Card>
            </form>


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
                            bulkAction && <Box
                                p={2}
                                display="flex"
                                alignItems="center"
                                justifyContent='space-between'
                            >

                                <Box>
                                    <Typography component="span" variant="subtitle1">
                                        {t('Showing')}:
                                    </Typography>{' '}
                                    <b>{paginatedTransection.length}</b> <b>{t('transections')}</b>
                                </Box>
                                <TablePagination
                                    component="div"
                                    count={bulkAction}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleLimitChange}
                                    page={page}
                                    rowsPerPage={limit}
                                    rowsPerPageOptions={[5, 10, 15]}
                                />
                            </Box>
                        }


                        <Divider />
                        {
                            paginatedTransection.length === 0 ? (
                                <>
                                    <Typography
                                        sx={{
                                            py: 10,
                                            px: 4
                                        }}
                                        variant="h3"
                                        fontWeight="normal"
                                        color="text.secondary"
                                        align="center"
                                    >
                                        {t(
                                            "We couldn't find any transection matching your search criteria"
                                        )}
                                    </Typography>
                                </>
                            ) : (<>
                                <TableContainer  >
                                    <Table >
                                        <TableHead>
                                            <TableRow>

                                                <TableCell>{t('Invoice no')}</TableCell>
                                                <TableCell>{t('Student')}</TableCell>
                                                <TableCell>{t('Registration no')}</TableCell>
                                                <TableCell>{t('Class roll')}</TableCell>
                                                <TableCell>{t('Transaction Date')}</TableCell>
                                                <TableCell>{t('Class')}</TableCell>
                                                <TableCell>{t('Collected by')}</TableCell>
                                                <TableCell>{t('Payment via')}</TableCell>
                                                <TableCell>{t('Fee title')}</TableCell>
                                                <TableCell>{t('Collected amount')}</TableCell>
                                                <TableCell>{t('Discount')}</TableCell>

                                                <TableCell>{t('Total')}</TableCell>


                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {
                                                paginatedTransection?.map((i) => {

                                                    let name = i?.student?.student_info?.first_name;
                                                    if (i?.student?.student_info?.middle_name) {
                                                        name += i?.student?.student_info?.middle_name
                                                    }
                                                    if (i?.student?.student_info?.last_name) {
                                                        name += i?.student?.student_info?.last_name
                                                    }
                                                    const total = i?.collected_amount - i?.student?.discount

                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={i?.id}
                                                        >
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.id}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {name}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.student?.class_registration_no}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.student?.class_roll_no}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {dayjs(i?.created_at).format(
                                                                        'MMMM D, YYYY h:mm A'
                                                                    )}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.student?.section?.class?.name}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.collected_by_user?.username}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.payment_method}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.fee?.title}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.collected_amount}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.student?.discount?.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {total?.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>





                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow >
                                                <TableCell colSpan={8}></TableCell>
                                                <TableCell>{t('Total Collected amount')}</TableCell>
                                                <TableCell>{datas?.SumCollectedAmount}</TableCell>
                                                <TableCell>{t('Total')}</TableCell>
                                                <TableCell>{datas?.sumTotal}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </>)
                        }
                    </Grid>
                </Card>


            </Grid>
            <Grid sx={{
                display: 'none',
            }} >
                <Grid ref={printPageRef} sx={{
                    p: 2
                }}>
                    <Grid sx={{
                        textAlign: 'center',
                        paddingBottom: 1
                    }}>

                        <h1 style={{
                            fontSize:'25px'
                        }}>Recipt Report</h1>


                    </Grid>
                    <table>
                        <thead>
                            <tr>
                                <th style={tableStyle}>{t('Invoice no')}</th>
                                <th style={tableStyle}>{t('Student')}</th>
                                <th style={tableStyle}>{t('Registration no')}</th>
                                <th style={tableStyle}>{t('Class roll')}</th>
                                <th style={tableStyle}>{t('Transaction Date')}</th>
                                <th style={tableStyle}>{t('Class')}</th>
                                <th style={tableStyle}>{t('Collected by')}</th>
                                <th style={tableStyle}>{t('Payment via')}</th>
                                <th style={tableStyle}>{t('Fee title')}</th>
                                <th style={tableStyle}>{t('Collected amount')}</th>
                                <th style={tableStyle}>{t('Discount')}</th>
                                <th style={tableStyle}>{t('Total')}</th>
                            </tr>
                        </thead>
                        <tbody style={{
                            overflowX: 'auto',
                            overflowY: 'auto'
                        }}>
                            {datas.data?.map((i) => {

                                let name = i?.student?.student_info?.first_name;
                                if (i?.student?.student_info?.middle_name) {
                                    name += i?.student?.student_info?.middle_name
                                }
                                if (i?.student?.student_info?.last_name) {
                                    name += i?.student?.student_info?.last_name
                                }
                                const total = i?.collected_amount - i?.student?.discount

                                return (
                                    <tr>
                                        <td style={tableStyle}>{i?.id}</td>
                                        <td style={tableStyle}>{name}</td>
                                        <td style={tableStyle}>{i?.student?.class_registration_no}</td>
                                        <td style={tableStyle}>{i?.student?.class_roll_no}</td>
                                        <td style={tableStyle}>{dayjs(i?.created_at).format('MMMM D, YYYY h:mm A')}</td>
                                        <td style={tableStyle}>{i?.student?.section?.class?.name}</td>
                                        <td style={tableStyle}>{i?.collected_by_user?.username}</td>
                                        <td style={tableStyle}>{i?.payment_method}</td>
                                        <td style={tableStyle}>{i?.fee?.title}</td>
                                        <td style={tableStyle}>{i?.collected_amount}</td>
                                        <td style={tableStyle}>{i?.student?.discount?.toFixed(2)}</td>
                                        <td style={tableStyle}>{total?.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td style={tableStyle} colSpan={8}></td>
                                <td style={tableStyle}>{t('Total Collected amount')}</td>
                                <td style={tableStyle}>{datas?.SumCollectedAmount}</td>
                                <td style={tableStyle}>{t('Total')}</td>
                                <td style={tableStyle}>{datas?.sumTotal}</td>
                            </tr>
                        </tbody>

                    </table>

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
