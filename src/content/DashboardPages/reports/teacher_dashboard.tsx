import Footer from 'src/components/Footer';
import { Box, Button, Card, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Block1 from 'src/content/Blocks/Statistics/Block3';
import { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Calander from '../calender/calander';
import Notice from '../notice/notice';
import Head from '../head/head';
import QuickLinkCards from '../quick_link_card/quickLinkCard';

function StudentDashboardReportsContent({ blockCount = null }) {
  const [holidays, setHolidays] = useState([]);
  const [dbBtN, setDbBtN] = useState(false)
  const { user } = useAuth();
  const { showNotification } = useNotistick();
  const { t }: { t: any } = useTranslation();

  // useEffect(() => {
  //   // @ts-ignore
  //   axios
  //     .get('/api/holidays')
  //     .then((res) => {
  //       // @ts-ignore
  //       if (user?.role?.title === "SUPER_ADMIN") {
  //         setHolidays(
  //           res?.data?.data.map((i) => {
  //             return {
  //               title: `${i?.school?.name} subscription ending`,
  //               date: dayjs(i.end_date).format('YYYY-MM-DD'),
  //             };
  //           })
  //         )
  //       } else {
  //         setHolidays(
  //           res?.data?.data.map((i) => {
  //             return {
  //               title: i.title,
  //               date: dayjs(i.date).format('YYYY-MM-DD')
  //             };
  //           })
  //         )
  //       }
  //       ;
  //     })
  //     .catch((err) => console.log(err));

  // }, []);


  // const handleDBbackup = () => {
  //   axios.post('/api/db_backup')
  //     .then(res => {
  //       showNotification(`${res?.data?.message}`)
  //       setDbBtN(true)
  //     })
  //     .catch(err => showNotification(`${err?.response?.data?.message}`, 'error'))
  // }
  const { teacher } = blockCount;
  const name = [teacher.first_name, teacher.middle_name, teacher.last_name].join(' ');
  const extraInfo = [['department',teacher.department.title]];
  const quickLinks = [
    { name: 'Exam', src: "exam.svg", href: "/management/exam" },
    { name: 'Class Attendance', src: "attendance.svg", href: "/management/exam" },
    { name: 'Routine', src: "routine.svg", href: "/management/exam" },
    { name: 'Exam Attendance', src: "exam_attendance.svg", href: "/management/exam" }
  ]

  return (
    <>
      <Card sx={{ m: 4, borderRadius: 0.5 }}>
        <Grid container justifyContent='space-between' >
          <Grid item xs={8} p={2}>
            <Head name={name} extraInfo={extraInfo}/>
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
          <Grid display="flex" gap={4} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* quick links */}
            <QuickLinkCards quickLinks={quickLinks} />

            {/* calander */}
            <Calander holidays={holidays} />
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
