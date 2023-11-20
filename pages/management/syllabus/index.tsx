import Head from 'next/head';

import { useState, useEffect, useRef } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Syllabus/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid, Typography } from '@mui/material';
import Results from 'src/content/Management/Syllabus/Results';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '@/hooks/useAuth';

function Managementschools() {
    const { user } = useAuth()
    const [syllabus, setSyllabus] = useState([]);

    const [editSyllabus, setEditSyllabus] = useState(null);
    const [classList, setClassList] = useState([]);
    const [classes, setClasses] = useState([]);

    //@ts-ignore
    const create_syllabus_permission = user?.permissions?.find(i => i?.value == 'create_syllabus')

    const seatPlanStickerRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => seatPlanStickerRef.current,
        // pageStyle: `@media print {
        //   @page {
        //     size: 210mm 115mm;
        //   }
        // }`
    });
    useEffect(() => {
        axios.get(`/api/class`)
            .then(res => {
                setClasses(res.data)
                setClassList(res.data?.map(i => ({
                    label: i.name,
                    id: i.id,
                    has_section: i.has_section
                })
                ))
            })
            .catch(err => console.log(err));

    }, [])

    return (
        <>
            <Head>
                <title>Syllabus</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader
                    editSyllabus={editSyllabus}
                    setEditSyllabus={setEditSyllabus}
                    classList={classList}
                    classes={classes}
                    setSyllabus={setSyllabus}
                    syllabus={syllabus}
                    create_syllabus_permission={create_syllabus_permission}

                />
            </PageTitleWrapper>

            <Grid
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
            >
                <Grid item xs={12}>
                    <Results
                        syllabus={syllabus}
                        setEditSyllabus={setEditSyllabus}
                        handlePrint={handlePrint}
                        create_syllabus_permission={create_syllabus_permission}
                    />
                </Grid>
            </Grid>
            <Footer />

        </>
    );
}

Managementschools.getLayout = (page) => (
    <Authenticated name="exam">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Managementschools;
