import {
    Autocomplete,
    Box,
    Card,
    Grid,
    Divider,
    TextField,
    Button,
    Avatar,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

import dayjs, { Dayjs } from 'dayjs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import useNotistick from '@/hooks/useNotistick';

const tableStyle: object = {
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
import { ClassAndSectionSelect } from '@/components/Attendence';
import { customBorder } from '@/utils/mui_style';
import { EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
function Attendence() {
    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();
    const [targetsectionStudents, setTargetsectionStudents] = useState(null);
    const [students, setStudents] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
    const [examlist, setExamlist] = useState(null)
    const { user } = useAuth();
    const [selectedExam, setSelectedExam] = useState(null);

    const attendenceRef = useRef();

    useEffect(() => {
        axios
            .get(`/api/class?school_id=${user?.school_id}`)
            .then((res) => setClasses(res.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (academicYear && selectedSection) {
            axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${selectedSection?.id}`)
                .then(res => {
                    setExamlist(res.data?.map(i => {
                        return {
                            label: i.title,
                            id: i.id
                        }
                    }))
                }).catch(err => {
                    showNotification(err?.response?.data?.message, 'error')
                    console.log(err)
                })
        }

    }, [academicYear, selectedSection])

    const handleReportGenerate = async () => {
        try {
            if (selectedSection && academicYear && user) {
                const response = await axios.get(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&exam_id=${selectedExam?.id}`)
                if (response.data.length < 1) {
                    throw new Error('Attendence not taken!')
                }
                const res = await axios.get(`/api/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&academic_year_id=${academicYear?.id}`)

                setTargetsectionStudents(
                    res.data.map((i) => {
                        const middle_name = i?.student_info?.middle_name;
                        const last_name = i?.student_info?.last_name;
                        const found = response.data.find(j => j.student_id == i.id)
                        return {
                            student_id: i.id,
                            class_roll_no: i.class_roll_no,
                            name: i.student_info.first_name + (middle_name ? ` ${middle_name}` : '') + (last_name ? ` ${last_name}` : ''),
                            status: found ? found.status : '',
                            remark: found ? found.remark : ''
                        };
                    })
                );


            }
        } catch (err) {

            setTargetsectionStudents(null);
            console.log(err);
            // showNotification(err.message, 'error')
            showNotification(err?.response?.data?.message || err?.message, 'error');
        }

    };
    return (
        <>
            <Head>
                <title>Students Attendence</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader title={'Students exam Attendence'} />
            </PageTitleWrapper>

            <Grid
                sx={{px:{ xs: 1, md: 4 }}}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={{ xs: 1, md: 3 }}
            >
                <Grid item xs={12}>
                    <Card
                        sx={{
                            pt: 1,
                            px: 1,
                            mb: 1,
                            // width: '100%',
                            columnGap: 1,
                            display: "grid",
                            // gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }
                            gridTemplateAreas: {
                                xs: `"classSection"
                                "exams"
                                "generateButton"
                                "printButton"
                                `,
                                sm: `
                                "classSection classSection"
                                "exams exams" 
                                "generateButton printButton"
                                `,
                                md: `"classSection exams exams generateButton printButton "`
                            }
                        }}
                    >

                        <Grid item gridArea="classSection" width="100%" >
                            <ClassAndSectionSelect
                                selectedClass={selectedClass}
                                setSelectedClass={setSelectedClass}
                                flag={true}
                                classes={classes}
                                selectedDate={null}
                                selectedSection={selectedSection}
                                setSelectedSection={setSelectedSection}
                            />
                        </ Grid>
                        <Grid item pb={1} gridArea="exams" minWidth={"100%"}>

                            {
                                examlist ?
                                    <Autocomplete
                                        fullWidth
                                        size='small'
                                        sx={{
                                            // mr: 10,
                                            borderRadius: 0.6
                                        }}
                                        limitTags={2}
                                        options={examlist}
                                        value={selectedExam}
                                        renderInput={(params) => (
                                            <TextField
                                                size='small'
                                                sx={customBorder}
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                label={t('Exams')}
                                                placeholder={t('Select Exam...')}
                                            />
                                        )}
                                        onChange={(e, value) => setSelectedExam(value)}
                                    />
                                    :
                                    <EmptyAutoCompleteWrapper gridArea="exams" width={"100%"} label="Exams" placeholder={t('Select Exam...')} value={undefined} options={[]} />
                            }
                        </Grid>

                        {
                            user && selectedSection && academicYear && selectedExam ?
                                (
                                    <>
                                        <Grid item gridArea="generateButton" >
                                            <ButtonWrapper handleClick={() => handleReportGenerate()}>
                                                Generate
                                            </ButtonWrapper>
                                        </Grid>

                                        <Grid item gridArea="printButton" >
                                            <ReactToPrint
                                                content={() => attendenceRef.current}
                                                // pageStyle={`{ size: 2.5in 4in }`}
                                                trigger={() => (
                                                    <ButtonWrapper
                                                        handleClick={() => { }}
                                                        startIcon={<LocalPrintshopIcon />}
                                                    >
                                                        Print
                                                    </ButtonWrapper>
                                                )}
                                            />
                                        </Grid>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Grid item gridArea="generateButton" minWidth={"100%"} >
                                            <DisableButtonWrapper >
                                                Generate
                                            </DisableButtonWrapper>
                                        </Grid>
                                        <Grid item gridArea="printButton" minWidth={"100%"} >
                                            <DisableButtonWrapper >
                                                Print
                                            </DisableButtonWrapper>
                                        </Grid>
                                    </>
                                )
                        }

                    </Card>

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
                            targetsectionStudents && <div ref={attendenceRef} style={{
                                paddingLeft: '25px',
                                paddingRight: '25px'
                            }}>
                                <Grid container py={2} spacing={2} justifyContent={"space-between"} px={7}>

                                    <Grid item>
                                        <Avatar variant="rounded"  >
                                            {/* {user?.school?.image && <img src={`/${user.school.image}`} />} */}
                                        </Avatar>
                                    </Grid>

                                    <Grid width={'60%'} item>
                                        <Typography
                                            variant="h3"
                                            align="center"
                                        >
                                            {user?.school?.name}
                                        </Typography>
                                        <Typography variant="h6" align="center" sx={{ borderBottom: 1 }}>
                                            {user?.school?.address}, {user?.school?.phone}
                                        </Typography>
                                        <Typography variant="h6" align="center" >
                                            Class : {selectedClass?.label}, Section : {selectedSection?.label}, Exam Title : {selectedExam?.label}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h4" >
                                            Exam Attendence Report
                                        </Typography>

                                    </Grid>
                                </Grid>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>

                                            <th style={tableStyle}>Name</th>
                                            <th style={tableStyle}>Roll</th>
                                            <th style={tableStyle}>Status</th>

                                            <th style={tableStyle}>Remark</th>
                                        </tr>
                                    </thead>

                                    <tbody style={{
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                                    }}>
                                        {targetsectionStudents?.map((i) => <tr>
                                            <td
                                                style={{
                                                    ...tableStyle,
                                                    backgroundColor: '#00997a',
                                                    color: 'white'
                                                }}
                                            >
                                                {i.name}
                                            </td>
                                            <td
                                                style={{
                                                    ...tableStyle,
                                                    backgroundColor: '#00997a',
                                                    color: 'white'
                                                }}
                                            >
                                                {i.class_roll_no}
                                            </td>
                                            <td
                                                style={
                                                    i.status == 'absent'
                                                        ? {
                                                            ...tableStyle,
                                                            backgroundColor: 'red',
                                                            color: 'white'
                                                        }
                                                        : i.status == 'late'
                                                            ? {
                                                                ...tableStyle,
                                                                backgroundColor: 'yellow',
                                                                color: 'black'
                                                            }
                                                            : i.status == 'bunk'
                                                                ? {
                                                                    ...tableStyle,
                                                                    backgroundColor: 'blue',
                                                                    color: 'white'
                                                                }
                                                                : i.status == 'present' ? {
                                                                    ...tableStyle,
                                                                    backgroundColor: 'green',
                                                                    color: 'white'
                                                                } : tableStyle
                                                }
                                            >
                                                {i.status}
                                            </td>
                                            <td style={tableStyle}>{i.remark}</td>
                                        </tr>
                                        )}
                                    </tbody>

                                    {/* <tfoot>
              <tr>
                <td>Sum</td>
                <td>$180</td>
              </tr>
            </tfoot> */}
                                </table>
                            </div>
                        }

                    </Grid>
                </Grid>
            </Grid >
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
