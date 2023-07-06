import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Results from '@/content/Reports/FinancialReports/AccountStatement/Results';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import { DropDownSelectWrapper, DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import dayjs from 'dayjs';
import { fetchData } from '@/utils/post';

const BalanceSheet = () => {
  const [expenseReportDatas, setExpenseReportDatas] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [selectPayemt_method, setSelectPayemt_method] = useState('cash')

  const handleSearchClick = async () => {
    let url = `/api/reports/financial_reports/balance_sheet?from_date=${startDate}&to_date=${endDate}`;
    if (selectPayemt_method !== 'select all') url += `&payment_method=${selectPayemt_method}`;

    const [err, res] = await fetchData(url, 'get', {})
    const data = res?.success ? res.data.map((tran, index) => ({
      Sl: index + 1,
      'account name': selectPayemt_method,
      'total dr': tran.debit,
      'total cr': tran.credit,
      'balance': tran.debit + tran.credit
    }))
      :
      [];

    setExpenseReportDatas(() => data)
  }

  return (
    <>
      <Head>
        <title>Balance Sheet</title>
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
              <DateRangePickerWrapper startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </Grid>
            <Grid item container justifyContent={"flex-end"} >
              <ButtonWrapper handleClick={handleSearchClick}>Search</ButtonWrapper>
            </Grid>
          </Card>

          <Results
            title="balance sheet datas"
            datas={expenseReportDatas}
            tableFooter={''}
          />
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

BalanceSheet.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default BalanceSheet;
