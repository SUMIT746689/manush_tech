import { useAuth } from '@/hooks/useAuth';
import { formatNumber } from '@/utils/numberFormat';
import { Card, DialogTitle, Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

const ActivePackage = () => {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();
  const { school } = user ?? {};
  const { masking_sms_price, non_masking_sms_price, masking_sms_count, non_masking_sms_count, currency }: any = school ?? {};

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

        <Typography variant="h5" gutterBottom mx="auto">
          {t('SMS PRICE')}
        </Typography>

        <Typography noWrap variant="h5" color="darkcyan">
          <TextWrapper>Masking Price: <span>{masking_sms_price || 0} {currency}</span></TextWrapper>
        </Typography>
        <Typography noWrap variant="h5" color="darkmagenta">
          <TextWrapper>Non-masking Price: <span>{non_masking_sms_price || 0} {currency}</span></TextWrapper>
        </Typography>
      </Grid>

      <Grid display={'grid'} padding={3} borderTop={1} gap={1} sx={{ borderColor: 'lightGray' }}>
        <Typography variant="h5" gutterBottom mx="auto">
          {t('SMS QUANTITY')}
        </Typography>
        <Typography noWrap variant="h5" color="darkcyan">
          <TextWrapper>Masking Sms: <span>{masking_sms_count ? formatNumber(masking_sms_count) : 0}</span></TextWrapper>
        </Typography>
        <Typography noWrap variant="h5" color="darkmagenta">
          <TextWrapper>Non-masking Sms: <span>{non_masking_sms_count ? formatNumber(non_masking_sms_count) : 0}</span></TextWrapper>
        </Typography>
      </Grid>
    </Card>
  );
};

export default ActivePackage;

const TextWrapper = ({ children }) => {
  return (
    <span style={{ fontSize: 14, display: "flex", justifyContent: "space-between" }}>
      {children}
    </span>
  )
}