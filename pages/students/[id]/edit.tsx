import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma_client';
import StudentForm from '@/components/Student/StudentForm';


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
  return (
    <>
      <PageTitleWrapper>
        <div>Hell student edit</div>
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