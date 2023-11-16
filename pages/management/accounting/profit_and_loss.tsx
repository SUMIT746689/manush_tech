import { useEffect, useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Voucher/Deposit/PageHeader';
import Footer from 'src/components/Footer';
import { Box, Card, Grid, Typography, useTheme } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Voucher/Transaction/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import { useTranslation } from 'next-i18next';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import axios from 'axios';

function ManagementClasses() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [transaction, setTransaction] = useState(null)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  const getData = (startDate, endDate) => {
    axios.get(`/api/transaction/profit_and_loss?fromDate=${startDate}&toDate=${endDate}`)
      .then(res => {
        console.log(res.data);
        setTransaction(res.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getData(new Date(), new Date())
  }, [])

  useEffect(() => {
    if (startDate && endDate) getData(startDate, endDate)
    else if (!startDate && !endDate) getData(new Date(), new Date())
  }, [startDate, endDate])

  return (
    <>
      <Head>
        <title>Profit & Loss</title>
      </Head>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom textTransform="capitalize">
              {t('Profit & Loss')}
            </Typography>
            <Typography variant="subtitle2" textTransform={"initial"}>
              {t(`All aspects of profit & loss can be managed from this page`)}
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
      <Grid sx={{ minHeight: 'calc(100vh - 303px) !important' }}>

        <Grid
          sx={{ p: 4 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                px: 3,
                py: 2
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{
                    ml: 1.5,
                    fontSize: `${theme.typography.pxToRem(15)}`,
                    fontWeight: 'bold'
                  }}
                  variant="subtitle2"
                  component="div"
                >
                  {t(`Total Deposit`)}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  ml: -2,
                  pt: 2,
                  pb: 1.5,
                  justifyContent: 'center'
                }}
              >

                <Typography
                  sx={{
                    pl: 1,
                    fontSize: `${theme.typography.pxToRem(35)}`
                  }}
                  variant="h1"
                >
                  {transaction?.total_deposit}
                </Typography>
              </Box>

            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                px: 3,
                py: 2
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{
                    ml: 1.5,
                    fontSize: `${theme.typography.pxToRem(15)}`,
                    fontWeight: 'bold'
                  }}
                  variant="subtitle2"
                  component="div"
                >
                  {t(`Total Expense`)}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  ml: -2,
                  pt: 2,
                  pb: 1.5,
                  justifyContent: 'center'
                }}
              >

                <Typography
                  sx={{
                    pl: 1,
                    fontSize: `${theme.typography.pxToRem(35)}`
                  }}
                  variant="h1"
                >
                  {transaction?.total_expense}
                </Typography>
              </Box>

            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                px: 3,
                py: 2
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{
                    ml: 1.5,
                    fontSize: `${theme.typography.pxToRem(15)}`,
                    fontWeight: 'bold'
                  }}
                  variant="subtitle2"
                  component="div"
                >
                  {t(`Profit`)}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  ml: -2,
                  pt: 2,
                  pb: 1.5,
                  justifyContent: 'center'
                }}
              >

                <Typography
                  sx={{
                    pl: 1,
                    fontSize: `${theme.typography.pxToRem(35)}`
                  }}
                  variant="h1"
                >
                  {transaction?.total_profit}
                </Typography>
              </Box>

            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                px: 3,
                py: 2
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{
                    ml: 1.5,
                    fontSize: `${theme.typography.pxToRem(15)}`,
                    fontWeight: 'bold'
                  }}
                  variant="subtitle2"
                  component="div"
                >
                  {t(`Current Balance`)}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  ml: -2,
                  pt: 2,
                  pb: 1.5,
                  justifyContent: 'center'
                }}
              >

                <Typography
                  sx={{
                    pl: 1,
                    fontSize: `${theme.typography.pxToRem(35)}`
                  }}
                  variant="h1"
                >
                  {transaction?.totalbalance}
                </Typography>
              </Box>

            </Card>
          </Grid>


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
