import Head from 'next/head';
import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from 'react';
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
  const [searchValue, setSearchValue] = useState<null | string>(null);
  const [searchOptionData, setSearchOptionData] = useState<Array<any>>([]);
  const [userInformation, setUserInformation] = useState<object | null>(null);

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
  const btnHandleClick = (event: MouseEvent<HTMLButtonElement>): void => {};

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
    console.log('printFees__', temp);

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
        console.log({ err });
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
        <LeftFeesTable />
        <RightFeesTable />
      </Grid>
      <Grid px={4} mt={1} mx={1}>
        <PaymentOptions
          dueAmout="20000"
          accounts={accounts}
          accountsOption={
            accounts?.map((i) => ({
              label: i.title,
              id: i.id
            })) || []
          }
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
