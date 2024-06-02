import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import Head from 'next/head';
import { Typography, Grid, TableFooter } from '@mui/material';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { TableBodyCellWrapper, TableFooterCellWrapper, TableHeaderCellWrapper } from '@/components/Table/Table';
import Footer from '@/components/Footer';

import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { ChangeEvent, useRef, useState } from 'react';
import useNotistick from '@/hooks/useNotistick';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { useAuth } from '@/hooks/useAuth';
import { formatNumber } from '@/utils/numberFormat';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { useClientFetch } from '@/hooks/useClientFetch';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 0, 0, 0.03)'
  },
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.10)'
  }
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0
  // }
}));

const TableContent = ({ total, reports }) => {

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
      <Table sx={{ minWidth: 650, maxWidth: 'calc(100%-10px)' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableHeaderCellWrapper>SL</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Student Id</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Name</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Class</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Group</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Section</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Roll</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Year</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Payable Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Paid Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Discount Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Due Amount</TableHeaderCellWrapper>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            reports?.map((report, index) => (
              <StyledTableRow key={report.id}>
                <TableBodyCellWrapper>
                  <Grid py={0.5}>1</Grid>{' '}
                </TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
              </StyledTableRow>
            ))
          }
        </TableBody>
        <TableFooter>
          <TableFooterCellWrapper colSpan={2} align="right"> Total</TableFooterCellWrapper>
          <TableFooterCellWrapper align="right"> {formatNumber(total)}</TableFooterCellWrapper>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

const PrintData = ({ startDate, endDate, reports, total }) => {
  const { user } = useAuth();
  const { school } = user || {};
  const { name, address } = school || {};
  return (
    <Grid mx={1}>
      <Grid textAlign="center" fontWeight={500} lineHeight={3} pt={5}>
        <Typography variant="h3" fontWeight={500}>{name}</Typography>
        <h4>{address}</h4>
        <Typography variant='h4'>Head Wise Collection Report</Typography>
        <h4>Date From: <b>{dayjs(startDate).format('DD-MM-YYYY')}</b>, Date To: <b>{dayjs(endDate).format('DD-MM-YYYY')}</b></h4>
      </Grid>

      <TableContent reports={reports} total={total} />
    </Grid>
  )
}



const HeadWiseDueReport = () => {

  const [startDate, setStartDate] = useState<any>(dayjs(Date.now()));
  const [endDate, setEndDate] = useState<any>(dayjs(Date.now()));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeesHead, setSelectedFeesHead] = useState();
  const [feesMonths, setFeesMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [reports, setReports] = useState([]);
  const { showNotification } = useNotistick();
  const [total, setTotal] = useState();
  const componentRef = useRef()
  const { muiMenuList: muiFeesHeadsLists } = useClientFetch('/api/fees_heads');
  // const { }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const startDatePickerHandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStartDate(event);
  };

  const endDatePickerHandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEndDate(event);
  };

  const handleSearch = () => {
    setIsLoading(true)

    axios.get(`/api/reports/head_wise_collections?from_date=${startDate}&to_date=${endDate}`)
      .then(({ data }) => {
        setReports(data);
        setTotal(data.reduce((prev, curr) => prev + curr.total_collected_amt, 0))
      })
      .catch(err => {
        handleShowErrMsg(err, showNotification)
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const handleFeesHeadChange = (event, value) => {
    setSelectedFeesHead(value);
    console.log({ value })
    if (!value?.id) return;
    axios.get(`/api/fees_heads/${value.id}`)
      .then(({ data }) => {
        setSelectedMonth(null)
        if (!Array.isArray(data)) return setFeesMonths([]);
        setFeesMonths(data)
      })
      .catch((err) => { console.log({ err }) })
  }

  const handleMonthChange = (event, value) => {
    setSelectedMonth(value);

  }

  const handleClsChange = () => {

  }

  return (
    <>
      {/*  print report */}
      <Grid display="none">
        <Grid ref={componentRef}>
          <PrintData startDate={startDate} endDate={endDate} reports={reports} total={total} />
        </Grid>
      </Grid>

      <Head>
        <title>Head Wise Due Report</title>
      </Head>
      <Typography variant="h4" textTransform="uppercase" py={{ md: 3, xs: 2 }} px={2}>
        Head Wise Due Report
      </Typography>

      {/* searching part code start */}
      <Grid display="grid" gridTemplateColumns="1fr" rowGap={{ xs: 1, md: 0 }} px={1} mt={1} minHeight="fit-content">
        {/* split your code start */}
        <Grid
          sx={{
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          <Grid px={1} pt="9px">
            <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', columnGap: '20px', rowGap: '0', flexWrap: 'wrap' }}>
              {/* Head field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper options={muiFeesHeadsLists} value={selectedFeesHead} label="Select Head" placeholder="Select a Head" handleChange={handleFeesHeadChange} />
              </Grid>

              {/* Month field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <DropDownSelectWrapper menuItems={feesMonths} value={selectedMonth} handleChange={handleMonthChange} label="Select Month" name='month' />
              </Grid>

              {/* Class field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper options={[]} value={''} label="Select Class" placeholder="Select a Class" handleChange={handleClsChange} />
              </Grid>

              {/* Group field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper options={[]} value={''} label="Select Group" placeholder="Select a Group" handleChange={() => { }} />
              </Grid>

              {/* Section field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper options={[]} value={''} label="Select Section" placeholder="Select a Section" handleChange={() => { }} />
              </Grid>

              {/* Search button */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1, position: 'relative', display: 'flex', gap: 1 }}>
                <Grid sx={{ flexGrow: 1 }}>
                  <SearchingButtonWrapper isLoading={isLoading} handleClick={() => { }} disabled={isLoading} children={'Search'} />
                </Grid>
                <Grid sx={{ flexGrow: 1 }}>
                  <SearchingButtonWrapper isLoading={isLoading} handleClick={handlePrint} disabled={isLoading} children={'Print'} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* split your code end */}
      </Grid>
      {/* searching part code end */}

      {/* table code part start */}

      <Grid mt={3} mb={4} px={1} sx={{ width: { xs: '100vw', md: '100%' }, minHeight: { xs: 150, md: 'calc(100dvh - 378px)' } }}>
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ minWidth: 650, maxWidth: 'calc(100%-10px)' }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableHeaderCellWrapper>SL</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Student Id</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Name</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Class</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Group</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Section</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Roll</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Year</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Payable Amount</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Paid Amount</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Discount Amount</TableHeaderCellWrapper>
                <TableHeaderCellWrapper>Due Amount</TableHeaderCellWrapper>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <TableBodyCellWrapper>
                  <Grid py={0.5}>1</Grid>{' '}
                </TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
                <TableBodyCellWrapper>0</TableBodyCellWrapper>
              </StyledTableRow>
              <TableRow>
                <TableBodyCellWrapper colspan={8}>
                  <Grid py={0.5} textAlign={'right'}>
                    {' '}
                    Total
                  </Grid>{' '}
                </TableBodyCellWrapper>
                <TableBodyCellWrapper colspan={4}>0</TableBodyCellWrapper>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* table code part end */}
      {/* footer */}
      <Footer />
    </>
  );
};

HeadWiseDueReport.getLayout = (page) => (
  <Authenticated requiredPermissions={['create_admit_card', 'show_admit_card']}>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default HeadWiseDueReport;
