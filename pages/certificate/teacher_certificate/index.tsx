import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/Certificate/GenerateStudent/Results';
import StudentTeacherResults from '@/content/Certificate/GenerateStudent/StudentTeacherResult';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';

export async function getServerSideProps(context: any) {
  let classes: any = [];
  let templates: any = [];
  let student: any = null;
  let teacher: any = null;
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)
    
    if (!refresh_token_varify) return { props: { teacher, templates } };

    templates = await prisma.certificateTemplate.findMany({ where: { user_type: 'employee' } })
    templates = JSON.parse(JSON.stringify(templates));

    if (refresh_token_varify.role.title === 'TEACHER') {

      teacher = await prisma.teacher.findFirst({ where: { user_id: Number(refresh_token_varify.id) },include:{department:true} })
      const parseTeacher= JSON.parse(JSON.stringify(teacher));
      return { props: { teacher:parseTeacher, templates } };
    }
  }
  catch (error) {
    console.log({ error })
  }
  return { props: { student, templates } }
}
const Packages = ({ student, teacher, templates, classes }) => {
  return (
    <>
      <Head>
        <title>Teacher Certificate Generate</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          justifyContent="center"
          gap={2}
          px={1}
        >
          {
            teacher ?
              <StudentTeacherResults teacher={teacher} student={student} templates={templates} />
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
  <Authenticated name='teacher_certificate' >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
