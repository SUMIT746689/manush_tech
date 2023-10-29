import { useAuth } from '@/hooks/useAuth';
import { Card, DialogTitle, Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

const ActivePackage = () => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();
  const { school } = user ?? {};
  const { sms_masking_price, sms_non_masking_price, masking_sms_count, non_masking_sms_count }: any = school ?? {};

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
        <Typography noWrap variant="h5" color="darkcyan">
          <span style={{ fontSize: 13 }}>Masking Price: {sms_masking_price}</span>
          <br />
          Masking Sms Count: {masking_sms_count || 0}
        </Typography>
        <Typography noWrap variant="h5" color="darkmagenta">
          <span style={{ fontSize: 13 }}>Non-masking Price: {sms_non_masking_price}</span>
          <br />
          Non-masking Sms Count: {non_masking_sms_count || 0}
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
