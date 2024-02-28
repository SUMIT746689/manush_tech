import Footer from 'src/components/Footer';
import { Avatar, Button, Card, Grid } from '@mui/material';
import Calander from '../calender/calander';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { AttendanceIcon, ExamIcon, FeesCollectionIcon, RoutineIcon, StaffsIcon, StudentRegIcon, StudentsIcon, TeacherRoutineIcon } from '@/components/Icon';
import Notices from '../admin_notices';
import { Attendance } from '../attendance';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/numberFormat';

const colorBlue = "#0052B4"
const colorLightRed = "#FFE6E2"
const colorDarkRed = "#CA3214"
const colorLightTeal = "#D2F7ED"
const colorDarkTeal = "#147D6F"
const colorDarkViolet = "#9C2BAD"
const colorLightViolet = "#F9E5F9"

function AdminDashboardReportsContent({ blockCount = null }) {
  const { banners: banners_ } = blockCount || {};
  const { banners } = banners_ || {};
  const { left_banners, right_banners } = banners || {};
  const { t }: { t: any } = useTranslation();
  const right_banner_check = Array.isArray(right_banners) && right_banners.length > 0
  return (
    <>

      <Grid p={2} display={{ sm: "flex" }} gap={2}>

        <Grid sx={{ display: "grid", width: "100%", gap: 2 }}>
          <Card sx={{ display: 'flex', width: "100%", p: 2, gap: 4, backgroundColor: (theme) => theme.colors.primary.main, color: "whitesmoke", borderRadius: 1 }}>
            {/* <Image alt='sss' /> */}
            <Avatar sx={{ my: 'auto', width: { xs: 60, sm: 80, md: 120 }, height: { xs: 60, sm: 80, md: 120 } }} />
            <Grid sx={{
              display: 'grid',
              gap: 1
            }}>
              <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 600 }}>{blockCount?.school?.name}</Grid>
              <Grid sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 200 }}> Address: {blockCount?.school?.address}</Grid>
              <Grid sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 200 }}> Package price: {blockCount?.school?.subscription[0]?.package.price}{blockCount?.school?.subscription[0]?.package?.is_std_cnt_wise === true ? ',Package type: Student count wise,' : ''} End date: {dayjs(blockCount?.school?.subscription[0]?.end_date).format('MMMM D, YYYY')} </Grid>
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
            <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700, textAlign: "center" }}>SMS QUANTITY</Grid>
            <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between', pt: 3, pb: 2 }}>
              <span>Masking Sms:</span>
              <span>{blockCount?.school?.masking_sms_count ? formatNumber(blockCount?.school?.masking_sms_count) : 0}</span>
            </Grid>
            <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>Non Masking Sms:</span>
              <span>{blockCount?.school?.non_masking_sms_count ? formatNumber(blockCount?.school?.non_masking_sms_count) : 0}</span>
            </Grid>
          </Card>
        </Grid>
      </Grid>


      {/* quick links and attendance */}
      <Grid px={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} >

        {/* quick links */}
        {/* <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 4, justifyContent: "center", width: 4 / 6, mx: 'auto' }} > */}
        <Grid width="100%" display="flex" justifyContent="center">
          <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: "center", width: { xs: '100%', md: 4 / 6 }, maxWidth: "550px", height: 'fit-content', transition: 'all 5s' }} >
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

      {
        banners && <Grid sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, px: 2, py: { xs: 2, sm: 2 } }}>
          <Card sx={{
            width: "100",
            borderRadius: 0,
            // borderTopLeftRadius: 0.5, borderTopRightRadius: 0.5,
            overflow: "hidden"
          }} >
            <ImageSlider target='_blank' images={left_banners ? left_banners?.map(banner => ({ url: banner.url, redirectUrl: banner.redirectUrl })) : []} />
          </Card>
          <Card sx={{ width: "100", borderRadius: 0 }}>
            {
              (right_banner_check && right_banners[0]?.redirectUrl) ?
                <Link target='_blank' href={right_banners[0].redirectUrl} >
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={`/api/get_file/${(Array.isArray(right_banners) && right_banners.length > 0 && right_banners[0].url) && right_banners[0].url}`} alt="right_banner" />
                </Link>
                :
                right_banner_check && right_banners[0].url && right_banners[0].url && <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={`/api/get_file/${(right_banner_check && right_banners[0].url) && right_banners[0].url}`} alt="right_banner" />
            }
            {/* <Link
            target='_blank'
            href={(Array.isArray(right_banners) && right_banners.length > 0 && right_banners[0].redirectUrl) ? right_banners[0].redirectUrl : ''}
          >
            <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={`/api/get_file/${(Array.isArray(right_banners) && right_banners.length > 0 && right_banners[0].url) && right_banners[0].url}`} alt="right_banner" />
          </Link> */}
          </Card>
        </Grid>
      }

      {/* notice board and calander */}
      < Grid sx={{ display: 'grid', width: "100%", height: "100%", gridTemplateColumns: { md: '1fr 1fr' }, px: 2, gap: 2 }
      }>
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
      </Grid >

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
