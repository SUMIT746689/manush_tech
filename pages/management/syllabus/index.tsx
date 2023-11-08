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

function Managementschools() {

    const [syllabus, setSyllabus] = useState([]);
    
    const [editSyllabus, setEditSyllabus] = useState(null);
    const [classList, setClassList] = useState([]);
    const [classes, setClasses] = useState([]);
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
                    />
                </Grid>
            </Grid>
            <Footer />
            {/* <Grid display={'none'}>
                <Grid ref={seatPlanStickerRef} container gap={1.5} sx={{
                    p: 1.5,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',

                }}>
                    {
                        seatPlanSticker?.map(i => (<Grid sx={{
                            p: 3,
                            // boxShadow:'0px 10px 10px #86b2f9'
                            border: '1.5px dotted',

                        }}>
                            <Typography align='center' pb={2} variant="h3">{[i.student_info.first_name, i.student_info.middle_name, i.student_info.last_name].join(' ')}</Typography>
                            <Grid sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                fontSize: '50px'
                            }}>
                                <Typography align='center' variant="h4"> Registration no: {i.class_registration_no}</Typography>
                                <Typography align='center' variant="h4"> Roll no: {i.class_roll_no}</Typography>
                                <Typography align='center' variant="h4"> Class: {i.section.class.name}</Typography>
                                <Typography align='center' variant="h4"> Section: {i.section.name}</Typography>
                            </Grid>
                        </Grid>))
                    }

                </Grid>
            </Grid> */}

        </>
    );
}

Managementschools.getLayout = (page) => (
    <Authenticated name="exam">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Managementschools;
