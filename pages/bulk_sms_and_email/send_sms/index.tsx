import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Button, ButtonGroup, Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import SmsPage from '@/content/BulkSmsAndEmail/SendSms/SmsPage';
import FileUploadSentSmsPage from '@/content/BulkSmsAndEmail/SendSms/FileUploadSentSms';
import { useState } from 'react';

const Packages = () => {
  const [type, setType] = useState("SMS")
  return (
    <>
      <Head>
        <title>Send Sms</title>
      </Head>
      <PageBodyWrapper>
        <Grid
          // sx={{ display: 'flex', marginX: 'auto' }}
          // justifyContent="center"
          gap={2}
          px={1}
        >
          <Grid display="flex" justifyContent="center">
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              sx={{ borderRadius: 0.5, mt: 1 }}
            >
              <Button onClick={() => { setType("SMS") }} variant={type === "SMS" ? "contained" : "outlined"} sx={{ borderRadius: 0.5 }}> SENT SMS</Button>
              <Button onClick={() => { setType("UPLOAD_FILE") }} variant={type === "UPLOAD_FILE" ? "contained" : "outlined"} sx={{ borderRadius: 0.5 }}> UPLOAD FILE</Button>
            </ButtonGroup>
          </Grid>

          {type === "SMS" ?
            <SmsPage />
            :
            <FileUploadSentSmsPage />
          }
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
