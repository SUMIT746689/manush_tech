import { useAuth } from '@/hooks/useAuth';
import { Card, DialogTitle, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

const ActivePackage = ({ school }) => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth()
  console.log({user});
  
  return (
    <Card sx={{ height: 'auto', md: { minHeight: 315 } }} >
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
      <Grid display={'grid'} padding={3} borderTop={1} gap={1} sx={{ borderColor: 'lightGray' }}>

        <Typography noWrap variant="h5">
          {/* @ts-ignore */}
          Amount: {school?.package?.price}
        </Typography>
        <Typography noWrap variant="h5">
          {/* @ts-ignore */}
          Start Date: {school?.start_date && dayjs(school?.start_date).format('DD-MM-YYYY')}
        </Typography>
        <Typography
          noWrap
          variant="h5"
          color={
            // @ts-ignore
            school?.end_date + 86400000 < new Date().getTime()
              ? 'red'
              : 'primary'
          }
        >
          {/* @ts-ignore */}
          End Date: {school?.end_date && dayjs(school?.end_date).format('DD-MM-YYYY')}
        </Typography>
      </Grid>
    </Card>
  );
};

export default ActivePackage;
