import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Autocomplete, Box, Button, Card, Dialog, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import dayjs from 'dayjs';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { MobileDatePicker } from '@mui/lab';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';
const tableStyle: object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    textAlign: 'center',
    padding: '2px',
    fontSize: '0.8em'
    // backgroundColor: '#cccccc'
};

export async function getServerSideProps(context: any) {
    let schoolList: any = [];
    try {

        const refresh_token: any = serverSideAuthentication(context);
        if (!refresh_token) return { redirect: { destination: '/login' } };
        const schools = await prisma.school.findMany({
            select: {
                id: true,
                name: true
            }
        })

        schoolList = schools.map(i => ({
            label: i.name,
            id: i.id
        }))

    } catch (err) {
        console.log(err)
    }
    const parseJson = JSON.parse(JSON.stringify(schoolList));

    return { props: { schoolList: parseJson } }
}
function FeesPaymentReport({ schoolList }) {
console.log({schoolList});

    const { t }: { t: any } = useTranslation();
    const [datas, setDatas] = useState<any>([]);

    const printPageRef = useRef();

    const { showNotification } = useNotistick();

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [filter, setFilter] = useState<string>('all');
    const [paginatedTransection, setPaginatedTransection] = useState<any>([]);



    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [open, setOpen] = useState(false);
    const selectedInvoiceRef = useRef()

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

        const paginatedTransaction = applyPagination(datas?.data || [], page, limit);

        console.log(paginatedTransaction, page, limit);

        setPaginatedTransection(paginatedTransaction);
    }, [datas, filter, page])

 


    const getData = (startDate, endDate) => {
        const tempToDate = new Date(endDate)
        tempToDate.setDate(tempToDate.getDate() + 1)
        axios.get(`/api/package_payment_history?from_date=${dayjs(startDate).format('YYYY-MM-DD')}&to_date=${dayjs(tempToDate).format('YYYY-MM-DD')}${selectedSchool ? `&school_id=${selectedSchool?.id}` : ''}`)
            .then(res => {

                let SumCollectedAmount = 0
                for (const c of res.data) {
                    // sumTotal += (c?.collected_amount - c?.student?.discount)
                    // sumTotal += (c?.collected_amount )
                    SumCollectedAmount += c?.amount
                }
                setDatas({
                    // sumTotal: sumTotal?.toFixed(2),
                    SumCollectedAmount: SumCollectedAmount?.toFixed(2),
                    data: res.data
                })
            }).catch(err => console.log(err))
    }
    const handlePaymentHistoryFind = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            getData(startDate, endDate)
        }

    }

    const bulkAction = datas?.data?.length;

    const handleCreateClassOpen = () => {
        setOpen(true);
    };
    const handleCreateClassClose = () => {
        setOpen(false);
    };
 

    return (
        <>
            <Head>
                <title>Package payment history</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Package payment history'} />
            </PageTitleWrapper>


            <form onSubmit={handlePaymentHistoryFind}>
                <Card sx={{
                    display: 'grid', mx: 'auto', p: 1, px: 4, gridTemplateColumns: { sm: 'auto', md: '1fr 2fr 0.5fr' }, gap: 1
                }}>
                    <Grid item >
                        <AutoCompleteWrapper
                            minWidth="100%"
                            label={t('Select school')}
                            placeholder={t('School...')}
                            limitTags={2}
                            // getOptionLabel={(option) => option.id}
                            options={schoolList || []}
                            value={undefined}
                            handleChange={(e, v) => setSelectedSchool(v ? v : null)}
                        />
                    </Grid>
                    <Grid item>
                        <DateRangePickerWrapper
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />
                    </Grid>
                    <Grid item>
                        <ButtonWrapper disabled={startDate && !endDate ? true : false} type='submit' handleClick={null}>
                            Search
                        </ButtonWrapper>

                    </Grid>

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

                        <Box
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
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>

                                                <TableCell>{t('school')}</TableCell>
                                                <TableCell>{t('pay via')}</TableCell>
                                                <TableCell>{t('Amount')}</TableCell>
                                                <TableCell>{t('trxID')}</TableCell>
                                                <TableCell>{t('customerMsisdn')}</TableCell>
                                                <TableCell>{t('merchantInvoiceNumber')}</TableCell>
                                                <TableCell>{t('paymentID')}</TableCell>
                                                <TableCell>{t('paymentExecuteTime')}</TableCell>
                                                
                                               


                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {
                                                paginatedTransection?.map((i) => {
                                                    console.log({ i });

                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={i?.id}
                                                        >
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.school?.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.pay_via}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.amount}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.trxID}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.customerMsisdn}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.merchantInvoiceNumber}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {i?.paymentID}
                                                                </Typography>
                                                            </TableCell>
                                                            

                                                            
                                                            <TableCell>
                                                                <Typography noWrap variant="h5">
                                                                    {dayjs(i?.paymentExecuteTime).format(
                                                                        'MMM D, YYYY h:mm A'
                                                                    )}
                                                                </Typography>
                                                            </TableCell>

                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow >
                                                <TableCell colSpan={1}></TableCell>
                                                <TableCell>{t('Total Collected amount')}</TableCell>
                                                <TableCell>{datas?.SumCollectedAmount}</TableCell>
                                                {/* <TableCell>{t('Total')}</TableCell> */}
                                                {/* <TableCell>{datas?.sumTotal}</TableCell> */}
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </>)
                        }
                    </Grid>
                </Card>


            </Grid>
            

            <Footer />

        </>
    );
}




FeesPaymentReport.getLayout = (page) => (
    <Authenticated name="package_payment_history">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default FeesPaymentReport;
