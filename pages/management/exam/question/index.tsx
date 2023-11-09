import Head from 'next/head';

import { useState, useEffect, useContext } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import Results from 'src/content/Management/Question/Results';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { useRouter } from 'next/navigation';
import { TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import ExamSubjectSelection from '@/components/ExamSubjectSelection';

function Managementschools() {
    // const isMountedRef = useRefMounted();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
    const { user } = useAuth();
    const router = useRouter();

    const [question, setQuestion] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);

    const [classes, setClasses] = useState([]);
    const [classList, setClassList] = useState([]);


    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);


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
        axios.get(`/api/question`).then(res => setQuestion(res.data)).catch(err => console.log(err));

    }, [])

    useEffect(() => {
        if (selectedSubject) {
            axios.get(`/api/question?exam_details_id=${selectedSubject.id}`)
                .then(res => setQuestion(res.data))
                .catch(err => console.log(err));
        }

    }, [selectedSubject])

    useEffect(() => {
        if (!selectedClass || !selectedSection || !selectedExam || !selectedSubject) {
            setQuestion([])
        }
    }, [selectedClass, selectedSection, selectedExam, selectedSubject])

    return (
        <>
            <Head>
                <title>Exam - Question</title>
            </Head>
            <PageTitleWrapper>
                <PageHeaderTitleWrapper
                    name="Question"
                    handleCreateClassOpen={() => router.push('/management/exam/question/create')}
                />
                <ExamSubjectSelection
                    classes={classes}
                    classList={classList}

                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    selectedExam={selectedExam}
                    setSelectedExam={setSelectedExam}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                />
            </PageTitleWrapper >

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
                        question={question}
                        setEditQuestion={setEditQuestion}
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
