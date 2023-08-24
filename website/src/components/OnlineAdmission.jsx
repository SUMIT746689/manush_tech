'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import Steps from './admissionForm/Steps';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios';
import RegistrationFirstPart from './admissionForm/RegistrationFirstPart';
import RegistrationSecondPart from './admissionForm/RegistrationSecondPart';
import RegistrationThirdPart from './admissionForm/RegistrationThirdPart';
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useTranslation } from 'react-i18next';

const OnlineAdmission = ({ classes, academicYears, serverHost,school_id }) => {
    console.log("classes,academicYears__", classes, academicYears);
    const router = useRouter();
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const [totalFormData, setTotalFormData] = useState({});
    const [classesFlag, setClassesFlag] = useState(false);
    const registration3rdPart = useRef(null)
    const [marged, setMarged] = useState([]);
    console.log("marged__", marged);

    const central = useRef(null)
    const handleCreateClassClose = () => {

        router.push('/online-admission');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid py={8}>
                <h1 className=' text-center text-2xl'>Online Admission</h1>
                <br />
                <br />
                {
                    activeStep === 2 && <ReactToPrint
                        content={() => central.current}
                        onBeforeGetContent={() => setMarged(p => [...p, registration3rdPart.current])}
                        // pageStyle={`{ size: 2.5in 4in }`}
                        trigger={() => (
                            <Button
                                startIcon={<LocalPrintshopIcon />}
                                variant="contained" size='small'>
                                Preview and Print
                            </Button>
                        )}
                    />
                }

                <Grid>
                    <Steps activeStep={activeStep} setActiveStep={setActiveStep} />
                </Grid>
                <Grid container sx={{
                    px: '10%',
                    borderRadius: 1
                }}
                >
                    <Grid
                        sx={{
                            backgroundColor: 'white',
                            p: 2,
                            boxShadow: 3,
                            mt: 3
                        }}
                    >
                        {activeStep === 0 && (

                            <RegistrationFirstPart
                                setTotalFormData={setTotalFormData}
                                setActiveStep={setActiveStep}
                                handleCreateClassClose={handleCreateClassClose}
                                setMarged={setMarged}
                            />


                        )}
                        {activeStep === 1 && (
                            <RegistrationSecondPart
                                totalFormData={totalFormData}
                                setTotalFormData={setTotalFormData}
                                setActiveStep={setActiveStep}
                                handleCreateClassClose={handleCreateClassClose}
                                classes={classes}
                                academicYears={academicYears}
                                setMarged={setMarged}

                            />

                        )}
                        {activeStep === 2 && (

                            <RegistrationThirdPart
                                totalFormData={totalFormData}
                                setTotalFormData={setTotalFormData}
                                school_id={school_id}
                                setActiveStep={setActiveStep}
                                handleCreateClassClose={handleCreateClassClose}
                                setUsersFlag={setClassesFlag}
                                serverHost={serverHost}
                                setMarged={setMarged}
                                ref={registration3rdPart}
                            />

                        )}
                    </Grid>

                    {/* <Data ref={central}>{marged?.map(i=><React.Fragment>{i}</React.Fragment>)}</Data> */}
                    <Grid display={'none'}>
                        <Grid sx={{
                            p: 4
                        }} ref={central}>
                            <Typography fontSize={25} textAlign={'center'} pb={2}>{t('Admission Form')}</Typography>
                            {marged?.map(i => <div dangerouslySetInnerHTML={{ __html: i?.outerHTML }} />)}
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </LocalizationProvider>


    );
};

const Data = ({ children }) => {
    return <>{children}</>
}

export default OnlineAdmission;