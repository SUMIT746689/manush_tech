import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Button, ButtonGroup, Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import SmsPage from '@/content/BulkSmsAndEmail/SendSms/SmsPage';
import IndividualSmsPage from '@/content/BulkSmsAndEmail/SendSms/IndividualSmsPage';
import FileUploadSentSmsPage from '@/content/BulkSmsAndEmail/SendSms/FileUploadSentSms';
import { useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Packages = () => {
  const [type, setType] = useState("INDIVIDUAL_SMS");
  const { user } = useAuth();
  console.log({ user });
  const { school } = user || {};
  console.log({ school });

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
            <Grid display="flex" justifyContent="center">
              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                sx={{ borderRadius: 0.5, mt: 1 }}
              >
                <Button onClick={() => { setType("INDIVIDUAL_SMS") }} variant={type === "INDIVIDUAL_SMS" ? "contained" : "outlined"} sx={{ borderRadius: 0.5 }}> INDIVIDUAL SMS</Button>
                <Button onClick={() => { setType("GROUP_SMS") }} variant={type === "GROUP_SMS" ? "contained" : "outlined"} sx={{ borderRadius: 0.5 }}> GROUP SMS</Button>
                <Button onClick={() => { setType("FILE_UPLOAD") }} variant={type === "FILE_UPLOAD" ? "contained" : "outlined"} sx={{ borderRadius: 0.5 }}> FILE UPLOAD</Button>
              </ButtonGroup>
            </Grid>

            {type === "INDIVIDUAL_SMS" && <IndividualSmsPage />}
            {type === "GROUP_SMS" && <SmsPage />}
            {type === "FILE_UPLOAD" && < FileUploadSentSmsPage />}
          </Grid>

          <Grid width={400} mt={7} >
            <Card sx={{ padding: 2, height: 'fit', fontWeight: 600, fontSize: 16, borderRadius: 0.5 }}>
              <Grid color="darkcyan">Masking Sms Count: {school?.masking_sms_count} </Grid>
              <Grid color="darkkhaki">Non Masking Sms Count: {school?.non_masking_sms_count}</Grid>
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </PageBodyWrapper>
    </>
  );
};

Packages.getLayout = (page) => (
  <Authenticated >
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Packages;
