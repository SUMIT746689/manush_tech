import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

import { Card, Divider, Grid } from '@mui/material';
import { RichTextEditorWrapper } from '@/components/RichTextEditorWrapper';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import ExamSubjectSelection from '@/components/ExamSubjectSelection';
import { ButtonWrapper } from '@/components/ButtonWrapper';

function Managementschools() {
    const { t }: { t: any } = useTranslation();
    const router = useRouter();

    const [questionFileLink, setQuestionFileLink] = useState(null)
    const { showNotification } = useNotistick()

    const [classes, setClasses] = useState([]);
    const [classList, setClassList] = useState([]);


    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);


    const handleFormSubmit = async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
        try {
            console.log(_values);
            
            const successProcess = () => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                // setSelectedClass(null)
                // setSelectedSection(null)
                // setSelectedExam(null)
                // setSelectedSubject(null)
            };
            if (!selectedSubject) throw new Error('Subject not selected !!')
            if (!_values?.content && !_values?.file) throw new Error('Question content not added !!')

            const formdata = new FormData();

            formdata.append('exam_details_id', selectedSubject?.id)
            if (_values?.content) formdata.append('content', _values?.content)
            if (_values?.file) formdata.append('file', _values?.file)

            axios.post(`/api/question`, formdata).then(res => {
                showNotification('Question created successfully')
                successProcess()
            }).catch(err => console.log(err));

        } catch (err) {
            console.error(err);
            showNotification(err?.response?.data?.message, 'error')
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }

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
                <title>Exam - Question Creation</title>
            </Head>
            <Grid sx={{ minHeight: 'calc(100vh - 220px)', px: 2 }}>
                <Formik
                    initialValues={{
                        content: '',
                        file: undefined,
                        submit: null
                    }}

                    onSubmit={handleFormSubmit}
                >
                    {({
                        errors,
                        handleSubmit,
                        isSubmitting,
                        values,
                        setFieldValue
                    }) => {
                        // console.log(values);

                        return (
                            <form onSubmit={handleSubmit}>
                                <PageTitleWrapper>
                                    <PageHeaderTitleWrapper
                                        name="Exam - Question Creation"
                                        handleCreateClassOpen={undefined}
                                        actionButton={true}
                                    />
                                </PageTitleWrapper>
                                <Card sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}>
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
                                    <Divider />


                                    <RichTextEditorWrapper handleChange={(e) => setFieldValue('content', e)} value={values.content} />
                                    <Grid sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr', sm: '1fr', md: '1fr 1fr'
                                        },
                                        gap: 2
                                    }}>


                                        {

                                            questionFileLink &&
                                            <Grid
                                                sx={{
                                                    p: 1,
                                                    border: 1,
                                                    borderRadius: 1,
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main'
                                                }}
                                            >
                                                <a
                                                    style={{ width: '50px' }}
                                                    target="_blank"
                                                    href={questionFileLink}
                                                >
                                                    {questionFileLink}
                                                </a>
                                            </Grid>

                                        }
                                        <FileUploadFieldWrapper
                                            htmlFor="question_file"
                                            label="Select Question file"
                                            name="question_file"
                                            value={values?.file?.name || ''}
                                            accept='application/pdf'
                                            handleChangeFile={(e) => {
                                                if (e.target?.files?.length) {
                                                    const photoUrl = URL.createObjectURL(e.target.files[0]);
                                                    setQuestionFileLink(photoUrl)
                                                    setFieldValue('file', e.target.files[0])
                                                } else {
                                                    setFieldValue('file', undefined)
                                                }
                                            }}
                                            handleRemoveFile={(e) => {
                                                setQuestionFileLink(null);
                                                setFieldValue('file', undefined)
                                            }}
                                        />
                                    </Grid>
                                </Card>
                                <br />
                                <ButtonWrapper type='submit' disabled={
                                    (selectedSubject && (values?.file || values?.content)) ? (Boolean(errors.submit) || isSubmitting) : true
                                } handleClick={undefined}>Submit</ButtonWrapper>

                            </form>
                        )
                    }}
                </Formik>
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
