import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Box, Button, Card, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import Block1 from 'src/content/Blocks/Statistics/Block3';
import Block2 from 'src/content/Blocks/ListsLarge/Block8';
// import Block3 from 'src/content/Dashboards/Reports/Block3';
// import Block4 from 'src/content/Dashboards/Reports/Block4';
// import Block5 from 'src/content/Dashboards/Reports/Block5';
// import Block6 from 'src/content/Dashboards/Reports/Block6';
// import Block7 from 'src/content/Dashboards/Reports/Block7';
// import Block8 from 'src/content/Dashboards/Reports/Block8';
// import Block9 from 'src/content/Dashboards/Reports/Block9';
// import Block10 from 'src/content/Blocks/ListsSmall/Block7';
// import Block11 from 'src/content/Blocks/ListsSmall/Block8';
// import Block12 from 'src/content/Dashboards/Reports/Block12';
// import Block13 from 'src/content/Dashboards/Reports/Block13';
// import Demo from '../calender/demo';
import { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import DemoApp from '../calender/FullCalender/Demo';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

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

  return (
    <>
      <Card sx={{ m: 4, borderRadius: 0.5 }}>
        <Grid container justifyContent='space-between' >
          <Grid item xs={8} p={2}>
            <StudentHeader blockCount={blockCount} />
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
            {/* quick */}
            <Grid display="grid" gridTemplateColumns={'1fr 1fr'} justifyContent="center" gap={2} p={2} mx='auto' maxWidth={500} >
              <QuickLinkCards src="exam.svg" name="Exam" />
              <QuickLinkCards src="attendance.svg" name="Attendance" />
              <QuickLinkCards src="routine.svg" name="Routine" />
              <QuickLinkCards src="fees_collection.svg" name="Fees Collection" />
            </Grid>

            {/* calander */}
            <Calander holidays={holidays} />
          </Grid>
        </Grid>
      </Grid>

      {/* notice */}

      <Typography variant="h3" component="h3" pl={4} gutterBottom>
        {t('Notice')}
      </Typography>

      <Grid paddingX={4}>
        <TableContainer component={Paper} sx={{ borderRadius: 0.5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={false}
                    indeterminate={false}
                  // onChange={}
                  />
                </TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Footer />
    </>
  );
}

const Calander = ({ holidays }) => {
  return <Card sx={{ p: 0.5, borderRadius: 0.5 }}>
    <Grid
      item
      md={12}
      direction="row"
      //  justifyContent="flex-end"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '20%'
      }}
    >
      <FullCalendar
        // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventMaxStack={4}
        progressiveEventRendering={true}
        events={holidays}
      />

      {/* <DemoApp /> */}
    </Grid>
  </Card>
}

const StudentHeader = ({ blockCount }) => {

  const { t }: { t: any } = useTranslation();

  const { student } = blockCount;
  const name = [student.student_info.first_name, student.student_info.middle_name, student.student_info.last_name].join(' ');

  return (
    <Box
      display="grid"
      // alignItems={{ xs: 'stretch', md: 'center' }}
      // flexDirection={{ xs: 'column', md: 'row' }}
      // justifyContent="space-between"
      // backgroundColor={"red"}
      width="full"
      
    >

      {/* <AvatarPageTitle variant="rounded">
          <AddAlertTwoToneIcon fontSize="large" />
        </AvatarPageTitle> */}
      <Typography variant="h3" component="h3" gutterBottom>
        {t(`Welcome, ${name}`)}
      </Typography>


      <Grid className=' grid item grid-cols-2'>
        <Typography variant="h5" component="h5" gutterBottom>
          {t(`Roll: ${student.class_roll_no}`)}
        </Typography>

        <Typography variant="h5" component="h5" gutterBottom>
          {t(`Class: ${student.section.class.name}`)}
        </Typography>

        <Typography variant="h5" component="h5" gutterBottom>
          {t(`Section: ${student.section.name}`)}
        </Typography>

      </Grid>
    </Box>
  )
}
const QuickLinkCards = ({ src, name }) => {

  return (
    <Card
      sx={{ p: 2, fontWeight: 700, borderRadius: 0.5, textAlign: 'center', px: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}
    >
      <Image src={src} alt="exam" width={40} height={40} />
      {name}
    </Card>
  )
}


export default StudentDashboardReportsContent;
