import Head from 'next/head';
import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
  useContext
} from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Button, Card, Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/StudentFeesCollection/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { useReactToPrint } from 'react-to-print';
import {
  ButtonWrapper,
  SearchingButtonWrapper
} from '@/components/ButtonWrapper';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import LeftBox from '@/content/FeesCollect/LeftBox';
import RightBox from '@/content/FeesCollect/RightBox';
import LeftFeesTable from '@/content/FeesCollect/LeftFeesTable';
import RightFeesTable from '@/content/FeesCollect/RightFeesTable';
import PaymentOptions from '@/content/FeesCollect/PaymentOptions';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

// updated searching code start

const monthData = [
  { label: 'January', id: 1 },
  { label: 'February', id: 2 },
  { label: 'March', id: 3 },
  { label: 'April', id: 4 },
  { label: 'May', id: 5 },
  { label: 'June', id: 6 },
  { label: 'July', id: 7 },
  { label: 'August', id: 8 },
  { label: 'September', id: 9 },
  { label: 'October', id: 10 },
  { label: 'November', id: 11 },
  { label: 'December', id: 12 }
];

// updated searching code end

function Managementschools() {
  // updated code start
  const [searchValue, setSearchValue] = useState<any>(null);
  const [searchOptionData, setSearchOptionData] = useState<Array<any>>([]);
  const [userInformation, setUserInformation] = useState<object | null>(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const [leftFeesTableData, setLeftFeesTableData] = useState<Array<any>>([]);
  const [totalDueValue, setTotalDueValue] = useState<string>('0');
  const [feesUserData, setFeesUserData] = useState<object>({});
  const [selectedRowsFeesTable, setSelectedRowsFeesTable] = useState([]);
  const [leftFeesTableTotalCalculation, setLeftFeesTableTotalCalculation] =
    useState<object | null>(null);
  const [trackingCollectButton, setTrackingCollectButton] =
    useState<Boolean>(false);
  const [selectAll, setSelectAll] = useState<Boolean>(false);
  // handleDebounce function

  const handleDebounce = (value) => {
    if (value?.length >= 3) {
      axios
        .get(
          `/api/student/search-students?search_value=${value?.toLowerCase()}`
        )
        .then((res) => {
          const userInfoArr = res.data.map((item) => {
            return {
              label: `${item.first_name} | ${item.class_name} | ${item.class_roll_no} | ${item.section_name}`,
              id: item.id
            };
          });
          setSearchOptionData(userInfoArr);
        })
        .catch((error) => {});
    } else if (value?.length < 3) {
      setSearchOptionData([]);
    } else if (!value) {
      setSearchOptionData([]);
    }
  };

  const searchHandleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    v
  ) => {
    setSearchValue(event.target.value);
  };
  const searchHandleUpdate = async (
    event: ChangeEvent<HTMLInputElement>,
    v
  ) => {
    setSearchValue(v || null);
  };
  const datePickerHandleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {};
  const monthHandleChange = (event: ChangeEvent<HTMLInputElement>): void => {};
  const leftFeesTableColumnData = (data) => {
    let totalDue = 0;
    let totalObj = {
      amount: 0,
      late_fee: 0,
      paidAmount: 0,
      discount: 0,
      dueAmount: 0
    };
    // fees array
    let feesData = data?.fees.map((item) => {
      const last_trnsaction_time = new Date(item?.last_payment_date).getTime();
      const last_date_time = new Date(item?.last_date).getTime();
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const check_last_transaction_time = new Date(formattedDate).getTime();
      let late_fee_value = null;
      let due_fee_value = null;
      let paid_amount_value = null;
      if (last_trnsaction_time < last_date_time) {
        late_fee_value = 0;
      } else if (last_trnsaction_time > last_date_time) {
        late_fee_value = item.late_fee ? item.late_fee : 0;
      } else if (check_last_transaction_time < last_date_time) {
        late_fee_value = 0;
      } else if (check_last_transaction_time > last_date_time) {
        late_fee_value = item.late_fee ? item.late_fee : 0;
      }

      // check duevalue
      if (late_fee_value === 0) {
        due_fee_value =
          item.status === 'paid' ? 0 : item.amount - (item.paidAmount || 0);
      } else if (late_fee_value > 0) {
        due_fee_value =
          item.status === 'paid'
            ? 0
            : item.amount + item.late_fee - (item.paidAmount || 0);
      }

      // check  paidAmount
      if (item.status === 'paid') {
        paid_amount_value = item.amount;
      } else {
        paid_amount_value = item.paidAmount ? item.paidAmount : 0;
      }

      return {
        feeId: item.id,
        title: item.title,
        amount: item.amount ? item.amount : 0,
        late_fee: late_fee_value,
        paidAmount: paid_amount_value,
        discount: 0,
        dueAmount: due_fee_value
      };
    });

    // calculate discount
    for (let i = 0; i < feesData.length; i++) {
      for (let j = 0; j < data?.discount.length; j++) {
        if (feesData[i].feeId === data?.discount[j].fee_id) {
          if (data?.discount[j].type === 'flat') {
            feesData[i].discount =
              feesData[i].discount + parseInt(data.discount[j].amt); // 100
          } else if (data?.discount[j].type === 'percent') {
            feesData[i].discount =
              feesData[i].discount +
              parseInt(feesData[i].amount) / parseInt(data.discount[j].amt);
          }
        }
      }
    }

    // calculate dueAmount
    feesData = feesData.map((item) => {
      return {
        ...item,
        dueAmount: parseInt(item.dueAmount) - parseInt(item.discount)
      };
    });

    // calculate totalDue

    feesData.forEach((item) => {
      totalDue = totalDue + parseInt(item.dueAmount);
    });

    // total (amount , Late Fee,  Paid Amount, Discount, Due)  functionality

    feesData.forEach((item) => {
      totalObj.amount = totalObj.amount + item.amount;
      totalObj.late_fee = totalObj.late_fee + item.late_fee;
      totalObj.paidAmount = totalObj.paidAmount + item.paidAmount;
      totalObj.discount = totalObj.discount + item.discount;
      totalObj.dueAmount = totalObj.dueAmount + item.dueAmount;
    });

    setLeftFeesTableData(feesData);
    setTotalDueValue(totalDue.toString());
    setFeesUserData(data);
    setLeftFeesTableTotalCalculation({
      ...totalObj
    });

    // discount array
  };
  const btnHandleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    // searching data collect
    // searchValue.id
    // academicYear.id
    if (searchValue?.id && academicYear?.id) {
      const res = await axios.get(
        `/api/student_payment_collect/${searchValue.id}?academic_year_id=${academicYear.id}`
      );

      leftFeesTableColumnData(res?.data?.data);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          trackingCollectButton === true &&
          searchValue?.id &&
          academicYear?.id
        ) {
          const res = await axios.get(
            `/api/student_payment_collect/${searchValue.id}?academic_year_id=${academicYear.id}`
          );

          leftFeesTableColumnData(res?.data?.data);
        }
      } catch (error) {}
    };

    fetchData();
  }, [trackingCollectButton]);

  const deSelectAllCheckbox = () => {
    setSelectAll(false);
    setSelectedRowsFeesTable([]);
  };

  // updated searching code end
  const [datas, setDatas] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [printFees, setPrintFees] = useState([]);
  const [prinCollectedtFees, setPrinCollectedtFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState<any>([]);
  const [selectedFees, setSelectedFees] = useState<any[]>([]);
  const { showNotification } = useNotistick();
  const [isSentSmsLoading, setIsSentSmsLoading] = useState(false);
  const { data: accounts } = useClientFetch(`/api/account`);
  const { data: classData, error: classError } = useClientFetch('/api/class');
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    const temp = datas.filter((i) => {
      const got = printFees.find((j) => j.fee_id == i.id);
      if (got) {
        for (const index in got) {
          i[index] = got[index];
        }
        return true;
      }

      return false;
    });

    setPrinCollectedtFees(temp);
  }, [printFees]);

  const printPageRef = useRef();
  const printSelectedPageRef = useRef();
  const printAllPageARef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printPageRef.current
  });

  const handlePrintSelected = useReactToPrint({
    content: () => printSelectedPageRef.current
  });

  const handlePrintAll = useReactToPrint({
    content: () => printAllPageARef.current
  });

  const handleSentSms = () => {
    if (!selectedStudent?.student_info?.phone)
      return showNotification('phone number not founds', 'error');

    setIsSentSmsLoading(true);
    const sms_text = `${prinCollectedtFees[0].title} fees, paid amount: ${printFees[0].paidAmount} TK(${printFees[0].status}), due: ${prinCollectedtFees[0].due} TK. Tracking number: ${printFees[0].tracking_number}`;

    axios
      .post('/api/sent_sms/student_fees', {
        sms_text,
        contacts: selectedStudent?.student_info?.phone
      })
      .then(({ data }) => {
        if (data?.success) showNotification('sending sms successfully');
      })
      .catch((err) => {
        showNotification('faild to sending sms ', 'error');
      })
      .finally(() => {
        setIsSentSmsLoading(false);
      });
  };

  useEffect(() => {
    if (!showPrint || prinCollectedtFees.length === 0) return;
    handlePrint();
    setShowPrint(false);
  }, [showPrint]);

  return (
    <>
      <Head>
        <title>Student Fee Collection - Management</title>
      </Head>

      <Grid
        sx={{ px: 4, mt: 1 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item xs={12}>
          <Results
            accounts={accounts}
            accountsOption={
              accounts?.map((i) => ({
                label: i.title,
                id: i.id
              })) || []
            }
            classes={classData}
            sessions={datas}
            setSessions={setDatas}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setPrintFees={setPrintFees}
            filteredFees={filteredFees}
            setFilteredFees={setFilteredFees}
            setSelectedFees={setSelectedFees}
          />
        </Grid>
      </Grid>
      <Grid px={4} mt={1}>
        <Card
          sx={{
            pt: 1,
            px: 1,
            display: 'grid',
            gridTemplateColumns: { xs: ' 1fr', md: '1fr 1fr 1fr' },
            justifyContent: 'center',
            fontSize: 0.1,
            columnGap: 1
          }}
        >
          <ButtonWrapper handleClick={() => setPrintFees([])} color="warning">
            {'Reset'}
          </ButtonWrapper>

          <SearchingButtonWrapper
            isLoading={isSentSmsLoading}
            handleClick={handleSentSms}
            disabled={printFees.length === 0 || prinCollectedtFees.length === 0}
          >
            Sent Sms
          </SearchingButtonWrapper>

          <ButtonWrapper
            sx={{
              ':disabled': {
                backgroundColor: 'silver'
              }
            }}
            disabled={printFees.length === 0}
            handleClick={handlePrint}
          >
            {'Collect Invoice Print'}
          </ButtonWrapper>
        </Card>
      </Grid>
      <Grid sx={{ display: 'none' }}>
        <Grid ref={printPageRef}>
          <PaymentInvoice
            setShowPrint={setShowPrint}
            printFees={prinCollectedtFees}
            student={selectedStudent}
          />
          <PaymentInvoice
            setShowPrint={setShowPrint}
            printFees={prinCollectedtFees}
            student={selectedStudent}
          />
        </Grid>

        {/* <Grid ref={printSelectedPageRef}>
          <PaymentInvoice printFees={selectedFees} student={selectedStudent} />
          <PaymentInvoice printFees={selectedFees} student={selectedStudent} />
        </Grid>

        <Grid ref={printAllPageARef}>
          <PaymentInvoice printFees={filteredFees} student={selectedStudent} />
          <PaymentInvoice printFees={filteredFees} student={selectedStudent} />
        </Grid> */}
      </Grid>
      {/* updated searching code start */}
      <Grid
        px={4}
        mt={1}
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
        columnGap={2}
        rowGap={{ xs: 1, md: 0 }}
        mx={1}
        minHeight="fit-content"
      >
        <LeftBox
          debounceTimeout={500}
          handleDebounce={handleDebounce}
          searchHandleUpdate={searchHandleUpdate}
          searchData={searchOptionData}
          searchValue={searchValue}
          searchHandleChange={searchHandleChange}
          datePickerHandleChange={datePickerHandleChange}
          monthData={monthData}
          monthHandleChange={monthHandleChange}
          btnHandleClick={btnHandleClick}
        />
        <RightBox userInformation={userInformation} />
      </Grid>
      {/* updated searching code end */}
      {/* fees collection code start*/}
      <Grid
        px={4}
        mt={1}
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
        columnGap={2}
        rowGap={{ xs: 1, md: 0 }}
        mx={1}
        minHeight="fit-content"
      >
        <LeftFeesTable
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          leftFeesTableTotalCalculation={leftFeesTableTotalCalculation}
          tableData={leftFeesTableData}
          feesUserData={feesUserData}
          selectedRows={selectedRowsFeesTable}
          setSelectedRows={setSelectedRowsFeesTable}
        />
        <RightFeesTable />
      </Grid>
      <Grid px={4} mt={1} mx={1}>
        <PaymentOptions
          deSelectAllCheckbox={deSelectAllCheckbox}
          trackingCollectButton={trackingCollectButton}
          setTrackingCollectButton={setTrackingCollectButton}
          tableData={leftFeesTableData}
          feesUserData={feesUserData}
          selectedRows={selectedRowsFeesTable}
          accounts={accounts}
          accountsOption={
            accounts?.map((i) => ({
              label: i.title,
              id: i.id
            })) || []
          }
          btnHandleClick={btnHandleClick}
        />
      </Grid>
      {/* fees collection code end*/}
      <Footer />
    </>
  );
}

Managementschools.getLayout = (page) => (
  <Authenticated name="collect_fee">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
