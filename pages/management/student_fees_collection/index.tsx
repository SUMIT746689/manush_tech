import Head from 'next/head';

import { useState, useEffect, useCallback, useRef } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import Footer from 'src/components/Footer';

import { Button, Card, Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import Results from 'src/content/Management/StudentFeesCollection/Results';
import { useClientFetch } from 'src/hooks/useClientFetch';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { useReactToPrint } from 'react-to-print';
function Managementschools() {
  // const isMountedRef = useRefMounted();
  const [datas, setDatas] = useState<Project[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<[object?]>([]);
  const [printFees, setPrintFees] = useState<[object?]>([]);
  const [filteredFees, setFilteredFees] = useState<any>([]);

  const { data, error } = useClientFetch('/api/student_payment_collect');
  const { data: classData, error: classError } = useClientFetch('/api/class');
  useEffect(() => {
    if (data?.success) setDatas(data.data);
  }, [data, error]);

  const printPageRef = useRef();
  const printAllPageARef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printPageRef.current
  });
  const handlePrintAll = useReactToPrint({
    content: () => printAllPageARef.current
  });

  return (
    <>
      <Head>
        <title>Student Fee Collection - Management</title>
      </Head>
      {/* <PageTitleWrapper> */}
      {/* @ts-ignore */}
      {/* <PageHeader
          studentData={
            studentData?.length > 0
              ? studentData?.map((i) => ({
                  label: i?.student_info.first_name,
                  value: i.id
                }))
              : []
          }
          feeData={
            feeData?.success
              ? feeData.data.map((fee) => ({
                  label: fee.title,
                  value: fee.id
                }))
              : []
          }
          editData={editData}
          seteditData={setEditData}
        /> */}
      {/* </PageTitleWrapper> */}

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
            classes={classData}
            sessions={datas}
            setSessions={setDatas}
            students={students}
            setStudents={setStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setPrintFees={setPrintFees}
            filteredFees={filteredFees} 
            setFilteredFees={setFilteredFees}
          />
        </Grid>
      </Grid>
      <Grid px={4} mt={1}>
        <Card sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => setPrintFees([])}
            sx={{ mr: 2 }}
            variant="contained"
            color="warning"
          >
            {'Reset'}
          </Button>
          <Button
            sx={{
              ':disabled': {
                backgroundColor: 'silver'
              }
            }}
            disabled={printFees.length === 0}
            onClick={handlePrint}
            variant="contained"
          >
            {'Collect Invoice Print'}
          </Button>

          <Button
            sx={{
              ':disabled': {
                backgroundColor: 'silver'
              },
              ml:2
            }}
            disabled={filteredFees.length === 0}
            onClick={handlePrintAll}
            variant="contained"
          >
            {'Print All'}
          </Button>
        </Card>
      </Grid>
      <Grid sx={{ display: 'none' }}>
        <Grid ref={printPageRef}>
          <PaymentInvoice printFees={printFees} student={selectedStudent} />
          <PaymentInvoice printFees={printFees} student={selectedStudent} />
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
  <Authenticated name="student_fee_collect">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Managementschools;
