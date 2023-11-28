import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import Result from '@/content/Certificate/GenerateEmployee/Results';
import StudentTeacherResults from '@/content/Certificate/GenerateStudentTeacher/StudentTeacherResult';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import prisma from '@/lib/prisma_client';

export async function getServerSideProps(context: any) {
  let templates: any = [];
  let teacher: any = null;
  let roles: any = [];
  try {
    const refresh_token_varify: any = serverSideAuthentication(context)

    if (!refresh_token_varify) return { props: { teacher, templates } };

    templates = await prisma.certificateTemplate.findMany({ where: { user_type: 'employee' } })
    templates = JSON.parse(JSON.stringify(templates));

    roles = await prisma.role.findFirst({ where: { title: "TEACHER" } })
    roles = [JSON.parse(JSON.stringify(roles))];

    if (refresh_token_varify.role.title === 'TEACHER') {

      teacher = await prisma.teacher.findFirst({ where: { user_id: Number(refresh_token_varify.id),deleted_at:null }, include: { department: true } })
      const parseTeacher = JSON.parse(JSON.stringify(teacher));
      return { props: { teacher: parseTeacher, templates, roles } };
    }

  }
  catch (error) {
    console.log({ error })
  }
  return { props: { teacher, roles, templates } }
}
const Packages = ({ teacher, templates, roles }) => {
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
              <StudentTeacherResults certificateFor={"teacher"} teacher={teacher} templates={templates} />
              :
              <Result defauleRole={ roles && roles?.length > 0 ? roles[0].id : undefined } roles={roles}  templates={templates} />
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
