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

const AccountStatement = () => {
  const [incomeStatementReports, setIncomeStatementReports] = useState([]);
  const [incomTotalAmount, setIncomTotalAmount] = useState(null)
  const [selectPayemt_method, setSelectPayemt_method] = useState('cash')
  const [type, setType] = useState();
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const handleSearchClick = async () => {
    let url = `/api/reports/financial_reports/account_statement?from_date=${startDate}&to_date=${endDate}`;

    if (selectPayemt_method !== 'select all') url += `&payment_method=${selectPayemt_method}`;
    if (type !== 'select all') url += `&type=${type}`;

    const [err, res] = await fetchData(url, 'get', {})
    const data = res?.success ? res.data.map(tran => ({
      id: tran.id,
      'voucher head': tran.voucher.title,
      'description': tran.voucher.description,
      'ref no': tran.voucher.reference,
      date: dayjs(tran.created_at).format('DD-MM-YYYY'),
      'dr.': tran.voucher.type === 'debit' ? tran.amount : 0,
      'cr.': tran.voucher.type === 'credit' ? tran.amount : 0,
      balance: tran.voucher.type === 'debit' ? tran.amount * (-1) : tran.amount
    })) : []
    setIncomTotalAmount(res?.success ? res.totalamount : null)
    setIncomeStatementReports(() => data)
  }

  return (
    <>
      <Head>
        <title>Financial Report</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          gap={2}
          px={1}
        >

          <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr min-content' }, gap: { sm: 1 } }}>
            <Grid>
              <DropDownSelectWrapper value={selectPayemt_method} label='Select Account' name='' handleChange={(e) => setSelectPayemt_method(e.target.value)} menuItems={['select all', 'cash', 'online']} />
            </Grid>
            <Grid >
              <DynamicDropDownSelectWrapper value={type} label='Select Type' name='' handleChange={(e) => setType(e.target.value)} menuItems={[{ value: 'select all', title: 'select all' }, { value: 'debit', title: 'Expense(Dr.)' }, { value: 'credit', title: 'Income(Cr.)' }]} />
            </Grid>
            <Grid >
              <DateRangePickerWrapper startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </Grid>
            <Grid item container justifyContent={"flex-end"} >
              <ButtonWrapper disabled={!selectPayemt_method || !type} handleClick={handleSearchClick}>Search</ButtonWrapper>
            </Grid>
          </Card>

          <Results
            title="income statement"
            datas={incomeStatementReports}
            tableFooter={
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0.6 }}>
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

AccountStatement.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default AccountStatement;
