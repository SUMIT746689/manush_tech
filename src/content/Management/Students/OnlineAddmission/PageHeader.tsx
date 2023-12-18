import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import {
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    TextField,
    CircularProgress,
    Autocomplete,
    Button,
    Select,
    MenuItem,
    Chip,
    Box,
    SelectChangeEvent,
    InputLabel,
    FormControl
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { NewFileUploadFieldWrapper, PreviewImageCard, TextFieldWrapper } from '@/components/TextFields';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import TimePicker from '@mui/lab/TimePicker';
import { TimePickerWrapper } from '@/components/DatePickerWrapper';
import { ButtonWrapper } from '@/components/ButtonWrapper';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

function PageHeader({ editSection, setEditSection, reFetchData }) {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const { showNotification } = useNotistick();
    const [previewImages, setPreviewImages] = useState(undefined);

    const handleCreateClassOpen = () => {
        setOpen(true);
    };

    const handleCreateClassClose = () => {
        setOpen(false);
        setEditSection(null);
        setPreviewImages(undefined)
    };

    const handleCreateUserSuccess = (message) => {
        showNotification(message, 'success');
        setOpen(false);
        setEditSection(null);
        setPreviewImages(undefined)
    };

    const handleFormSubmit = async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
        try {
            const formData = new FormData();
            formData.append("studentAdmission", _values.studentAdmission);

            axios({
                method: 'POST',
                url: `/api/onlineAdmission/admission_files`,
                data: formData,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=<calculated when request is sent>`
                }
            })
                .then(() => {
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateUserSuccess(t('The admission form was added successfully'));
                    reFetchData();
                });
        } catch (err) {
            console.error(err);
            showNotification(t('There was an error, try again later'), 'error');
            setStatus({ success: false });
            // @ts-ignore
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    const handleFileChange = (e, setFieldValue) => {
        if (!e?.target?.files?.length || e?.target?.files?.length === 0) {
            setFieldValue("studentAdmission", []);
            setPreviewImages(() => []);
            return;
        }
        setFieldValue("studentAdmission", e.target.files[0]);
        console.log(e.target.files[0])
        const imgPrev = [];
        Array.prototype.forEach.call(e.target.files, (file) => {
            const objectUrl = URL.createObjectURL(file);
            imgPrev.push({ name: file.name, src: objectUrl })
        });
        setPreviewImages(() => imgPrev)
    }

    const handleRemove = (index) => {
        setPreviewImages((images) => {
            const imagesFilter = images.filter((image, imgIndex) => imgIndex !== index);
            return imagesFilter;
        })
    }

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom textTransform="capitalize">
                        {t('Online Admission')}
                    </Typography>
                    <Typography variant="subtitle2" textTransform={"initial"}>
                        {t(`All aspects of online admission form file can be managed from this page`)}
                    </Typography>
                </Grid>
                <Grid item >
                    <Button
                        sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 0.6, textTransform: "capitalize" }}
                        onClick={handleCreateClassOpen}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {t('Add Admission Form File')}
                    </Button>
                </Grid>
            </Grid>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={handleCreateClassClose}
            >
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t(editSection ? 'Edit a online addmission form' : 'Add online addmission form')}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t('Fill in the fields below to create and add a online addmission form')}
                    </Typography>
                </DialogTitle>
                <Formik
                    initialValues={{
                        studentAdmission: editSection?.studentAdmission || undefined,

                    }}
                    validationSchema={Yup.object().shape({
                        studentAdmission: Yup.string()
                            .max(255)
                            .required(t('The Section name field is required')),
                    })}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                        setFieldValue
                    }) => {
                        console.log({ values })
                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent dividers sx={{ p: 3 }} >
                                    <Grid item >
                                        <NewFileUploadFieldWrapper
                                            htmlFor="url_file"
                                            // multiple={true}
                                            accept="application/pdf,application/vnd.ms-excel"
                                            handleChangeFile={(e) => handleFileChange(e, setFieldValue)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        {
                                            (Array.isArray(previewImages) && previewImages.length > 0) &&
                                            <>
                                                <Grid width="100%" fontWeight={600}>Preview:</Grid>
                                                {
                                                    previewImages?.map((image, index) => (
                                                        <PreviewImageCard data={image} index={index} key={index} handleRemove={handleRemove} />
                                                    ))
                                                }
                                            </>
                                        }
                                    </Grid>
                                </DialogContent>
                                <DialogActionWrapper
                                    title="Admission File"
                                    handleCreateClassClose={handleCreateClassClose}
                                    errors={errors}
                                    editData={editSection}
                                    isSubmitting={isSubmitting}
                                    customSubmitLabel="Add Admission File"
                                />
                            </form>
                        );
                    }}
                </Formik>
            </Dialog>
        </>
    );
}

export default PageHeader;
