import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import {Button, Grid} from '@mui/material';

import Block1 from 'src/content/Blocks/Statistics/Block3';
import { useState } from 'react';

import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import Calander from '../calender/calander';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

function DashboardReportsContent({ blockCount = null }) {
 
  const [dbBtN, setDbBtN] = useState(false)
  const { user } = useAuth();
  const { showNotification } = useNotistick()
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
          </Grid>
          <Grid item>


            <Grid container gap={10}>
              {
                // @ts-ignore
                user?.role?.title === "ADMIN" && <Button variant='contained' color='secondary'>

                  <Link href={`http://192.168.10.29:3001`} color="primary" rel="noopener noreferrer" >
                    {t('Front end link')}
                  </Link>
                </Button>
              }
              {
                // @ts-ignore
                user?.role?.title === "SUPER_ADMIN" && <Button disabled={dbBtN} onClick={handleDBbackup} variant='contained'  sx={{borderRadius:0.5}} >
                  Database backup
                </Button>
              }
            </Grid>
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
          {/* <Demo /> */}
          <Calander holidays={blockCount.holidays} />
        </Grid>


      </Grid>

      <Footer />
    </>
  );
}

export default DashboardReportsContent;
