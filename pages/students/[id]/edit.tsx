import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma_client';
import StudentForm from '@/components/Student/StudentForm';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';


export const getServerSideProps = async ({ params }) => {
  try {
    const studentID = parseInt(params.id)

    const student = await prisma.student.findUniqueOrThrow({
      where: {
        id: studentID
      },
      include: {
        student_info: {
          include: {
            user: true,
          }
        },
        section: true,
      }
    })

    return { props: { student: JSON.parse(JSON.stringify(student)) } }

  } catch (e) {
    return { notFound: true }
  }
}

const EditStudent = ({ student }) => {
  const { t }: { t: any } = useTranslation();
  return (
    <>
      <PageTitleWrapper>
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Student Edit')}
          </Typography>
          <Typography variant="subtitle2">
            {t(`Student name: ${student?.student_info?.first_name} ${student?.student_info?.middle_name} ${student?.student_info?.last_name}`)}
          </Typography>
        </Grid>
      </PageTitleWrapper>

      <StudentForm student={student} />
      <Footer />
    </>
  )
}


EditStudent.getLayout = (page) => (
  <Authenticated name="student">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default EditStudent;