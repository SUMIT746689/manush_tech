import {
    Autocomplete,
    Box,
    Card,
    Grid,
    Divider,
    TextField,
    Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

import dayjs, { Dayjs } from 'dayjs';


import useNotistick from '@/hooks/useNotistick';

const tableStyle :  object = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    minWidth: '70px',
    textAlign: 'center',
    // backgroundColor: '#cccccc'
};

import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Attendence/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ReactToPrint from 'react-to-print';
import { MobileDatePicker } from '@mui/lab';
function Attendence() {
    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();
    const [targetRoleEmployees, setTargetRoleEmployees] = useState(null);
    const [students, setStudents] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
    const [roleList, setRoleList] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const { user } = useAuth();

    const attendenceRef = useRef();

    useEffect(() => {
        axios.get(`/api/role`)
          .then(res => setRoleList(res.data))
          .catch(err => console.log(err))
      }, [])

    const handleReportGenerate = async () => {
        try {
            if (selectedRole && selectedDate && academicYear && user) {
                const response = await axios.get(`/api/attendance/employee?school_id=${user?.school_id}&role_id=${selectedRole?.id}&from_date=${selectedDate.slice(0, -2) + '01'}&to_date=${selectedDate.slice(0, -2) + '31'}`)

                if (response.data.length < 1) {
                    throw new Error('Attendence not taken!')
                }
                const res = await axios.get(`/api/role/${selectedRole?.label}?school_id=${user?.school_id}`)

                setTargetRoleEmployees(
                    res.data.map((i) => {
                        const middle_name = i?.middle_name;
                        const last_name = i?.last_name;
                        return {
                            user_id: i.user_id,
                            name: i.first_name + (middle_name ? ` ${middle_name}` : '') + (last_name ? ` ${last_name}` : '')
                        };
                    })
                );

                const montAttendence = Array.from({ length: 33 }, (_, j) => {
                    if (j == 0) return 'name';
                    else if (j == 1) return 'user Id';
                    else
                        return {
                            dayNumber: j - 1,
                            user_id_list: []
                        };
                });

                for (const i of response.data) {
                    const temp_date = new Date(i.date).getUTCDate();
                    // @ts-ignore
                    montAttendence[(temp_date < 1 ? 1 : temp_date) + 1]?.user_id_list.push({
                        user_id: i.user_id,
                        status: i.status,
                        remark: i.remark
                    });
                }
                console.log('montAttendence__', montAttendence);
                setStudents(montAttendence);

            }
        } catch (err) {
            setStudents(null);
            setTargetRoleEmployees(null);
            console.log(err);
            // showNotification(err.message, 'error')
            showNotification(err?.response?.data?.message || err?.message, 'error');
        }

    };
    return (
        <>
            <Head>
                <title>Employee Attendence</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Employee Attendence'} />
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
                    <Card
                        sx={{
                            p: 1,
                            mb: 3
                        }}
                    >
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={6} sm={4} md={3}>
                                <Box p={1}>
                                    
                                        <MobileDatePicker
                                            label="Select Date"
                                            views={['year', 'month']}
                                            value={selectedDate}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    console.log(
                                                        newValue,
                                                        dayjs(newValue).format('YYYY-MM-DD')
                                                    );

                                                    setSelectedDate(dayjs(newValue).format('YYYY-MM-DD'));
                                                } else {
                                                    setSelectedDate(null);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField fullWidth {...params} />
                                            )}
                                        />
                                   
                                </Box>
                            </Grid>

                            {selectedDate && (
                                <Grid item xs={6} sm={4} md={3}>
                                    <Box p={1}>

                                        <Autocomplete
                                            sx={{
                                                m: 0
                                            }}
                                            limitTags={2}
                                            // getOptionLabel={(option) => option.id}
                                            options={roleList.map(i => {
                                                return {
                                                    label: i.title,
                                                    id: i.id,
                                                }
                                            })}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="outlined"
                                                    label={t('Select Role')}
                                                    placeholder={t('Role...')}
                                                />
                                            )}
                                            onChange={(e, v) => setSelectedRole(v ? v : null)}
                                        />

                                    </Box>
                                </Grid>
                            )}

                            
                            {user && selectedRole && academicYear && (
                                <>
                                    <Grid item >

                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleReportGenerate()}
                                        >
                                            Generate
                                        </Button>

                                    </Grid>
                                    {
                                        students &&
                                        <Grid item >

                                            <ReactToPrint
                                                content={() => attendenceRef.current}
                                                // pageStyle={`{ size: 2.5in 4in }`}
                                                trigger={() => (
                                                    <Button variant="contained" size='small'>
                                                        Print report
                                                    </Button>
                                                )}
                                            />

                                        </Grid>
                                    }
                                </>

                            )}

                        </Grid>
                    </Card>
                    <Divider />
                    <Grid
                        sx={{
                            maxHeight: 'calc(100vh - 450px) !important',
                            minHeight: 'calc(100vh - 450px) !important',

                            overflowX: 'auto',
                            overflowY: 'auto'
                        }}
                        justifyContent={'flex-end'}
                    >
                        {
                            targetRoleEmployees && students && <div ref={attendenceRef}>

                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            {[-1, ...Array(32).keys()].map((i) => (
                                                <th style={tableStyle}>
                                                    {i > 1 ? i : i == -1 ? 'Name' : i == 0 ? 'User Id' : i}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody style={{
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                                    }}>
                                        {targetRoleEmployees?.map((i) => {
                                            return (
                                                <tr>
                                                    {students?.map((j) => {
                                                        //  console.log(i.student_id," YY ",j.student_id)
                                                        if (j.user_id_list) {
                                                            const found = j.user_id_list.find(
                                                                (st) => st.user_id == i.user_id
                                                            );

                                                            if (found) {
                                                                return (
                                                                    <td
                                                                        style={
                                                                            found.status == 'absent'
                                                                                ? {
                                                                                    ...tableStyle,
                                                                                    backgroundColor: 'red',
                                                                                    color: 'white'
                                                                                }
                                                                                : found.status == 'late'
                                                                                    ? {
                                                                                        ...tableStyle,
                                                                                        backgroundColor: 'yellow',
                                                                                        color: 'black'
                                                                                    }
                                                                                    : found.status == 'bunk'
                                                                                        ? {
                                                                                            ...tableStyle,
                                                                                            backgroundColor: 'blue',
                                                                                            color: 'white'
                                                                                        }
                                                                                        : {
                                                                                            ...tableStyle,
                                                                                            backgroundColor: 'green',
                                                                                            color: 'white'
                                                                                        }
                                                                        }
                                                                    >
                                                                        {found.status}
                                                                    </td>
                                                                );
                                                            } else {
                                                                return (
                                                                    <td style={tableStyle}> &nbsp; &nbsp; </td>
                                                                );
                                                            }
                                                        } else {
                                                            if (j == 'name')
                                                                return (
                                                                    <td
                                                                        style={{
                                                                            ...tableStyle,
                                                                            backgroundColor: '#00997a',
                                                                            color: 'white'
                                                                        }}
                                                                    >
                                                                        {i.name}
                                                                    </td>
                                                                );
                                                            else
                                                                return (
                                                                    <td
                                                                        style={{
                                                                            ...tableStyle,
                                                                            backgroundColor: '#00997a',
                                                                            color: 'white'
                                                                        }}
                                                                    >
                                                                        {i.user_id}
                                                                    </td>
                                                                );
                                                        }
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }

                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}

Attendence.getLayout = (page) => (
    <Authenticated name="attendence">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Attendence;
