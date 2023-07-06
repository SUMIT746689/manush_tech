import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Results from '@/content/Reports/FinancialReports/AccountStatement/Results';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid, TableCell, TableFooter, TableRow, Typography } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import { DropDownSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import dayjs from 'dayjs';
import { fetchData } from '@/utils/post';

const ExpenseReport = () => {
  const [expenseReportDatas, setExpenseReportDatas] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [totalAmount, setTotalAmount] = useState(null);
  const handleSearchClick = async () => {
    let url = `/api/reports/financial_reports/expense_report?from_date=${startDate}&to_date=${endDate}`;

    const [err, res] = await fetchData(url, 'get', {})
    setTotalAmount(res?.success ? res.totalAmount._sum.amount : null)
    const data = res?.success ? res.data.map(tran => ({
      id: tran.id,
      'account name': tran.payment_method,
      'voucher head': tran.voucher.title,
      'description': tran.voucher.description,
      'ref no': tran.voucher.reference,
      'pay via': tran.payment_method,
      date: dayjs(tran.created_at).format('DD-MM-YYYY'),
      'Amount(Dr.)': tran.voucher.type === 'debit' ? tran.amount : 0
    }))
      :
      [];

    setExpenseReportDatas(() => data)
  }

  return (
    <>
      <Head>
        <title>Expense Report</title>
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
            title="expense report datas"
            datas={expenseReportDatas}
            tableFooter={
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      Grand Total
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 0.6 }}>
                    <Typography noWrap variant="h5">
                      {totalAmount}
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

ExpenseReport.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ExpenseReport;
