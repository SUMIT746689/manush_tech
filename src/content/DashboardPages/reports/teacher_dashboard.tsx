import Footer from 'src/components/Footer';
import { Avatar, Card, Grid, Link } from '@mui/material';
import Block1 from 'src/content/Blocks/Statistics/Block3';
import Image from 'next/image';
import Calander from '../calender/calander';
import Notice from '../notice/notice';
import Head from '../head/head';
import QuickLinkCards, { StudentPathButton } from '../quick_link_card/quickLinkCard';
import { useTranslation } from 'next-i18next';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { teacherModulesList } from '@/utils/moduleLists';
import { AccountingIcon, AttendanceIcon, CertificateIcon, ExamIcon, FeesCollectionIcon, NoticeIcon, OnlineAddmissionIcon, ReportIcon, RoutineIcon, SmsIcon, StaffsIcon, StudentRegIcon, StudentsIcon, StudyMaterialsIcon, TeacherAttendenceIcon, TeacherIcon, TeacherRoutineIcon, WebsiteSettingsIcon } from '@/components/Icon';

const quickLinksColors = [
  { dark: "#006ADC", light: "#E1F0FF" },
  { dark: "#9C2BAD", light: "#F9E5F9" },
  { dark: "#CA3214", light: "#FFE6E2" },
]

const quickLinks = [
  { color: quickLinksColors[1], linkUrl: "#", icon: < AttendanceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Student Attendance" },
  { color: quickLinksColors[2], linkUrl: "#", icon: <TeacherIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Class Exam" },
  { color: quickLinksColors[1], linkUrl: "#", icon: <ReportIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Mark Entry" },
  { color: quickLinksColors[0], linkUrl: "#", icon: <OnlineAddmissionIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Student Home Work" },
  { color: quickLinksColors[1], linkUrl: "#", icon: <StudentRegIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Salary", },
  { color: quickLinksColors[0], linkUrl: "#", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Notice" },
  { color: quickLinksColors[1], linkUrl: "#", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Routine" },
  { color: quickLinksColors[2], linkUrl: "#", icon: <StudyMaterialsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Study Materials" },
  { color: quickLinksColors[0], linkUrl: "#", icon: <SmsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Sms" },
  { color: quickLinksColors[2], linkUrl: "#", icon: <TeacherAttendenceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name:"My Attendence" },
  { color: quickLinksColors[1], linkUrl: "#", icon: <ReportIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Reports" },
  { color: quickLinksColors[0], linkUrl: "#", icon: <CertificateIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Work Schedule" },
  
  { color: quickLinksColors[2], linkUrl: "#", icon: <ReportIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name:"Other Activities" },

]


function StudentDashboardReportsContent({ blockCount }) {

  const { teacher } = blockCount;
  const name = [teacher.first_name, teacher.middle_name, teacher.last_name].join(' ');
  const extraInfo = [['Department', teacher.department.title]];
  // const quickLinks = [
  //   { name: 'Exam', src: "exam.svg", href: "/management/exam" },
  //   { name: 'Class Attendance', src: "attendance.svg", href: "/management/attendence/normalAttendence" },
  //   { name: 'Routine', src: "routine.svg", href: "/management/routine/class" },
  //   { name: 'Exam Attendance', src: "exam_attendance.svg", href: "/management/attendence/examAttendence" }
  // ]


  // banners
  const { banners: banners_ } = blockCount || {};
  const { banners } = banners_ || {};
  const { left_banners, right_banners } = banners || {};
  const { t }: { t: any } = useTranslation();
  const right_banner_check = Array.isArray(right_banners) && right_banners.length > 0;


  return (
    <>
      {/* <Card sx={{ m: 4, borderRadius: 0.5 }}>
        <Grid container justifyContent='space-between' >
          <Grid item xs={8} p={2}>
            <Head name={name} extraInfo={extraInfo} />
          </Grid>
          <Grid item xs={4} position="relative" >
            <Image width={50} height={50} className=' absolute object-cover h-full w-full content-center ' src={'school_classroom.svg'} alt="classroom" />
          </Grid>
        </Grid>
      </Card> */}

      <Grid p={{ xs: 1, sm: 2 }}>
        <Card sx={{ display: 'flex', height: 170, justifyContent: "space-between", width: "100%", p: 2, columnGap: 4, backgroundColor: (theme) => theme.colors.primary.main, color: "whitesmoke", borderRadius: 1 }}>
          {/* <Image alt='sss' /> */}
          <Avatar sx={{ my: 'auto', width: { xs: 60, sm: 80, md: 120 }, height: { xs: 60, sm: 80, md: 120 } }} />
          <Grid sx={{ display: 'flex', height: 'fit-content', flexDirection: "column", gap: 1, my: 'auto' }}>
            <Grid sx={{ fontSize: { xs: 18, sm: 20, md: 26 }, fontWeight: 600 }}>{name}</Grid>
            <Grid sx={{ fontSize: { xs: 14, sm: 16, md: 20 }, fontWeight: 400 }}> {extraInfo[0][0]}: {extraInfo[0][1]} </Grid>
            {/* <Grid sx={{ fontSize: { xs: 14, sm: 16, md: 20 }, fontWeight: 400 }}> <Head name={name} extraInfo={extraInfo}></Head></Grid> */}
          </Grid>

          <Image
            src="/dashboard/student_teacher.svg"
            width={300}
            height={150}
            alt="Picture of the author"
            style={{ position: "relative", bottom: -1, right: 0, marginTop: 'auto' }}
          />
        </Card>
      </Grid>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems='center'
        spacing={4}
      >
        <Grid item xs={12}>
          <Block1 blockCount={blockCount} />
        </Grid>

        <Grid
          xs={12}
          md={11}
          sx={{
            pl: 4,
            pt: 2,
          }}
        >
          <Grid width="100%" display="flex" gap={4} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* quick links */}
            {/* <QuickLinkCards quickLinks={quickLinks} /> */}
            <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: "center", height: 'fit-content', transition: 'all 5s' }} >
              {
                quickLinks.map(({ color, linkUrl, icon, name }, index) => <StudentPathButton key={index} color={color} linkUrl={linkUrl} icon={icon} name={name} value={teacherModulesList[index]} />)
              }
            </Grid>

            {/* calander */}
            <Grid item sx={{ maxWidth: { sm: 400 }, minWidth: "fit-content", minHeight: '100%' }}>
              <Calander holidays={blockCount.holidays} />
            </Grid> 
          </Grid>
        </Grid>
      </Grid>

      {/* banners  */}
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

      {/* notice */}
      <Notice blockCount={blockCount} />
      <Footer />
    </>
  );
}


export default StudentDashboardReportsContent;
