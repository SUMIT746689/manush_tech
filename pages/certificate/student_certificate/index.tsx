import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/Certificate/GenerateStudentByOther/Results';
import StudentTeacherResults from '@/content/Certificate/GenerateStudentTeacher/StudentTeacherResult';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';

export async function getServerSideProps(context: any) {
  let classes: any = [];
  let templates: any = [];
  let student: any = null;
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)
    if (!refresh_token_varify) return { props: { student, templates } };

    templates = await prisma.certificateTemplate.findMany({ where: { user_type: 'student' } })
    templates = JSON.parse(JSON.stringify(templates));

    if (refresh_token_varify.role.title !== 'STUDENT') {
      classes = await prisma.class.findMany({
        where: {
          school_id: refresh_token_varify.school_id
        },
        include: {
          sections: {
            select: {
              id: true,
              name: true
            }
          },
          Group: true
        }
      });

      return { props: { classes, templates } };
    }

    student = await prisma.student.findFirst({
      where: {
        student_info: {
          user_id: refresh_token_varify.id,
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
                has_section: true
              }
            }
          }

        },
        guardian_phone: true,
        class_roll_no: true
      }
    });
    console.log({ student })
  }
  catch (error) {
    console.log({ error })
  }
  return { props: { student, templates } }
}
const Packages = ({ student, templates, classes }) => {
  // console.log({ student })
  return (
    <>
      <Head>
        <title>Student Certificate Generate</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          {
            student ?
              <StudentTeacherResults certificateFor={"student"} student={student} templates={templates} />
              :
              <Result classes={classes} templates={templates} />
          }
        </Grid>

        <Footer />
      </PageBodyWrapper>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated name='student_certificate' >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
