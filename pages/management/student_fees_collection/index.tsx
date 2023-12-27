import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Button, Card, Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/StudentFeesCollection/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { useReactToPrint } from 'react-to-print';
import { ButtonWrapper, SearchingButtonWrapper } from '@/components/ButtonWrapper';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

function Managementschools() {
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

  useEffect(() => {


    const temp = datas.filter(i => {

      const got = printFees.find(j => j.fee_id == i.id)
      if (got) {
        for (const index in got) {
          i[index] = got[index]
        }
        return true;
      }

      return false


    })
    console.log("printFees__", temp);

    setPrinCollectedtFees(temp)
  }, [printFees])


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
  console.log({ printFees, prinCollectedtFees })

  const handleSentSms = () => {
    setIsSentSmsLoading(true);
    const sms_text = `${prinCollectedtFees[0].title} fees, paid amount: ${printFees[0].paidAmount} TK(${printFees[0].status}), due: ${prinCollectedtFees[0].due} TK. Tracking number: ${printFees[0].tracking_number}`
    console.log("print-fees--", { sms_text })
    console.log({ selectedStudent })
    if (!selectedStudent?.guardian_phone) {
      showNotification("guardian phone number not founds", "error")
      setIsSentSmsLoading(false);
    }
    axios.post("/api/sent_sms/student_fees", { sms_text, contacts: selectedStudent?.guardian_phone })
      .then(({ data }) => {
        if (data?.success) showNotification("sending sms successfully")
      })
      .catch((err) => {
        showNotification("faild to sending sms ", "error")
        console.log({ err });
      })
      .finally(() => { setIsSentSmsLoading(false); })
  }

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
            accountsOption={accounts?.map(i => ({
              label: i.title,
              id: i.id
            })) || []}

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
        <Card sx={{ pt: 1, px: 1, display: 'grid', gridTemplateColumns: { xs: " 1fr", md: "1fr 1fr 1fr" }, justifyContent: 'center', fontSize: 0.1, columnGap: 1 }}>
          <ButtonWrapper
            handleClick={() => setPrintFees([])}
            color="warning"
          >
            {'Reset'}
          </ButtonWrapper>

          {/* <ButtonWrapper
            disabled={selectedFees.length === 0}
            handleClick={handlePrintSelected}
          >
            {'Selceted Invoice Print'}
          </ButtonWrapper>

          <ButtonWrapper
            sx={{
              ':disabled': {
                backgroundColor: 'silver'
              }
            }}
            disabled={filteredFees.length === 0}
            handleClick={handlePrintAll}
          >
            {'Print All'}
          </ButtonWrapper> */}

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
          <PaymentInvoice printFees={prinCollectedtFees} student={selectedStudent} />
          <PaymentInvoice printFees={prinCollectedtFees} student={selectedStudent} />
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
