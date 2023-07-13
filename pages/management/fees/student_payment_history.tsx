import Head from 'next/head';

import { useState, useEffect, useCallback, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Attendence/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { schoolsApi } from 'src/mocks/schools';
import PamentHistoryResult from '@/content/Management/Fees/PaymentHistoryResult';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';
import dayjs from 'dayjs';


export async function getServerSideProps(context: any) {
  let student: any = null;
  let data: any = null;
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)
    if (!refresh_token_varify) return { props: { student } };


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


    // fees getting
    const student_fee = await prisma.studentFee.findMany({
      where: { student_id: student.id },
      include: {
        fee: true
      }
    });

    // const all_fees = await prisma.student.findFirst({
    //   where: { id: Number(refresh_token_varify.id) },
    //   select: {
    //     class_registration_no: true,
    //     class_roll_no: true,
    //     discount: true,
    //     student_info: {
    //       select: {
    //         id: true,
    //         first_name: true,
    //         middle_name: true,
    //         last_name: true,
    //       }
    //     },
    //     section: {
    //       select: {
    //         class: {
    //           select: {
    //             fees: true
    //           }
    //         }
    //       }
    //     }
    //   }
    // });


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
      name : [student.student_info.first_name, student.student_info.middle_name, student.student_info.last_name].join(' '),
      class: student.section.class.name,
      section:  student.section.class.has_section ? student.section.name : '',
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

function ManagementFees({ data }) {
  
  return (
    <>
      <Head>
        <title>Payment - History</title>
      </Head>

      <PageTitleWrapper>
        <PageHeader title={'Payment history'} />
      </PageTitleWrapper>
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <PamentHistoryResult data={data} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementFees.getLayout = (page) => (
  <Authenticated name='student_payment_history' >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementFees;
