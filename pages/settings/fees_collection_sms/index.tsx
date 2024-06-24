import * as React from 'react';
import Head from 'next/head';
import PageBodyWrapper from '@/components/PageBodyWrapper';
import StudentAutoSentSms from '@/content/Management/FeesCollectionSms/default';
import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';

function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Head>
                <title>Fees Collection Sms Settings</title>
            </Head>
            <PageBodyWrapper>
                <StudentAutoSentSms />
            </PageBodyWrapper>
        </>
    );
}

BasicTabs.getLayout = (page) => (
    <Authenticated requiredPermissions={['modify_student_auto_sent_sms']}>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);


export default BasicTabs