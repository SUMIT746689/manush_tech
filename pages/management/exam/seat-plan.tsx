import Head from 'next/head';

import { useState, useEffect } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/SeatPlan/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid, Typography } from '@mui/material';
import Results from 'src/content/Management/SeatPlan/Results';
import axios from 'axios';

function Managementschools() {

    const [seatPlan, setSeatPlan] = useState([]);
    const [editSeatPlan, setEditSeatPlan] = useState(null);
    const [classList, setClassList] = useState([]);
    const [classes, setClasses] = useState([]);
   
    
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
                <title>Exam Seat Plan</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader
                    editExam={editSeatPlan}
                    setEditExam={setEditSeatPlan}
                    classList={classList}
                    classes={classes}
                    setSeatPlan={setSeatPlan}
                    seatPlan={seatPlan}
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
                        seatPlan={seatPlan}
                        setEditSeatPlan={setEditSeatPlan}
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
