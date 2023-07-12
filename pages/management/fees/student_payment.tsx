import Head from 'next/head';

import { useState, useEffect, useCallback, useRef } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import Footer from 'src/components/Footer';

import { Button, Card, Grid } from '@mui/material';
import type { Project } from 'src/models/project';
import StudentPayment from 'src/content/Management/Fees/StudentPayment';
import { useClientFetch } from 'src/hooks/useClientFetch';
import PaymentInvoice from '@/content/Management/StudentFeesCollection/PaymentInvoice';
import { useReactToPrint } from 'react-to-print';
import prisma from '@/lib/prisma_client';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import dayjs from 'dayjs';

export async function getServerSideProps(context: any) {
  let student: any = null;
  let data: any = null;
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)
    if (!refresh_token_varify) return { props: { student } };
    console.log({refresh_token_varify})

    student = await prisma.student.findFirst({
      where: {
        student_info: {
          user_id: Number(refresh_token_varify.id),
          school_id: refresh_token_varify.school_id
        }
      },
      select: {
        id: true,
        student_photo: true,
        section_id: true,
        class_registration_no: true,
        student_present_address: true,
        discount: true,
        student_info: {
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            school: {
              select: {
                name: true
              }
            }
          }
        },
        academic_year: true,
        section: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
                has_section: true,
                fees: true,
              }
            }
          }

        },
        guardian_phone: true,
        class_roll_no: true
      }
    });

    console.log({student})
    // fees getting
    const student_fee = await prisma.studentFee.findMany({
      where: { student_id: student.id },
      include: {
        fee: true
      }
    });

    const fees = student.section.class.fees.map((fee) => {
      const findStudentFee: any = student_fee.filter(pay_fee => pay_fee.fee.id === fee.id);

      const findStudentFeeSize = findStudentFee.length
      if (findStudentFeeSize) {
        const paidAmount = findStudentFee.reduce((a, c) => a + c.collected_amount, 0)
        // console.log("paidAmount__", paidAmount);
        const last_date = dayjs(fee.last_date).valueOf()
        const last_trnsation_date = dayjs(findStudentFee[findStudentFeeSize - 1].created_at).valueOf()
        const late_fee = fee.late_fee ? fee.late_fee : 0;


        if (last_trnsation_date > last_date && fee.amount == paidAmount) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'Fine unpaid', paidAmount })
        }
        else if (last_trnsation_date > last_date && paidAmount >= fee.amount + late_fee) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid late', paidAmount })
        }

        else if (last_date >= last_trnsation_date && fee.amount == paidAmount) {
          return ({ ...fee, last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at, status: 'paid' })
        }
        else {
          return ({
            ...fee,
            last_payment_date: findStudentFee[findStudentFeeSize - 1].created_at,
            paidAmount: paidAmount,
            status: 'partial paid'
          })
        }

      }
      else return ({ ...fee, status: 'unpaid' })
    })

    data = {
      ...student.student_info,
      name: [student.student_info.first_name, student.student_info.middle_name, student.student_info.last_name].join(' '),
      class: student.section.class.name,
      section: student.section.class.has_section ? student.section.name : '',
      class_registration_no: student.class_registration_no,
      class_roll_no: student.class_roll_no,
      discount: student.discount,
      fees
    };

  }
  catch (error) {
    console.log({ error })
  }
  const parse = JSON.parse(JSON.stringify({ student, data }));
  return { props: parse }
}


function ManagementStudentPayment({ data }) {
  // const isMountedRef = useRefMounted();
  const [datas, setDatas] = useState<Project[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<[object?]>([]);
  const [printFees, setPrintFees] = useState<[object?]>([]);
  const [filteredFees, setFilteredFees] = useState<any>([]);

  // const { data, error } = useClientFetch('/api/student_payment_collect');

  const printPageRef = useRef();
  const printAllPageARef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printPageRef.current
  });
  const handlePrintAll = useReactToPrint({
    content: () => printAllPageARef.current
  });
  console.log({data})
  return (
    <>
      <Head>
        <title>Student Fee Payment - Management</title>
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
          <StudentPayment
            data={data}
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
              ml: 2
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

ManagementStudentPayment.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementStudentPayment;
