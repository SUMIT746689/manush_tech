import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import Head from 'next/head';
import { Typography, Grid } from '@mui/material';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { TableBodyCellWrapper, TableHeaderCellWrapper } from '@/components/Table/Table';
import { AutoCompleteWrapperWithDebounce } from '@/components/AutoCompleteWrapper';
import { monthList } from '@/utils/getDay';
import Footer from '@/components/Footer';
const monthData = monthList.map((month) => ({ label: month, value: month }));

import { styled } from '@mui/material/styles';

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

const HeadWiseDueReport = () => {
  return (
    <>
      <Head>
        <title>Head_Wise_Due_Report</title>
      </Head>
      <Typography
        variant="h4"
        textTransform="uppercase"
        py={{
          md: 3,
          xs: 2
        }}
        px={2}
      >
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
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                columnGap: '20px',
                rowGap: '0',
                flexWrap: 'wrap'
              }}
            >
              {/* Month field */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapperWithDebounce
                  debounceTimeout=""
                  options={monthData}
                  value={''}
                  // value={undefined}
                  handleChange={() => {}}
                  label="Select Month"
                  placeholder="Month To"
                />
              </Grid>

              {/* Head field */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper options={[]} value={''} label="Select Head" placeholder="Select a Head" handleChange={() => {}} />
              </Grid>
              {/* Class field */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper options={[]} value={''} label="Select Class" placeholder="Select a Class" handleChange={() => {}} />
              </Grid>

              {/* Group field */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper options={[]} value={''} label="Select Group" placeholder="Select a Group" handleChange={() => {}} />
              </Grid>

              {/* Section field */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper options={[]} value={''} label="Select Section" placeholder="Select a Section" handleChange={() => {}} />
              </Grid>

              {/* Search button */}
              <Grid
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: '40%',
                    md: '30%',
                    xl: '15%'
                  },
                  flexGrow: 1,
                  position: 'relative',
                  display: 'flex',
                  gap: 1
                }}
              >
                <Grid
                  sx={{
                    flexGrow: 1
                  }}
                >
                  <SearchingButtonWrapper isLoading={false} handleClick={() => {}} disabled={false} children={'Search'} />
                </Grid>
                <Grid
                  sx={{
                    flexGrow: 1
                  }}
                >
                  <SearchingButtonWrapper isLoading={false} handleClick={() => {}} disabled={false} children={'Print'} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* split your code end */}
      </Grid>
      {/* searching part code end */}

      {/* table code part start */}

      <Grid
        mt={3}
        mb={4}
        px={1}
        sx={{
          width: {
            xs: '100vw',
            md: '100%'
          },
          minHeight: {
            xs: 150,
            md: 'calc(100dvh - 378px)'
          }
        }}
      >
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
