import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import Head from 'next/head';
import { Typography, Grid, TableFooter, selectClasses } from '@mui/material';
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
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useNotistick from '@/hooks/useNotistick';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { useAuth } from '@/hooks/useAuth';
import { formatNumber } from '@/utils/numberFormat';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { useClientFetch } from '@/hooks/useClientFetch';
import { monthList } from '@/utils/getDay';

// month related code
const currentDate = new Date();
const monthIndex = currentDate.getMonth();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentMonthName = monthNames[monthIndex].toLowerCase();
const monthData = monthList.map((month) => month);

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

const TableContent = ({ totalCalculation, reports, selectedClass }) => {
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
            <TableHeaderCellWrapper>Batch</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Roll</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Year</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Payable Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Paid Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Discount Amount</TableHeaderCellWrapper>
            <TableHeaderCellWrapper>Due Amount</TableHeaderCellWrapper>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports?.map((item, i) => (
            <StyledTableRow key={item.id}>
              <TableBodyCellWrapper>
                <Grid py={0.5}>{i + 1}</Grid>{' '}
              </TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.student_info.student_id}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{`${item.student_info.first_name ? item.student_info.first_name : ''} ${
                item.student_info.middle_name ? item.student_info.middle_name : ''
              } ${item.student_info.last_name ? item.student_info.last_name : ''}`}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{selectedClass.label}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.group.title && item.group.title}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.section.name && item.section.name}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.class_roll_no}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.academic_year.title}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.total_payable}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.collected_amount}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{parseFloat(item.discount_amount?.toFixed(2)) + parseFloat(item.total_on_time_discount)}</TableBodyCellWrapper>
              <TableBodyCellWrapper>{item.total_payable - item.collected_amount}</TableBodyCellWrapper>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableFooterCellWrapper colspan={8} align="right">
            {' '}
            Total
          </TableFooterCellWrapper>
          <TableFooterCellWrapper align="right" colspan={4}>
            {' '}
            {formatNumber(totalCalculation?.totalDueAmount)}
          </TableFooterCellWrapper>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const PrintData = ({ startDate, endDate, reports, totalCalculation, selectedClass }) => {
  const { user } = useAuth();
  const { school } = user || {};
  const { name, address } = school || {};
  return (
    <Grid mx={1}>
      <Grid textAlign="center" fontWeight={500} lineHeight={3} pt={5}>
        <Typography variant="h3" fontWeight={500}>
          {name}
        </Typography>
        <h4>{address}</h4>
        <Typography variant="h4">Head Wise Collection Report</Typography>
        <h4>
          Date From: <b>{dayjs(startDate).format('DD-MM-YYYY')}</b>, Date To: <b>{dayjs(endDate).format('DD-MM-YYYY')}</b>
        </h4>
      </Grid>

      <TableContent reports={reports} totalCalculation={totalCalculation} selectedClass={selectedClass} />
    </Grid>
  );
};

const HeadWiseDueReport = () => {
  const [selected_month, setSelectMonth] = useState<string | null>(currentMonthName);

  const [startDate, setStartDate] = useState<any>(dayjs(Date.now()));
  const [endDate, setEndDate] = useState<any>(dayjs(Date.now()));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeesHead, setSelectedFeesHead] = useState<any>();

  const [feesMonths, setFeesMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();

  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

  const [reports, setReports] = useState([]);
  const { showNotification } = useNotistick();
  const [total, setTotal] = useState();
  const [totalCalculation, setTotalCalculation] = useState<any>({ totalDueAmount: 0 });

  const componentRef = useRef();
  const { muiMenuList: muiFeesHeadsLists } = useClientFetch('/api/fees_heads');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleSearch = () => {
    setIsLoading(true);

    axios
      .get(`/api/reports/head_wise_collections?from_date=${startDate}&to_date=${endDate}`)
      .then(({ data }) => {
        setReports(data);
        setTotal(data.reduce((prev, curr) => prev + curr.total_collected_amt, 0));
      })
      .catch((err) => {
        handleShowErrMsg(err, showNotification);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFeesHeadChange = (event, value) => {
    if (value) {
      setSelectedFeesHead(value);

      if (!value?.id) return;
      axios
        .get(`/api/fees_heads/${value.id}`)
        .then(({ data }) => {
          setSelectedMonth(null);

          if (!Array.isArray(data)) return setClassList([]);

          const customizeCls = data.map((cls) => ({ label: cls.name, id: cls.id, ...cls }));

          setClassList(customizeCls);
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      setClassList([]);
      setSelectedClass('');
    }
  };

  const handleMonthChange = (event, value) => {
    setSelectMonth(event.target.value);
  };

  const handleClsChange = (event, value) => {
    if (value) {
      if (!value?.id) return;
      setSelectedClass(value);
      const findCls = classList.find((cls) => cls.id === value.id);
      if (!findCls) return setSectionList([]);
      const cusSectionList = findCls.sections.map((section) => ({ label: section.name, id: section.id }));
      setSectionList([
        {
          label: 'Select all',
          id: null
        },
        ...cusSectionList
      ]);
      if (!findCls?.has_section) setSelectedSection(cusSectionList[0]);
      setSelectedSection(null);
      // @ts-ignore
      axios
        .get(`/api/fee/available_months?fees_head_id=${selectedFeesHead?.id}&class_id=${value.id}`)
        .then(({ data: feesMonths }) => {
          setFeesMonths(feesMonths);
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      setSelectedSection('');
      setSelectedClass('');
      setSectionList([]);
    }
  };

  const handleSectionChange = (event, value) => {
    if (value) {
      setSelectedSection(value);
    } else {
      setSelectedSection('');
    }
  };

  const calculateTotalAmountsByStudentId = (arr) => {
    return arr.reduce((acc, item) => {
      const { student, collected_amount, on_time_discount, total_payable, fee } = item;
      const { id } = student;

      // Calculate current discounts for percent and flat
      const currentPercentDiscount = fee?.Discount?.filter((d) => d.type === 'percent').reduce((sum, discount) => sum + (discount.amt || 0), 0) || 0;
      const currentFlatDiscount = fee?.Discount?.filter((d) => d.type === 'flat').reduce((sum, discount) => sum + (discount.amt || 0), 0) || 0;

      // Calculate current discount amount for percentage
      const currentPercentDiscountAmount =
        fee?.Discount?.filter((d) => d.type === 'percent').reduce((sum, discount) => sum + fee.amount * (discount.amt / 100), 0) || 0;

      // Accumulate previous discounts
      const previousPercentDiscount = acc[id] ? acc[id].previous_percent_discount + currentPercentDiscount : currentPercentDiscount;
      const previousFlatDiscount = acc[id] ? acc[id].previous_flat_discount + currentFlatDiscount : currentFlatDiscount;
      const totalOnTimeDiscount = acc[id] ? acc[id].total_on_time_discount + on_time_discount : on_time_discount;

      const totalDiscountAmount = currentPercentDiscountAmount + currentFlatDiscount;

      if (acc[id]) {
        acc[id].collected_amount += collected_amount;
        acc[id].total_payable += total_payable;
        acc[id].previous_percent_discount = previousPercentDiscount;
        acc[id].previous_flat_discount = previousFlatDiscount;
        acc[id].total_on_time_discount = totalOnTimeDiscount;
        acc[id].discount_amount += totalDiscountAmount;
      } else {
        acc[id] = {
          ...student,
          ...student.student_info,
          collected_amount,
          total_payable,
          fee,
          previous_percent_discount: previousPercentDiscount,
          previous_flat_discount: previousFlatDiscount,
          total_on_time_discount: totalOnTimeDiscount,
          discount_amount: totalDiscountAmount
        };
      }

      return acc;
    }, {});
  };

  const handleClickDueReport = async () => {
    try {
      if (!selectedFeesHead || !selectedClass || !selected_month || !selectedSection) {
        showNotification('Please select a head, month, class and batch before proceeding', 'error');
        return;
      }
      setIsLoading(true);
      let sectionIds = [];

      // section start
      //  @ts-ignore
      if (selectedSection.label === 'Select all') {
        sectionIds = sectionList.filter((item) => item.id !== null).map((item) => item.id);
      } else {
        //  @ts-ignore
        sectionIds = [selectedSection.id];
      }
      // section end

      const res = await axios.get(
        //  @ts-ignore
        `/api/reports/head_wise_due_report?selected_head=${selectedFeesHead.id}&selected_class=${selectedClass.id}&selected_section=${sectionIds}&month_name=${selected_month}`
      );

      let totalPayableAmount = 0;
      let totalPaidAmount = 0;
      let totalDiscountAmount = 0;
      let totalDueAmount = 0;

      if (res?.data?.studentDueInfo?.length > 0) {
        const totalAmountsByStudentId = calculateTotalAmountsByStudentId(res?.data?.studentDueInfo);
        const resultArray = Object.values(totalAmountsByStudentId);

        // total calculation part code start

        if (resultArray.length > 0) {
          resultArray.forEach((item) => {
            //  @ts-ignore
            totalPayableAmount = totalPayableAmount + item?.total_payable;
            //  @ts-ignore
            totalPaidAmount = totalPaidAmount + item?.collected_amount;
            //  @ts-ignore
            totalDiscountAmount = totalDiscountAmount + item?.total_on_time_discount + item?.previous_discount;
            //  @ts-ignore
            totalDueAmount = totalDueAmount + (item.total_payable - item.collected_amount);
          });
        }
        setTotalCalculation({
          totalPayableAmount: totalPayableAmount,
          totalPaidAmount: totalPaidAmount,
          totalDiscountAmount: totalDiscountAmount,
          totalDueAmount: totalDueAmount
        });
        setReports(resultArray);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/*  print report */}
      <Grid display="none">
        <Grid ref={componentRef}>
          <PrintData startDate={startDate} endDate={endDate} reports={reports} totalCalculation={totalCalculation} selectedClass={selectedClass} />
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
                <AutoCompleteWrapper
                  options={muiFeesHeadsLists}
                  value={selectedFeesHead}
                  label="Select Head"
                  placeholder="Select a Head"
                  handleChange={handleFeesHeadChange}
                />
              </Grid>

              {/* Class field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper
                  options={classList}
                  value={selectedClass}
                  label="Select Class"
                  placeholder="Select a Class"
                  handleChange={handleClsChange}
                />
              </Grid>

              {/* Month field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <DropDownSelectWrapper
                  // menuItems={feesMonths}
                  menuItems={monthData}
                  value={selected_month}
                  handleChange={handleMonthChange}
                  label="Month To"
                  name="month"
                />
              </Grid>

              {/* Group field */}
              {/* <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper options={[]} value={''} label="Select Group" placeholder="Select a Group" handleChange={() => { }} />
              </Grid> */}

              {/* Section field */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1 }}>
                <AutoCompleteWrapper
                  options={sectionList}
                  value={selectedSection}
                  label="Select Batch"
                  placeholder="Select a Batch"
                  handleChange={handleSectionChange}
                />
              </Grid>

              {/* Search button */}
              <Grid sx={{ flexBasis: { xs: '100%', sm: '40%', md: '30%', xl: '15%' }, flexGrow: 1, position: 'relative', display: 'flex', gap: 1 }}>
                <Grid sx={{ flexGrow: 1 }}>
                  <SearchingButtonWrapper isLoading={isLoading} handleClick={handleClickDueReport} disabled={isLoading} children={'Search'} />
                </Grid>
                <Grid sx={{ flexGrow: 1 }}>
                  <SearchingButtonWrapper
                    isLoading={isLoading}
                    handleClick={handlePrint}
                    disabled={reports.length === 0 ? true : false}
                    children={'Print'}
                  />
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
        <TableContent reports={reports} totalCalculation={totalCalculation} selectedClass={selectedClass} />
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
