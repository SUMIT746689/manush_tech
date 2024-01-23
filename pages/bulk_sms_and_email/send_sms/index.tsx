import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import SmsPage from '@/content/BulkSmsAndEmail/SendSms/SmsPage';
import IndividualSmsPage from '@/content/BulkSmsAndEmail/SendSms/IndividualSmsPage';
import FileUploadSentSmsPage from '@/content/BulkSmsAndEmail/SendSms/FileUploadSentSms';
import { useAuth } from '@/hooks/useAuth';
import { BasicTabWrapper } from '@/components/Tab/Tab';
import { useClientDataFetch } from '@/hooks/useClientFetch';
import { formatNumber } from '@/utils/numberFormat';

const colorBlue = "#0052B4"

const Packages = () => {
  const { data: sms_gateway } = useClientDataFetch('/api/sms_gateways?is_active=true');

  return (
    <>
      <Head>
        <title>Send Sms</title>
      </Head>
      <PageBodyWrapper>
        <Grid display="flex" gap={2} p={{ xs: 2, sm: 3 }}>
          <Grid
            // sx={{ display: 'flex', marginX: 'auto' }}
            // justifyContent="center"
            gap={2}
            width="100%"
          >
            {sms_gateway && <BasicTabWrapper items={[
              {
                label: "INDIVIDUAL SMS", value:
                  <SendSmsWrapper>
                    <IndividualSmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                    <SmsQuantityCard />
                  </SendSmsWrapper>
              },
              {
                label: "GROUP SMS", value:
                  <SendSmsWrapper>
                    <SmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                    <SmsQuantityCard />
                  </SendSmsWrapper>
              },
              {
                label: "FILE UPLOAD", value:
                  <SendSmsWrapper>
                    <FileUploadSentSmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                    <SmsQuantityCard />
                  </SendSmsWrapper>
              }
            ]} />
            }
          </Grid>


        </Grid>
        <Footer />
      </PageBodyWrapper >
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;

const SmsQuantityCard = () => {
  const { user } = useAuth();
  const { school } = user || {};
  return (
    <Card sx={{ color: colorBlue, px: 3, py: 4.5, minWidth: 400, mt: 1, mb: 'auto' }}>
      <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700, textAlign: "center" }}>SMS QUANTITY</Grid>
      <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between', pt: 3, pb: 2 }}>
        <span>Masking Sms:</span>
        <span>{school?.masking_sms_count ? formatNumber(school?.masking_sms_count) : 0}</span>
      </Grid>
      <Grid sx={{ fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span>Non Masking Sms:</span>
        <span>{school?.non_masking_sms_count ? formatNumber(school?.non_masking_sms_count) : 0}</span>
      </Grid>
    </Card>
  )
}

const SendSmsWrapper = ({ children }) => {
  return (
    <Grid display="flex" columnGap={1}>
      {children}
    </Grid>
  )
} 