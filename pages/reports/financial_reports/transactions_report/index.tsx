import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Results from '@/content/Reports/FinancialReports/AccountStatement/Results';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid, TableCell, TableFooter, TableRow, Typography } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import dayjs from 'dayjs';
import { fetchData } from '@/utils/post';

const TransactionReport = () => {
  const [transactionReportDatas, setTransactionReportDatas] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [incomTotalAmount, setIncomTotalAmount] = useState(null)
  const handleSearchClick = async () => {

    let url = `/api/reports/financial_reports/account_statement?from_date=${startDate}&to_date=${endDate}`;

    const [err, res] = await fetchData(url, 'get', {})
    setIncomTotalAmount(res?.success ? res.totalamount : null)
    const data = res?.success ? res.data.map(tran => ({
      id: tran.id,
      'account name': tran.payment_method,
      type: tran.voucher.type === 'debit' ? 'Expense' : tran.voucher.type === 'credit' ? 'Deposit' : '',
      'voucher head': tran.voucher.title,
      'ref no': tran.voucher.reference,
      'description': tran.voucher.description,
      'pay via': tran.payment_method,
      date: dayjs(tran.created_at).format('DD-MM-YYYY'),
      'dr.': tran.voucher.type === 'debit' ? tran.amount : 0,
      'cr.': tran.voucher.type === 'credit' ? tran.amount : 0,
      balance: tran.voucher.type === 'debit' ? tran.amount * -1 : tran.amount
    }))
      :
      [];
    setTransactionReportDatas(() => data)
  }

  return (
    <>
      <Head>
        <title>Transition Report</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          gap={2}
          px={1}
        >

          <Card sx={{ maxWidth: 600, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr auto' }, gap: { sm: 1 } }}>

            <Grid >
              <DateRangePickerWrapper startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </Grid>
            <Grid item container justifyContent={"flex-end"} >
              <ButtonWrapper handleClick={handleSearchClick}>Search</ButtonWrapper>
            </Grid>
          </Card>

          <Results
            title="transition report datas"
            datas={transactionReportDatas}
            tableFooter={
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      Grand Total
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      {incomTotalAmount?.debit}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      {incomTotalAmount?.credit}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      {incomTotalAmount?.credit - incomTotalAmount?.debit}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>}
          />
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

TransactionReport.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default TransactionReport;
