import { useAuth } from '@/hooks/useAuth';
import { Card, DialogTitle, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

const ActivePackage = () => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();
  const { school } = user ?? {};
  const { masking_sms_price, non_masking_sms_price }: any = school;

  return (
    <Card sx={{ height: 'auto', md: { minHeight: 315 } }} >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Sms Status')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Below to show available sms')}
        </Typography>
      </DialogTitle>
      <Grid display={'grid'} padding={3} borderTop={1} gap={1} sx={{ borderColor: 'lightGray' }}>
        <Typography noWrap variant="h5">
          Masking Sms Count:-  {masking_sms_price}
        </Typography>
        <Typography noWrap variant="h5">
          Non-masking Sms Count:- {non_masking_sms_price}
        </Typography>
        {/* <Typography
          noWrap
          variant="h5"
          color={
            user?.school?.subscription[0]?.end_date + 86400000 < new Date().getTime()
              ? 'red'
              : 'primary'
          }
        >
          End Date: {user?.school?.subscription[0]?.end_date && dayjs(user?.school?.subscription[0]?.end_date).format('DD-MM-YYYY')}
        </Typography> */}
      </Grid>
    </Card>
  );
};

export default ActivePackage;
