import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import Results from 'src/content/Management/Attendence/Results';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { useState } from 'react';
import { fetchData } from '@/utils/post';
function Attendence() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSendSms = () => {
    // let url = new URL("http://localhost:3000/api/attendance/machine/send_sms_student");
    // if(selectedClass?.id) url.searchParams.set("class_id", selectedClass.id);
    // if(selectedSection?.id) url.searchParams.set("section_id", selectedSection.id);
    
    let url = `/api/attendance/machine/send_sms_student?`;
    if (selectedClass?.id) url += `class_id=${selectedClass.id}&`
    if (selectedSection?.id) url += `section_id=${selectedSection.id}`

    fetchData(url, "post", {})
      .then(response => console.log(response));
  }

  return (
    <>
      <Head>
        <title>Students Attendence</title>
      </Head>
      <PageTitleWrapper>
        <PageHeaderTitleWrapper
          name="Student Attendence"
          handleCreateClassOpen={true}
          actionButton={
            <Grid item minWidth={200} pt={1} >
              {
                selectedClass ?
                  <ButtonWrapper handleClick={handleSendSms}> + Send Sms (Selected Student) </ButtonWrapper>
                  :
                  <DisableButtonWrapper > + Send Sms (Selected Student) </DisableButtonWrapper>
              }
            </Grid>
          }
        />
        {/* <PageHeader title={'Students Attendence'} /> */}

      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results selectedClass={selectedClass} setSelectedClass={setSelectedClass} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Attendence.getLayout = (page) => (
  <Authenticated name="attendence">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Attendence;
