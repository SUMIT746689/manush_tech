import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Grid, Dialog, DialogTitle, DialogContent, Box, Typography, TextField, CircularProgress, Button, useTheme } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { TextFieldWrapper } from '@/components/TextFields';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';


function PageHeader({ editRooms, setEditRooms, reFetchData }): any {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const { showNotification } = useNotistick();
    const theme = useTheme();
    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

    useEffect(() => {
        if (editRooms) {
            handleCreateProjectOpen();
        }
    }, [editRooms]);

    const handleCreateProjectOpen = () => {
        setOpen(true);
    };

    const handleCreateProjectClose = () => {
        setOpen(false);
        setEditRooms(() => null);
    };

    const handleCreateProjectSuccess = (message) => {
        showNotification(message);
        setOpen(false);
        setEditRooms(() => null);
    };

    const handleSubmit = async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
        try {
            const successProcess = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess(message);
                reFetchData();
            };
            if (editRooms) {
                const res = await axios.patch(`/api/exam_terms/${editRooms.id}`, _values);
                if (res.data?.success) successProcess(t('A exam term has been updated successfully'));
                else throw new Error('edit exam term failed');
            } else {
                _values["academic_year_id"] = academicYear.id;
                const res = await axios.post('/api/exam_terms', _values);
                if (res.data?.success) successProcess(t('A exam term has been created successfully'));
                else throw new Error('created exam term failed');
            }
        } catch (err) {
            console.error(err);
            showNotification(err.message, 'error');
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }

    return (
        <>
            <PageHeaderTitleWrapper
                name="Exam Term"
                handleCreateClassOpen={handleCreateProjectOpen}
            />

            <Dialog
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={handleCreateProjectClose}
            >
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {editRooms ? t('Edit emam term') : t('Create new exam term')}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t(
                            `Use this dialog window to ${editRooms ? 'Edit ' : 'add a new'
                            } exam term`
                        )}
                    </Typography>
                </DialogTitle>
                <Formik
                    initialValues={{
                        title: editRooms?.title ? editRooms.title : '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        title: Yup.string()
                            .max(255)
                            .required(t('The title field is required'))
                    })}
                    onSubmit={handleSubmit}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent
                                dividers
                                sx={{
                                    p: 3
                                }}
                            >
                                <Grid container spacing={0}>

                                    <TextFieldWrapper
                                        errors={errors.title}
                                        touched={touched.title}
                                        name="title"
                                        label={t('Title')}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        value={values.title}
                                    />

                                </Grid>
                            </DialogContent>

                            <DialogActionWrapper
                                title="Exam Term"
                                editData={editRooms}
                                errors={errors}
                                handleCreateClassClose={handleCreateProjectClose}
                                isSubmitting={isSubmitting}
                            />
                        </form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}

export default PageHeader;