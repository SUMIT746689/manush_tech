import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Card, Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/StudentFeesCollection/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { useReactToPrint } from 'react-to-print';
import { ButtonWrapper } from '@/components/ButtonWrapper';

function Managementschools() {
  const [datas, setDatas] = useState<Project[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [printFees, setPrintFees] = useState<[object?]>([]);
  const [filteredFees, setFilteredFees] = useState<any>([]);
  const [selectedFees, setSelectedFees] = useState<any[]>([]);
  
  
  const { data: accounts } = useClientFetch(`/api/account`);
  const { data: classData, error: classError } = useClientFetch('/api/class');


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
        <Card sx={{ pt: 1, px: 1, display: 'grid', gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, justifyContent: 'center', fontSize: 0.1, columnGap: 1 }}>
          <ButtonWrapper
            handleClick={() => setPrintFees([])}
            color="warning"
          >
            {'Reset'}
          </ButtonWrapper>

          <ButtonWrapper
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
          </ButtonWrapper>

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
          <PaymentInvoice printFees={printFees} student={selectedStudent} />
          <PaymentInvoice printFees={printFees} student={selectedStudent} />
        </Grid>

        <Grid ref={printSelectedPageRef}>
          <PaymentInvoice printFees={selectedFees} student={selectedStudent} />
          <PaymentInvoice printFees={selectedFees} student={selectedStudent} />
        </Grid>

        <Grid ref={printAllPageARef}>
          <PaymentInvoice printFees={filteredFees} student={selectedStudent} />
          <PaymentInvoice printFees={filteredFees} student={selectedStudent} />
        </Grid>
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
