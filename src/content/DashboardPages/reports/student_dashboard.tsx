import Footer from 'src/components/Footer';
import {Card, Grid} from '@mui/material';
import Image from 'next/image';
import Calander from '../calender/calander';
import Notice from '../notice/notice';
import Head from '../head/head';
import QuickLinkCards from '../quick_link_card/quickLinkCard';

function StudentDashboardReportsContent({ blockCount}) {

  const { student } = blockCount;
  const name = [student?.student_info?.first_name, student?.student_info?.middle_name, student?.student_info?.last_name].join(' ');
  const extraInfo = [['Roll', student.class_roll_no], ['Class', student.section.class.name], ['Section', student.section.name]]
  const quickLinks = [
    { name: 'Exam', src: "exam.svg", href: "/management/exam" },
    { name: 'Attendance', src: "attendance.svg", href: "/management/exam" },
    { name: 'Routine', src: "routine.svg", href: "/management/exam" },
    { name: 'Fees Collection', src: "fees_collection.svg", href: "/management/exam" }
  ]
  return (
    <>
      <Card sx={{ m: 4, borderRadius: 0.5 }}>
        <Grid container justifyContent='space-between' >
          <Grid item xs={8} p={2}>
            <Head name={name} extraInfo={extraInfo} />
          </Grid>
          <Grid item xs={4} position="relative" >
            {/* <Grid position="absolute"> */}
            <Image width={50} height={50} className=' absolute object-cover h-full w-full content-center ' src={'school_classroom.svg'} alt="classroom" />
            {/* </Grid> */}
            {/* <Image width={60} height={60} className=' absolute object-contain h-full w-full  ' src={'curve_circle.svg'} alt="classroom" /> */}
          </Grid>
        </Grid>
      </Card>

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
            <QuickLinkCards quickLinks={quickLinks} />

            {/* calander */}
            <Calander holidays={blockCount.holidays} />
          </Grid>
        </Grid>
      </Grid>

      {/* notice */}
      <Notice blockCount={blockCount} />
      <Footer />
    </>
  );
}






export default StudentDashboardReportsContent;
