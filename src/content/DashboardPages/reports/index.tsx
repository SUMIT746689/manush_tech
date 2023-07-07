import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Box, Button, Card, Grid, Typography } from '@mui/material';

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

function DashboardReportsContent({ blockCount = null }) {
  const [holidays, setHolidays] = useState([]);
  const [dbBtN, setDbBtN] = useState(false)
  const { user } = useAuth();
  const { showNotification } = useNotistick()

  useEffect(() => {
    // @ts-ignore
    axios
      .get('/api/holidays')
      .then((res) => {
        // @ts-ignore
        if (user?.role?.title === "SUPER_ADMIN") {
          setHolidays(
            res?.data?.data.map((i) => {
              return {
                title: `${i?.school?.name} subscription ending`,
                date: dayjs(i.end_date).format('YYYY-MM-DD'),
              };
            })
          )
        } else {
          setHolidays(
            res?.data?.data.map((i) => {
              return {
                title: i.title,
                date: dayjs(i.date).format('YYYY-MM-DD')
              };
            })
          )
        }
        ;
      })
      .catch((err) => console.log(err));


  }, []);


  const handleDBbackup = () => {
    axios.post('/api/db_backup')
      .then(res => {
        showNotification(`${res?.data?.message}`)
        setDbBtN(true)
      })
      .catch(err => showNotification(`${err?.response?.data?.message}`, 'error'))
  }

  return (
    <>
      <PageTitleWrapper>

        <Grid container justifyContent='space-between'>
          <Grid item>
            <PageHeader />

            <StudentHeader />
          </Grid>
          <Grid item>
            <Button disabled={dbBtN} onClick={handleDBbackup} variant='contained' >
              Database backup
            </Button>
          </Grid>

        </Grid>
      </PageTitleWrapper>
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
          {/* <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <Block2 />
            </Grid>
            <Grid item xs={12}>
              <Block4 />
            </Grid>
          </Grid> */}
          {/* </Grid>
          <Grid item md={5} xs={12}>
          <Block3 /> */}

          {/* <Demo /> */}
          {
            blockCount.role === "student" &&
            <Grid display="flex" gap={4} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
              {/* quick */}
              <Grid display="grid" gridTemplateColumns={'1fr 1fr'} justifyContent="center" gap={2} p={2} mx='auto' maxWidth={500} >
                <QuickLinkCards src="exam.svg" name="Exam" />
                <QuickLinkCards src="attendance.svg" name="Attendance" />
                <QuickLinkCards src="routine.svg" name="Routine" />
                <QuickLinkCards src="fees_collection.svg" name="Fees Collection" />
              </Grid>

              {/* calander */}
              <Card sx={{ p: 0.5, borderRadius: 0.5 }}>
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
                      // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                      right: 'dayGridMonth'
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventMaxStack={4}
                    progressiveEventRendering={true}
                    // weekends={false}

                    // hiddenDays={[5]}

                    // events={[
                    //   { title: 'event 1', date: '2023-03-07' },
                    //   { title: 'event 2', date: '2023-03-02' }
                    // ]}
                    events={holidays}

                  // events={[
                  //   {
                  //     title: 'class-5 Exam',
                  //     start: '2023-03-02',
                  //     end: '2023-03-07'
                  //   },
                  //   {
                  //     title: 'class-6 Exam',
                  //     start: '2023-03-02',
                  //     end: '2023-03-07'
                  //   },
                  //   {
                  //     title: 'class-7 Exam',
                  //     start: '2023-03-14',
                  //     end: '2023-03-21'
                  //   },
                  // ]}
                  />

                  {/* <DemoApp /> */}
                </Grid>
              </Card>
            </Grid>
          }

        </Grid>
        {/* <Grid item xs={12}>
          <Block5 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block6 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block7 />
        </Grid>
        <Grid item md={5} xs={12}>
          <Block8 />
        </Grid>
        <Grid item md={7} xs={12}>
          <Block9 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block10 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block11 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block12 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block13 />
        </Grid>*/}
      </Grid>

      <Footer />
    </>
  );
}

const StudentHeader = (name) => {
  return (
    <Box
      display="flex"
      alignItems={{ xs: 'stretch', md: 'center' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center">
        {/* <AvatarPageTitle variant="rounded">
          <AddAlertTwoToneIcon fontSize="large" />
        </AvatarPageTitle> */}
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            {/* {t('Dashboard')} */}
          </Typography>
        </Box>
      </Box>

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


export default DashboardReportsContent;
