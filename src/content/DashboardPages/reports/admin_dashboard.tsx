import Footer from 'src/components/Footer';
import { Avatar, Button, Card, Grid } from '@mui/material';
import Calander from '../calender/calander';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { AttendanceIcon, ExamIcon, FeesCollectionIcon, RoutineIcon, StaffsIcon, StudentRegIcon, StudentsIcon, TeacherRoutineIcon } from '@/components/Icon';
import Notices from '../admin_notices';
import { Attendance } from '../attendance';

const colorBlue = "#0052B4"
const colorLightRed = "#FFE6E2"
const colorDarkRed = "#CA3214"
const colorLightTeal = "#D2F7ED"
const colorDarkTeal = "#147D6F"
const colorDarkViolet = "#9C2BAD"
const colorLightViolet = "#F9E5F9"

function AdminDashboardReportsContent({ blockCount = null }) {

  const { t }: { t: any } = useTranslation();

  console.log({ blockCount })

  return (
    <>

      <Grid p={2} display={{ sm: "flex" }} gap={2}>

        <Grid sx={{ display: "grid", width: "100%", gap: 2 }}>
          <Card sx={{ display: 'flex', width: "100%", p: 2, gap: 4, backgroundColor: colorBlue, color: "whitesmoke", borderRadius: 1 }}>
            {/* <Image alt='sss' /> */}
            <Avatar sx={{ my: 'auto', width: { xs: 60, sm: 80, md: 120 }, height: { xs: 60, sm: 80, md: 120 } }} />
            <Grid sx={{
              display: 'grid',
              gap: 1
            }}>
              <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 600 }}>{blockCount?.school?.name}</Grid>
              <Grid sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 200 }}> Address: {blockCount?.school?.address}</Grid>
              <Grid sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 200 }}> Package: {blockCount?.school?.subscription[0]?.package.title} </Grid>
            </Grid>
          </Card>

          <Grid sx={{ width: '100%', display: "grid", gridTemplateColumns: { xs: '1fr', sm: "1fr 1fr" }, gap: 2, pb: 2 }}>
            <Card sx={{ width: '100%', p: 3, backgroundColor: colorLightRed, color: colorDarkRed, display: 'flex', gap: 2, justifyContent: "center", alignItems: "center" }}>
              <StudentsIcon style={{}} />
              <Grid fontWeight={700} fontSize={{ xs: 20, sm: 26 }} >
                <Grid>Total Students</Grid>
                <Grid>{blockCount?.students?.count}</Grid>
              </Grid>
            </Card>

            <Card sx={{ width: '100%', p: 3, backgroundColor: colorLightTeal, color: colorDarkTeal, display: 'flex', gap: 2, justifyContent: "center", alignItems: "center" }}>
              <StaffsIcon />
              <Grid fontWeight={700} fontSize={{ xs: 20, sm: 26 }} >
                <Grid sx={{}}>Total Staffs</Grid>
                <Grid>0 -static</Grid>
              </Grid>
            </Card>

          </Grid>
        </Grid>


        <Grid sx={{ height: 'fit-content', maxWidth: { sm: 350 }, width: '100%', display: "grid", gap: 2 }}>

          <Button variant='contained' color='secondary' sx={{ height: { xs: 60, sm: 90 }, width: '100%', fontSize: { xs: 20, sm: 26 } }}>
            <Link href={`http://${blockCount?.domain}`} target='_blank' color="primary" rel="noopener noreferrer" >
              {t('Front end link')}
            </Link>
          </Button>

          <Card sx={{ color: colorBlue, px: 3, py: 4.5 }}>
            <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700, textAlign: "center" }}>SMS Balance</Grid>
            <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between', pt: 3, pb: 2 }}>
              <span>Total Balance:</span>
              <span>1000</span>
            </Grid>
            <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>Remaining Balance:</span>
              <span>250</span>
            </Grid>
          </Card>
        </Grid>
      </Grid>


      {/* quick links and attendance */}
      <Grid px={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} >

        {/* quick links */}
        {/* <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 4, justifyContent: "center", width: 4 / 6, mx: 'auto' }} > */}
        <Grid width="100%" display="flex" justifyContent="center">
          <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: "center", width: { xs: '100%', md: 4 / 6 }, height: 'fit-content', transition: 'all 5s' }} >
            <StudentPathButton linkUrl="/management/students/registration" icon={<StudentRegIcon style={{ margin: 'auto' }} />} name="Student Registration" />
            <StudentPathButton linkUrl="/management/routine/class_routine" icon={<RoutineIcon style={{ margin: 'auto' }} />} name="Routine" />
            <StudentPathButton linkUrl="#" icon={<TeacherRoutineIcon style={{ margin: 'auto' }} />} name="Teacher Routine" />
            <StudentPathButton linkUrl="/management/exam" icon={<ExamIcon style={{ margin: 'auto' }} />} name="Exam" />
            <StudentPathButton linkUrl="#" icon={<AttendanceIcon style={{ margin: 'auto' }} />} name="Attendance" />
            <StudentPathButton linkUrl="/management/student_fees_collection" icon={<FeesCollectionIcon style={{ margin: 'auto' }} />} name="Fees Colelction" />
          </Grid>
        </Grid>
        {/* attendance */}
        <Grid sx={{ maxWidth: { sm: 350 }, width: '100%' }}>
          <Attendance todayAttendance={blockCount.attendance} />
        </Grid>
      </Grid>

      {/* banners */}
      {/* <Grid sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, p: 2 }}> */}
      <Grid sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, px: 2, py: { xs: 2, sm: 2 } }}>
        <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: '10px' }} src='admin_dashboard/banner_1.png' alt="banner_1" />
        <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: '10px' }} src='admin_dashboard/banner_2.png' alt="banner_2" />
      </Grid>

      {/* notice board and calander */}
      <Grid sx={{ display: 'grid', width: "100%", height: "100%", gridTemplateColumns: { md: '1fr 1fr' }, px: 2, gap: 2 }}>
        <Grid xs={12} md={11} sx={{ height: 'full' }}>
          <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700 }}>Notice Board</Grid>
          <Notices notices={blockCount?.school?.Notice || []} />
        </Grid>


        <Grid
          xs={12}
          md={11}
          sx={{
            // pt: 2,
          }}
        >
          <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700 }}>Calander</Grid>
          <Calander holidays={blockCount.holidays} />
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

const StudentPathButton = ({ linkUrl, name, icon }) => {
  return (
    <>
      <Link href={linkUrl}  >
        <Card sx={{ border: '1px solid', transition: 'all 0.2s', ':hover': { background: colorLightViolet, transform: 'scale(.95)' }, borderColor: colorDarkViolet, borderRadius: 1, px: 3, py: 1 }}>
          <Grid sx={{ width: 85, height: 85, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Grid>
              {icon}
            </Grid>
            <Grid fontSize={14} color={colorDarkViolet}>
              {name}
            </Grid>
          </Grid>
        </Card>
      </Link>
    </>
  )
}





export default AdminDashboardReportsContent;
