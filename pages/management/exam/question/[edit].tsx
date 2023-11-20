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
import prisma from '@/lib/prisma_client';
import { serverSideAuthentication } from '@/utils/serverSideAuthentication';
import { getFile } from '@/utils/utilitY-functions';

export async function getServerSideProps(context) {

    try {
        const refresh_token_varify: any = serverSideAuthentication(context)
        if (!refresh_token_varify) return { props: { editQuestion: {} } };
        const question = await prisma.question.findFirst({
            where: {
                id: Number(context.query.edit),
                exam_details: {
                    exam: {
                        school_id: refresh_token_varify.school_id
                    }
                }
            },
            include: {
                exam_details: {
                    select: {
                        subject_total: true,
                        exam: {
                            select: {
                                id: true,
                                title: true,
                                section: {
                                    select: {
                                        id: true,
                                        name: true,
                                        class: {
                                            select: {
                                                id: true,
                                                name: true,
                                                has_section: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        subject: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return { props: { editQuestion: question } }

    } catch (err) {
        console.log({ err });
        return { props: { editQuestion: {} } };
    }
}

function Managementschools({ editQuestion }) {
    const { t }: { t: any } = useTranslation();

    const [questionFileLink, setQuestionFileLink] = useState(null)
    const { showNotification } = useNotistick()
    const router = useRouter()

    const handleFormSubmit = async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
        try {
            console.log(_values);

            const successProcess = () => {
                setStatus({ success: true });
                setSubmitting(false);
            };
            if (!_values?.content && !_values?.file) throw new Error('Question content not added !!')

            const formdata = new FormData();

            for (const index in _values) {
                if (_values[index]) formdata.append(index, _values[index])
            }
            if (editQuestion?.id) {

                const res = await axios.patch(`/api/question/${editQuestion.id}`, formdata)

                showNotification(res.data.message)
                successProcess()
                router.back()

            }

        } catch (err) {
            console.error(err);
            showNotification(err?.response?.data?.message, 'error')
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }


    return (
        <>
            <Head>
                <title>Exam - Question edit</title>
            </Head>
            <Grid sx={{ minHeight: 'calc(100vh - 220px)', px: 2 }}>
                <Formik
                    initialValues={{
                        content: editQuestion?.content,
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
                                        name="Exam - Question edit"
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

                                    <RichTextEditorWrapper handleChange={(e) => setFieldValue('content', e)} value={values.content} />
                                    <Grid sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr', sm: '1fr', md: '1fr 1fr'
                                        },
                                        gap: 2
                                    }}>


                                        {

                                            (questionFileLink || editQuestion?.file) &&
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
                                                    href={questionFileLink || getFile(editQuestion?.file)}
                                                >
                                                    {questionFileLink || editQuestion?.file}
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
                                                    setQuestionFileLink(null);
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
                                    ((values?.file || values?.content) && editQuestion?.id) ? (Boolean(errors.submit) || isSubmitting) : true
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
