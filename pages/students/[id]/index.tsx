import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma_client';
import StudentForm from '@/components/Student/StudentForm';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import UserProfile from '@/content/Students/UserProfile';
import { verifyPermissions } from 'utilities_api/verifyPermissions';
import { verifyUser } from 'utilities_api/verify';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import Link from 'next/link';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';


export const getServerSideProps = async ({ params }) => {
    try {
        const studentID = parseInt(params.id);

        const student = await prisma.student.findUniqueOrThrow({
            where: {
                id: studentID
            },
            include: {
                student_info: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                user_role_id: true,
                                role_id: true,
                                // "deleted_at": null,
                                "is_enabled": true,
                                // "created_at": "2024-02-08T10:51:48.311Z",
                                // "updated_at": "2024-03-10T06:32:41.608Z",
                                user_photo: true,
                                school_id: true,
                                admin_panel_id: true
                            }
                        }
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

const StudentProfile = ({ student }) => {
    const { t }: { t: any } = useTranslation();
    return (
        <>
            <PageTitleWrapper>
                <Grid display={{ sm: "flex" }} justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t('Student Profile')}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t(`Student Name: ${student?.student_info?.first_name} ${student?.student_info?.middle_name || ''} ${student?.student_info?.last_name || ''}`)}
                        </Typography>
                    </Grid>
                    <Grid item display="flex" my="auto" pt={{ xs: 1, sm: 0 }} columnGap={1} columnSpacing={1}>
                        <Link href={"/management/attendence/normalAttendence"}><ButtonWrapper handleClick={() => { }}>attendance page  <KeyboardArrowRightTwoToneIcon fontSize="small" /></ButtonWrapper></Link>
                        <Link href={"/management/student_fees_collection"}><ButtonWrapper handleClick={() => { }}>fees page <KeyboardArrowRightTwoToneIcon fontSize="small" /> </ButtonWrapper></Link>
                    </Grid>
                </Grid>
            </PageTitleWrapper >

            <UserProfile student={student} />
            <Footer />
        </>
    )
}


StudentProfile.getLayout = (page) => (
    <Authenticated requiredPermissions={["show_students"]}>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default StudentProfile;