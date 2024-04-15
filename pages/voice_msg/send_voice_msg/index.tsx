import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Card, Divider, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useAuth } from '@/hooks/useAuth';
import { BasicTabWrapper } from '@/components/Tab/Tab';
import { useClientDataFetch } from '@/hooks/useClientFetch';
import VoiceRecipient from '@/content/VoiceMsg/SendVoiceMsg/VoiceRecipient';
import GroupContact from '@/content/VoiceMsg/SendVoiceMsg/GroupContact';
import FileUpload from '@/content/VoiceMsg/SendVoiceMsg/FileUpload';
import { formatNumber } from '@/utils/numberFormat';

const colorBlue = "#0052B4"

const VoiceMsg = () => {
  const { data: gateways } = useClientDataFetch('/api/voice_msgs/gateways');
  const { data: templates } = useClientDataFetch('/api/voice_msgs/templates');
  return (
    <>
      <Head>
        <title>Send Voice SMS</title>
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
                        <NoOfVoiceSms />
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
                        <NoOfVoiceSms />
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
                        <NoOfVoiceSms />
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
  <Authenticated requiredPermissions={["send_voice_sms"]} >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

const AvailableBalance = () => {
  const { user } = useAuth();
  const { school } = user || {};
  console.log({ school });
  const { voice_sms_balance }: any = school || {};
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mt: 1, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>Available Balance</Grid>
      <Divider />
      <Grid sx={{ pt: 1, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span>BDT:</span>
        <span>{voice_sms_balance ? formatNumber(voice_sms_balance) : 0}</span>
      </Grid>
    </Card>
  )
}

const VoicePrice = () => {
  const { user } = useAuth();
  const { school } = user || {};
  const { voice_pulse_size, voice_sms_balance, voice_sms_price }: any = school || {};

  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>Voice Price</Grid>
      <Divider />
      <Grid sx={{ pt: 1, fontSize: 14, display: "flex", justifyContent: "space-between", textAlign: 'justify' }}>
        <span>BDT:</span>
        <Typography>{voice_sms_price}</Typography>
      </Grid>
    </Card>
  )
}

const NoOfVoiceSms = () => {
  const { user } = useAuth();
  const { school } = user || {};
  const { voice_pulse_size, voice_sms_balance, voice_sms_price }: any = school || {};

  return (
    <>
      {/* <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>Available No Of Voice Sms</Grid>
      <Divider />
      <Typography justifyContent="center">{voice_sms_price}</Typography>
    </Card> */}
    </>
  )
}

const SendSmsWrapper = ({ children }) => {
  return (
    <Grid display="flex" columnGap={1}>
      {children}
    </Grid>
  )
} 

export default VoiceMsg;
