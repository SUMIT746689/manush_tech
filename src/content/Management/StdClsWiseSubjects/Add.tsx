import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';
import { Grid, Dialog, DialogContent, } from '@mui/material';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { DialogActionWrapper, DialogTitleWrapper } from '@/components/DialogWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { DisableTextWrapper } from '@/components/TextFields';

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(i => ({ label: i, value: i.toLocaleLowerCase() }))

function Add({ isOpen, selectCls, setAddSubject }) {
    console.log({ isOpen, selectCls, setAddSubject })
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(isOpen);
    const { user } = useAuth();
    const { showNotification } = useNotistick();
    const [checked, setChecked] = useState(false);
    const [subjectLists, setSubjectLists] = useState([]);

    const handleCreateClassOpen = () => {
        setOpen(true);
    };

    const handleCreateClassClose = () => {
        setChecked(false)
        setOpen(false);
        setAddSubject(null)
        // seteditData(null);
    };

    const handleCreateUserSuccess = () => {
        // seteditData(null);
        setOpen(false);
        setAddSubject(null)
    };

    const handleSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            const successResponse = (message) => {
                showNotification('fees ' + message + ' successfully');
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
                // reFetchData();
            };
            _values['last_date'] = new Date(_values.last_date).setHours(23, 59, 0, 0);
            _values['late_fee'] = parseFloat(_values.late_fee)
            const customMonths = _values.months.map(month => month.value);
            const class_ids = _values.class_ids.map(cls => cls.value);
            // dayjs(_values.last_date).format('YYYY-MM-DD')

            // if (editData) {
            //     const res = await axios.patch(`/api/fee/${editData.id}`, { ..._values, months: customMonths, class_ids });
            //     successResponse('updated');
            // } else {
            _values['late_fee'] = _values?.late_fee ? _values?.late_fee : 0;
            const res = await axios.post(`/api/fee`, { ..._values, months: customMonths, class_ids });
            successResponse('created');
            // }
        } catch (err) {
            handleShowErrMsg(err, showNotification);
            setStatus({ success: false });
            //@ts-ignore
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }

    // const handleSelectAllMonths = (setValue) => {
    //     setValue('months', month)
    // }
    // const handleRemoveAllMonths = (setValue) => {
    //     setValue('months', [])
    // }

    // const handleClassChange = (event, value, setFieldValue) => {
    //     setFieldValue('class_id', value || null);
    //     console.log({ value })
    //     if (!value?.value) return setSubjectLists([]);
    //     axios.get(`/api/subject?class_id=${value.value}`)
    //         .then(({ data }) => {
    //             console.log({ data });
    //             if (!Array.isArray(data)) return setSubjectLists([]);
    //             const cusSubjectLists = data.map((subject) => ({ label: subject.name, value: subject.id }));
    //             setSubjectLists(cusSubjectLists)
    //         })
    //         .catch(err => { console.log({ err }) })
    // }

    const handleSubjectChange = (event, value, setFieldValue) => {
        setFieldValue('subject_id', value || null);
        if (!value?.value) return;
    }

    const getMonths = () => {
        axios.get(`/api/subject?class_id=${selectCls.id}`)
            .then(({ data }) => {
                console.log({ data });
                if (!Array.isArray(data)) return setSubjectLists([]);
                const cusSubjectLists = data.map((subject_) => {
                    const val = { label: subject_.name, value: subject_.id }
                    console.log({ val })
                    return val
                });
                console.log({ cusSubjectLists })
                setSubjectLists(cusSubjectLists)
            })
            .catch(err => { console.log({ err }) })
    }

    useEffect(() => {
        // getMonths();
    }, [])

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={handleCreateClassClose}
                sx={{borderRadius:0.5}}
            >

                <DialogTitleWrapper editData={true} name="fees" />

                <Formik
                    initialValues={{
                        school_id: user?.school_id || undefined,
                        class_id: null,
                        section_id: null,
                        class_name: selectCls?.label,
                        months: [],
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        // title: Yup.string()
                        //   .max(255)
                        //   .required(t('The title field is required')),
                        // fees_head_id: Yup.number()
                        //     .min(1, 'The fees head is required')
                        //     .required(t('The fees head is required')),
                        amount: Yup.number()
                            .min(1)
                            .required(t('The amount code field is required')),
                        // school_id: Yup.number()
                        //     .min(1)
                        //     .required(t('The school id is required')),
                        // months: !editData && Yup.array().min(1, "select a month"),
                        // class_ids: !editData && Yup.array().min(1, "select a class"),
                        // class_id: Yup.number()
                        //   .min(1)
                        //   .required(t('class filed field is required'))
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                        console.log({ values })
                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    dividers
                                    sx={{
                                        p: 3,
                                        borderRadius: 0.5
                                    }}
                                >
                                    <Grid container columnSpacing={1} columns={12}>

                                        {/* Class */}
                                        <Grid item xs={12}>
                                            <DisableTextWrapper label="Select Class" value={values.class_name} touched={touched?.class_name} errors={errors?.class_name} />
                                        </Grid>

                                        {/* <Grid item xs={12}>
                                            <AutoCompleteWrapper
                                                // multiple={editData ? false : true}
                                                disabled={true}
                                                minWidth="100%"
                                                label="Select subject"
                                                placeholder="select a subject..."
                                                value={values.section_name}
                                                options={subjectLists}
                                                name="section_name"
                                                error={errors?.section_name}
                                                touched={touched?.section_name}
                                                handleChange={(event, value) => { }}
                                            />
                                        </Grid> */}

                                    </Grid>

                                    {
                                        // !editData && 
                                        // <Grid item columnGap={1}>
                                        //     <AutoCompleteWrapperWithoutRenderInput
                                        //         minWidth="100%"
                                        //         label="Select Month"
                                        //         placeholder="Month..."
                                        //         multiple
                                        //         value={values.months}
                                        //         options={month}
                                        //         name="month"
                                        //         error={errors?.months}
                                        //         touched={touched?.months}
                                        //         // @ts-ignore
                                        //         handleChange={(e, value: any) => setFieldValue('months', value)}
                                        //     />
                                        //     {
                                        //         // !editData && 
                                        //         (
                                        //             <Grid display="flex" justifyContent="start" columnGap={1}>
                                        //                 {/* <ButtonWrapper variant="outlined" handleClick={() => handleSelectAllMonths(setFieldValue)}>Select All</ButtonWrapper> */}
                                        //                 {/* <ButtonWrapper variant="outlined" handleClick={() => handleRemoveAllMonths(setFieldValue)}>Remove All</ButtonWrapper> */}
                                        //             </Grid>
                                        //         )
                                        //     }

                                        // </Grid>
                                    }

                                </DialogContent>
                                <DialogActionWrapper
                                    title="Fees"
                                    errors={errors}
                                    editData={false}
                                    handleCreateClassClose={handleCreateClassClose}
                                    isSubmitting={isSubmitting}
                                />
                            </form>
                        );
                    }}
                </Formik>
            </Dialog>
        </>
    );
}

export default Add;
