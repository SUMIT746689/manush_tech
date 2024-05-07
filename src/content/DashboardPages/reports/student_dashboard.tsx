import Footer from 'src/components/Footer';
import { Avatar, Card, Grid, Link } from '@mui/material';
import Image from 'next/image';
import Calander from '../calender/calander';
import Notice from '../notice/notice';
import Head from '../head/head';
import QuickLinkCards, { StudentPathButton } from '../quick_link_card/quickLinkCard';
import { useAuth } from '@/hooks/useAuth';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { useTranslation } from 'next-i18next';
import { studentModulesList } from '@/utils/moduleLists';
import { AccountingIcon, AttendanceIcon, CertificateIcon, ExamIcon, FeesCollectionIcon, MarkSheetIcon, NoticeIcon, OnlineAddmissionIcon, ReportIcon, RoutineIcon, SmsIcon, StaffsIcon, StudentRegIcon, StudentsIcon, StudyMaterialsIcon, TabulationIcon, TeacherIcon, TeacherRoutineIcon, WebsiteSettingsIcon } from '@/components/Icon';

const quickLinksColors = [
  { dark: "#006ADC", light: "#E1F0FF" },
  { dark: "#9C2BAD", light: "#F9E5F9" },
  { dark: "#CA3214", light: "#FFE6E2" },
]

const quickLinks = [
  { value: 0, color: quickLinksColors[0], linkUrl: "#", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Class Routine" },
  { value: 1, color: quickLinksColors[1], linkUrl: "#", icon: < AttendanceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "View Attendence" },
  { value: 2, color: quickLinksColors[2], linkUrl: "#", icon: <OnlineAddmissionIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Home Work" },
  { value: 3, color: quickLinksColors[1], linkUrl: "#", icon: <StudyMaterialsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Study Materials" },
  { value: 4, color: quickLinksColors[2], linkUrl: "#", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Notice" },
  { value: 5, color: quickLinksColors[0], linkUrl: "#", icon: <ReportIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Payment Report" },
]

const examAndResultSecQuickLinks = [
  { value: 6, color: quickLinksColors[2], linkUrl: "#", icon: <OnlineAddmissionIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Admit Card" },
  { value: 7, color: quickLinksColors[1], linkUrl: "#", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Exam Routine" },
  { value: 8, color: quickLinksColors[0], linkUrl: "#", icon: <MarkSheetIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Mark Sheet" },
  { value: 9, color: quickLinksColors[1], linkUrl: "#", icon: <TabulationIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Tabulation Sheet" },
  { value: 10, color: quickLinksColors[2], linkUrl: "#", icon: <CertificateIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Certificate" },
]


function StudentDashboardReportsContent({ blockCount }) {
  const { user } = useAuth()
  const { student, banners: banners_ } = blockCount || {};
  const { banners } = banners_ || {};
  const { left_banners, right_banners } = banners || {};
  const { t }: { t: any } = useTranslation();
  const right_banner_check = Array.isArray(right_banners) && right_banners.length > 0;

  const name = [student?.student_info?.first_name, student?.student_info?.middle_name, student?.student_info?.last_name].join(' ');
  const extraInfo = [['Roll', student.class_roll_no], ['Class', student.section.class.name], ['Section', student.section.name]]
  // const quickLinks = [
  //   { name: 'Exam', src: "exam.svg", href: "/management/exam" },
  //   { name: 'Attendance', src: "attendance.svg", href: "/management/exam" },
  //   { name: 'Routine', src: "routine.svg", href: "/management/exam" },
  //   { name: 'Fees Collection', src: "fees_collection.svg", href: "/management/exam" }
  // ]
  return (
    <>

      <Grid p={{ xs: 1, sm: 2 }}>
        <Card sx={{ display: 'flex', height: 170, justifyContent: "space-between", width: "100%", p: 2, columnGap: 4, backgroundColor: (theme) => theme.colors.primary.main, color: "whitesmoke", borderRadius: 1 }}>
          {/* <Image alt='sss' /> */}
          <Avatar sx={{ my: 'auto', width: { xs: 60, sm: 80, md: 120 }, height: { xs: 60, sm: 80, md: 120 } }} />
          <Grid sx={{ display: 'flex', height: 'fit-content', flexDirection: "column", gap: 0.5, my: 'auto' }}>
            <Grid sx={{ fontSize: { xs: 18, sm: 20, md: 26 }, fontWeight: 600 }}>{name}</Grid>
            <Grid sx={{ fontSize: { xs: 14, sm: 16, md: 20 }, fontWeight: 400 }}> {extraInfo[0][0]}: {extraInfo[0][1]} </Grid>
            <Grid sx={{ fontSize: { xs: 14, sm: 16, md: 20 }, fontWeight: 400 }}> {extraInfo[1][0]}: {extraInfo[1][1]} </Grid>
            <Grid sx={{ fontSize: { xs: 14, sm: 16, md: 20 }, fontWeight: 400 }}> {extraInfo[2][0]}: {extraInfo[2][1]} </Grid>

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
          px: 4,
          pt: 2
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems='center'
        spacing={4}
      >
        <Grid xs={12} md={11} sx={{ pl: 4, pt: 2 }} >
          <Grid display="flex" gap={4} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>

            {/* quick link cards */}
            <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: "center", height: 'fit-content', transition: 'all 5s' }} >
              {
                // quickLinks.slice(0,6).map(({ color, linkUrl, icon, name }, index) => <StudentPathButton key={index} color={color} linkUrl={linkUrl} icon={icon} name={name} value={studentModulesList[index]} />)
                quickLinks.map(({ value, color, linkUrl, icon, name }) => <StudentPathButton key={value} color={color} linkUrl={linkUrl} icon={icon} name={name} value={studentModulesList[value]} />)
              }
            </Grid>

            {/* calander */}
            <Grid item sx={{ maxWidth: { sm: 400 }, minWidth: "fit-content", minHeight: '100%' }}>
              <Grid fontWeight={700}>Calander:</Grid>
              <Calander holidays={blockCount.holidays} />
            </Grid>
          </Grid>

          {/* exam and result section */}
          <Grid>
            <Grid borderRadius={0.5} p={1} width={'100%'} sx={{ fontWeight: 700, my: 2, border: '2px solid', textAlign: 'center', color: theme => theme.colors.primary.dark, borderColor: theme => theme.colors.primary.dark }} > Exam & Result Section</Grid>
            <Grid sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: "center", height: 'fit-content', transition: 'all 5s' }} >
              {
                // quickLinks.slice(6,).map(({ color, linkUrl, icon, name }, index) => <StudentPathButton key={index} color={color} linkUrl={linkUrl} icon={icon} name={name} value={studentModulesList[index]} />)
                examAndResultSecQuickLinks.map(({ value, color, linkUrl, icon, name }) => <StudentPathButton key={value} color={color} linkUrl={linkUrl} icon={icon} name={name} value={studentModulesList[value]} />)
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>

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
