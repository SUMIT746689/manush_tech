import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Button, ButtonGroup, Card, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import SmsPage from '@/content/BulkSmsAndEmail/SendSms/SmsPage';
import FileUploadSentSmsPage from '@/content/BulkSmsAndEmail/SendSms/FileUploadSentSms';
import { useState } from 'react';

const Packages = () => {
  const [type, setType] = useState("INDIVIDUAL_SMS")
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

            {type === "INDIVIDUAL_SMS" && <SmsPage />}
            {type === "GROUP_SMS" && <SmsPage />}
            {type === "FILE_UPLOAD" && < FileUploadSentSmsPage />}
          </Grid>

          <Grid width={400} mt={7} >
            <Card sx={{ padding: 2,height:'fit', fontWeight:600, fontSize:16, boxShadow:"inherit" }}>
              <Grid color="darkcyan">Masking Sms Count: </Grid>
              <Grid color="darkkhaki">Non Masking Sms Count:</Grid>
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
