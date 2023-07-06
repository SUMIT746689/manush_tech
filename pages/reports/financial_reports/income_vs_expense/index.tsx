import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import Results from '@/content/Reports/FinancialReports/AccountStatement/Results';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import dayjs from 'dayjs';
import { fetchData } from '@/utils/post';

const IncomeVsExpense = () => {
  const [transitionReportDatas, setTransitionReportDatas] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const handleSearchClick = async () => {

    let url = `/api/reports/financial_reports/account_statement?from_date=${startDate}&to_date=${endDate}`;

    const [err, res] = await fetchData(url, 'get', {})
    const data = res?.success ? res.data.map(tran => ({
      id: tran.id,
      'voucher head': tran.voucher.title,
      type: '',
      'dr.': tran.type === 'debit' ? tran.debit : 0,
      'cr.': tran.type === 'credit' ? tran.credit : 0,
      balance: tran.amount
    }))
      :
      [];
    setTransitionReportDatas(() => data)
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
            datas={transitionReportDatas}
          />
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

IncomeVsExpense.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default IncomeVsExpense;
