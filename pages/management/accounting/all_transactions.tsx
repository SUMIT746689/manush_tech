import { useEffect, useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Voucher/Deposit/PageHeader';
import Footer from 'src/components/Footer';
import { Grid, Typography } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Voucher/Transaction/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import { useTranslation } from 'next-i18next';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import axios from 'axios';

function ManagementClasses() {
  const { t }: { t: any } = useTranslation();

  const [transaction, setTransaction] = useState([])

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  const getData = (startDate, endDate) => {
    axios.get(`/api/transaction?fromDate=${startDate}&toDate=${endDate}`)
      .then(res => setTransaction(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getData(new Date(), new Date())
  }, [])
  
  useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      getData(startDate, endDate)
    }
  }, [startDate, endDate])

  return (
    <>
      <Head>
        <title>All transactions</title>
      </Head>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom textTransform="capitalize">
              {t('All transactions')}
            </Typography>
            <Typography variant="subtitle2" textTransform={"initial"}>
              {t(`All aspects of all transactions can be managed from this page`)}
            </Typography>
          </Grid>
          <Grid item>
            <DateRangePickerWrapper
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results users={transaction} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="class">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
