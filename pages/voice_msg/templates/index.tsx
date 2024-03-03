import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageHeader from '@/content/VoiceMsg/Template/PageHeader';
import Results from '@/content/VoiceMsg/Template/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import { useState } from 'react';
import PageTitleWrapper from '@/components/PageTitleWrapper';

const VoiceSmsTemplates = () => {
    const [editData, setEditData] = useState();
    const { data: packages, reFetchData } = useClientFetch('/api/voice_msgs/templates');
    return (
        <>
            <Head>
                <title>Voice Template</title>
            </Head>
            <PageBodyWrapper>
                <Grid
                    // sx={{ display: 'flex', marginX: 'auto' }}
                    // justifyContent="center"
                    gap={2}
                    px={1}
                >
                    <PageTitleWrapper>
                        <PageHeader
                            editData={editData}
                            setEditData={setEditData}
                            reFetchData={reFetchData}
                        />
                    </PageTitleWrapper>

                    <Results
                        datas={packages?.data || []}
                        setEditData={setEditData}
                    />
                </Grid>
                <Footer />
            </PageBodyWrapper>
        </>
    );
};

VoiceSmsTemplates.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default VoiceSmsTemplates;
