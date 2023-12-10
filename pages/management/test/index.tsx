import { useEffect, useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Users/PageHeader';
import Footer from 'src/components/Footer';
import { Button, Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Users/Results';
import { useClientFetch } from '@/hooks/useClientFetch';
import axios from 'axios';
import { useRouter } from 'next/router';
import useNotistick from '@/hooks/useNotistick';

function ManagementUsers() {
    const router = useRouter()
    const { showNotification } = useNotistick();
    const handleClick = async () => {

        try {
            const { data } = await axios.post('/api/bkash/create-payment')
            console.log({ data });

            router.push(data.bkashURL)
        } catch (err) {
            showNotification(err?.response?.data?.message, 'error')
            console.log(err);

        }
    }
    if (router.query?.message) {
        router.query?.message == 'success' ? showNotification(router.query?.message) : showNotification(router.query?.message,'error')
    }

    return (
        <>
            <Button variant='contained' onClick={handleClick}>hit</Button>
        </>
    );
}

ManagementUsers.getLayout = (page) => (
    <Authenticated name="user">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default ManagementUsers;
