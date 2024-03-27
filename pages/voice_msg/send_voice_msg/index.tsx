import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useAuth } from '@/hooks/useAuth';
import { BasicTabWrapper } from '@/components/Tab/Tab';
import { useClientDataFetch } from '@/hooks/useClientFetch';
import VoiceRecipient from '@/content/VoiceMsg/SendVoiceMsg/VoiceRecipient';
import GroupContact from '@/content/VoiceMsg/SendVoiceMsg/GroupContact';
import FileUpload from '@/content/VoiceMsg/SendVoiceMsg/FileUpload';

const colorBlue = "#0052B4"

const VoiceMsg = () => {
  const { data: gateways } = useClientDataFetch('/api/voice_msgs/gateways');
  const { data: templates } = useClientDataFetch('/api/voice_msgs/templates');
  return (
    <>
      <Head>
        <title>Send Sms</title>
      </Head>
      <PageBodyWrapper>
        <Grid display="flex" gap={2} py={{ xs: 2, sm: 3 }} px={0.5}>
          <Grid
            // sx={{ display: 'flex', marginX: 'auto' }}
            // justifyContent="center"
            gap={2}
            width="100%"
          >
            {
              gateways && <BasicTabWrapper items={[
                {
                  label: "VOICE RECIPIENT", value:
                    <SendSmsWrapper>
                      <VoiceRecipient gateways={(gateways && Array.isArray(gateways)) ? gateways[0] : null} templates={(gateways && Array.isArray(gateways)) ? templates : []} />
                      <Grid maxWidth={350} display="grid" alignContent="flex-start" rowGap={1} >
                        <AvailableBalance />
                        <VoicePrice />
                      </Grid>
                    </SendSmsWrapper>
                },
                {
                  label: "GROUP CONTACT", value:
                    <SendSmsWrapper>
                      <GroupContact gateways={(gateways && Array.isArray(gateways)) ? gateways[0] : null} />
                      <Grid maxWidth={350} display="grid" alignContent="flex-start" rowGap={1} >
                        <AvailableBalance />
                        <VoicePrice />
                      </Grid>
                    </SendSmsWrapper>
                },
                {
                  label: "FILE UPLOAD", value:
                    <SendSmsWrapper>
                      <FileUpload sms_gateway={(gateways && Array.isArray(gateways)) ? gateways[0] : null} />
                      <Grid maxWidth={350} display="grid" alignContent="flex-start" rowGap={1} >
                        <AvailableBalance />
                        <VoicePrice />
                      </Grid>
                    </SendSmsWrapper>
                },

              ]} />
            }
          </Grid>


        </Grid>
        <Footer />
      </PageBodyWrapper >
    </>
  );
};

VoiceMsg.getLayout = (page) => (
  <Authenticated >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default VoiceMsg;

const AvailableBalance = () => {
  const { user } = useAuth();
  const { school } = user || {};
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mt: 1, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>Available Balance</Grid>
      <Grid sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span>BDT:</span>
        {/* <span>{school?.non_masking_sms_count ? formatNumber(school?.non_masking_sms_count) : 0}</span> */}
        <span></span>
      </Grid>
    </Card>
  )
}

const VoicePrice = () => {
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>VOICE PRICE</Grid>
      <Grid sx={{ fontSize: 14, pt: 2, textAlign: 'justify' }}>
        {/* Disabled */}
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