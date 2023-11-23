import Head from 'next/head';

import { useState, useEffect } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/ExamTerm/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import Results from 'src/content/Management/ExamTerm/Results';
import { useClientDataFetch } from '@/hooks/useClientFetch';

function Managementschools() {

    const [editSeatPlan, setEditSeatPlan] = useState(null);
    // const [classes, setClasses] = useState([]);
    const { data: classes, reFetchData } = useClientDataFetch('/api/exam_terms')
    console.log({ classes });

    // useEffect(() => {
    //     axios.get(`/api/class`)
    //         .then(res => {
    //             setClasses(res.data)
    //             setClassList(res.data?.map(i => ({
    //                 label: i.name,
    //                 id: i.id,
    //                 has_section: i.has_section
    //             })
    //             ))
    //         })
    //         .catch(err => console.log(err));
    // }, [])

    return (
        <>
            <Head>
                <title>Exam Terms</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader
                    editRooms={editSeatPlan}
                    setEditRooms={setEditSeatPlan}
                    reFetchData={reFetchData}
                />
            </PageTitleWrapper>

            <Grid
                sx={{ px: { xs: 1, sm: 2 } }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
            >
                <Grid item xs={12}>
                    <Results
                        rooms={classes}
                        setEditRooms={setEditSeatPlan}
                        reFetchData={reFetchData}
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
