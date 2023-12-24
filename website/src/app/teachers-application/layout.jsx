"use client"
import Head from 'next/head';
// import { headers } from 'next/headers';
import { SnackbarProvider } from 'notistack';
import React from 'react';

export default async function RootLayout({ children }) {


    return (
        <SnackbarProvider
            maxSnack={6}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        >
            {children}
        </SnackbarProvider>

    );




}
