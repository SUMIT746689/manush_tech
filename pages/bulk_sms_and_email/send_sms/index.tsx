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
        <Grid display="flex" gap={2} py={{ xs: 2, sm: 3 }} px={0.5}>
          <Grid
            // sx={{ display: 'flex', marginX: 'auto' }}
            // justifyContent="center"
            gap={2}
            width="100%"
          >
            {
              sms_gateway && <BasicTabWrapper items={[
                {
                  label: "INDIVIDUAL SMS", value:
                    <SendSmsWrapper>
                      <IndividualSmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                      <Grid maxWidth={350} display="grid" rowGap={1} >
                        <SmsQuantityCard />
                        <SmsNoticeCard />
                        <SmsRecipientCard />
                        <SmsContentInfoCard />
                      </Grid>
                    </SendSmsWrapper>
                },
                {
                  label: "GROUP SMS", value:
                    <SendSmsWrapper>
                      <SmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                      <Grid maxWidth={350} display="grid" rowGap={1} >
                        <SmsQuantityCard />
                        <SmsNoticeCard />
                        <SmsRecipientCard />
                        <SmsContentInfoCard />
                      </Grid>
                    </SendSmsWrapper>
                },
                {
                  label: "FILE UPLOAD", value:
                    <SendSmsWrapper>
                      <FileUploadSentSmsPage sms_gateway={(sms_gateway && Array.isArray(sms_gateway)) ? sms_gateway[0] : null} />
                      <Grid maxWidth={350} display="grid" rowGap={1} >
                        <SmsQuantityCard />
                        <SmsNoticeCard />
                        <SmsRecipientCard />
                        <SmsContentInfoCard />
                      </Grid>
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
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mt: 1, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>SMS QUANTITY</Grid>
      <Grid sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', pt: 2 }}>
        <span>Masking Sms:</span>
        <span>{school?.masking_sms_count ? formatNumber(school?.masking_sms_count) : 0}</span>
      </Grid>
      <Grid sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span>Non Masking Sms:</span>
        <span>{school?.non_masking_sms_count ? formatNumber(school?.non_masking_sms_count) : 0}</span>
      </Grid>
    </Card>
  )
}

const SmsNoticeCard = () => {
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>নোটিশ</Grid>
      <Grid sx={{ fontSize: 14, pt: 2, textAlign: 'justify' }}>
        সকল ধরণের প্রোমোশনাল/ গ্রিটিংস এসএমএস অবশ্যই বাংলায় ( ইউনিকোড) হতে হবে। শুধুমাত্র মেশিন জেনারেটেড এসএমএস / নোটিফিকেশন ( উদাহরণঃ এটিএম কার্ড OTP ) ,ছাড়া সব ধরণের এসএমএস অবশ্যই বাংলা ( ইউনিকোড) ব্যবহার করতে আহবান এবং সতর্ক করা হচ্ছে। অন্যথায় একাউন্ট স্থগিত হবে এবং ইউজার/গ্রাহক/ক্লায়েন্ট এর দায়ভার বহন করবেন। ধন্যবাদ।
      </Grid>
    </Card>
  )
}

const SmsRecipientCard = () => {
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>SMS RECIPIENT</Grid>
      <Grid sx={{ fontSize: 14, pt: 2, textAlign: 'justify' }}>
        Before doing any campaign we recommend you to do a testing with the sender id to your number to ensure the sender id and SMS content is working fine.
      </Grid>
    </Card>
  )
}


const SmsContentInfoCard = () => {
  return (
    <Card sx={{ boxShadow: 3, color: colorBlue, bgcolor: '#e0e7ff', p: 3, minWidth: { xs: 'fit-content', md: 350 }, mb: 'auto', borderRadius: 0.5 }}>
      <Grid sx={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>SMS CONTENT</Grid>
      <Grid sx={{ fontSize: 14, pt: 2, textAlign: 'justify' }}>
        * 160 Characters are counted as 1 SMS in case of English language & 70 in other language.
      </Grid>
      <Grid sx={{ fontSize: 14, textAlign: 'justify' }}>
        * One simple text message containing extended GSM character set <mark><b>(~^{ }[]\|)</b></mark> is of 70 characters long. Check your SMS count before pushing SMS.
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