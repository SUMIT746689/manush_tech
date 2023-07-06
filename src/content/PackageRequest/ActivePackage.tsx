import { useAuth } from '@/hooks/useAuth';
import { Card, DialogTitle, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

const ActivePackage = () => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();
  return (
    <Card sx={{height:'auto',md:{minHeight:315} }} >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Active Package')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to show active package')}
        </Typography>
      </DialogTitle>
      <Grid display={'grid'} padding={3} borderTop={1} gap={1} sx={{borderColor:'lightGray'}}>
        <Typography noWrap variant="h5">
          Name: {user?.school?.subscription[0]?.package?.title}
        </Typography>
        <Typography noWrap variant="h5">
          Start Date: {user?.school?.subscription[0]?.start_date &&
            dayjs(user?.school?.subscription[0]?.start_date).format('DD-MM-YYYY')}
        </Typography>
        <Typography
          noWrap
          variant="h5"
          color={
            user?.school?.subscription[0]?.end_date + 86400000 < new Date().getTime()
              ? 'red'
              : 'primary'
          }
        >
          End Date: {user?.school?.subscription[0]?.end_date &&
            dayjs(user?.school?.subscription[0]?.end_date).format('DD-MM-YYYY')}
        </Typography>
      </Grid>
    </Card>
  );
};

export default ActivePackage;
