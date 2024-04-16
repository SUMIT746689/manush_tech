import { Authenticated } from '@/components/Authenticated';
import Footer from '@/components/Footer';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import PageHeader from '@/content/VoiceSmsGateways/PageHeader';
import Results from '@/content/VoiceSmsGateways/Results';
import { useClientDataFetch, useClientFetch } from '@/hooks/useClientFetch';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';

const SmsGateways = () => {

    const [editData, setEditData] = useState<any>(null);
    const { data, reFetchData } = useClientDataFetch('/api/voice_msgs/gateways?for_all=true');
    const { data: schools } = useClientFetch('/api/school/search_schools');

    return (
        <>
            <Head>
                <title>Voice SMS Gateways - Management</title>
            </Head>
            <PageTitleWrapper>
                {/* @ts-ignore */}
                <PageHeader
                    // name="All Sms Gateways"
                    schools={schools ? schools.map(school => ({ id: school.id, label: school.name })) : []}
                    editData={editData}
                    seteditData={setEditData}
                    reFetchData={reFetchData}
                />
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
                    <Results sessions={data} setEditData={setEditData} reFetchData={reFetchData} />
                </Grid>
            </Grid>
            <Footer />
        </>
    );
};

SmsGateways.getLayout = (page) => {
    return (
        <Authenticated requiredPermissions={['create_voice_sms_gateway', 'show_voice_sms_gateway']}>
            <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
        </Authenticated>
    );
};

export default SmsGateways;