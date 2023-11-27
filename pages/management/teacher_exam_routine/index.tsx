import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Card, Grid } from '@mui/material';
import PageHeader from 'src/content/Management/TeacherExamRoutine/PageHeader';
import Results from 'src/content/Management/TeacherExamRoutine/Results';

import { serverSideAcademicYearVerification, serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';
import axios from 'axios';


export async function getServerSideProps(context: any) {
  let props: any = { exams: [], exam_terms: [] };

  try {
    const refresh_token: any = serverSideAuthentication(context);
    const [error, academic_year] = serverSideAcademicYearVerification(context);

    if (!refresh_token) return { redirect: { destination: '/login' } };
    const { id, role, school_id } = refresh_token ?? {};
    // console.log({ role })

    const exams = await prisma.exam.findMany({ where: { school_id } })
    props["exams"] = exams;
    if (academic_year?.id) {
      const exam_terms = await prisma.examTerm.findMany({ where: { school_id, academic_year_id: academic_year.id, deleted_at: null } })
      props["exam_terms"] = exam_terms;
    }

    const teachers = await prisma.teacher.findMany({ where: { school_id } })
    props["teachers"] = JSON.parse(JSON.stringify(teachers));
    // switch (role?.title) {
    //   // case "ADMIN": 
    //   //   const resExams = await prisma.exam.findFirst({where:{school_id}}) 

    //   //   break;
    //   case "TEACHER":
    //     const resTeacherSyllabus = await prisma.teacher.findFirst({
    //       where: { user_id: id },
    //       select: {
    //         seatPlans: {
    //           include: {
    //             room: {
    //               select: { name: true }
    //             },
    //             exam_details: {
    //               select: {
    //                 exam: {
    //                   select: {
    //                     title: true,
    //                     section: {
    //                       select: {
    //                         name: true,
    //                         class: {
    //                           select: {
    //                             name: true
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 },
    //                 subject: {
    //                   select: {
    //                     name: true
    //                   }
    //                 }
    //               }
    //             },
    //           }
    //         }
    //       }
    //     });
    //     props["seat_plans"] = resTeacherSyllabus.seatPlans;
    //     console.log({ resTeacherSyllabus })
    //     break;
    //   default:

    // }

  } catch {

  }
  return { props };
}

function ManagementDepartments({ exams, exam_terms, teachers }) {
  console.log({ exam_terms })
  // const [academicYear, _] = useContext(AcademicYearContext);
  // console.log({ academicYear });
  // const { datas } = useClientFetch(`/api/exam?academic_year=${academicYear?.id}`);
  const [seatPlans, setSeatPlans] = useState([]);
  const [editSeatPlan, setEditSeatPlan] = useState(null);
  const [classList, setClassList] = useState([]);
  const [classes, setClasses] = useState([]);


  useEffect(() => {
    axios.get(`/api/class`)
      .then(res => {
        setClasses(res.data)
        setClassList(res.data?.map(i => ({
          label: i.name,
          id: i.id,
          has_section: i.has_section
        })
        ))
      })
      .catch(err => console.log(err));

  }, [])
  return (
    <>
      <Head>
        <title>Teacher Exam Routine - Management</title>
      </Head>
      <PageTitleWrapper>
        {/* @ts-ignore */}
        {/* <PageHeaderTitleWrapper
          name="Teacher Exam Routine"
          actionButton={true}
          handleCreateClassOpen={0}
        /> */}
        <PageHeader
          editExam={null}
          setEditExam={setEditSeatPlan}
          classList={classList}
          classes={classes}
          setSeatPlan={setSeatPlans}
          seatPlan={seatPlans}
          teachers={teachers?.map((teacher) => {
            return {
              label: teacher.first_name,
              id: teacher.id,
            }
          }) || []}
        />
      </PageTitleWrapper>


      <Grid
        sx={{ px: { xs: 1, sm: 3 } }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >

        <Grid item xs={12}>
          <Results exam_terms={exam_terms || []} teachers={teachers || []} datas={seatPlans} setDatas={setSeatPlans} setEditData={() => { }} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementDepartments.getLayout = (page) => (
  <Authenticated name="holiday">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementDepartments;
