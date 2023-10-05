import {
    ChangeEvent,
    useState,
    ReactElement,
    Ref,
    forwardRef,
    useEffect,
} from 'react';
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    Slide,
    Divider,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Button,
    Typography,
    Dialog,
    styled,
    TablePagination,
    Grid,
    Switch,
    DialogTitle,
    DialogContent,
    TextField,
    CircularProgress,
    Autocomplete,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    useTheme,
    DialogActions
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import ApprovalIcon from '@mui/icons-material/Approval';
import NextLink from 'next/link';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DiscountIcon from '@mui/icons-material/Discount';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Head from 'next/head';
import Footer from '@/components/Footer';
import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import * as Yup from 'yup';
import useNotistick from '@/hooks/useNotistick';
import { DatePicker, MobileDatePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { Formik } from 'formik';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import Image from 'next/image';
import { generateUsername, unique_password_generate } from '@/utils/utilitY-functions';

const DialogWrapper = styled(Dialog)(
    () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);
const BoxUploadWrapper = styled(Box)(
    ({ theme }) => `
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(3)};
      background: ${theme.colors.alpha.black[5]};
      border: 1px dashed ${theme.colors.alpha.black[30]};
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: ${theme.transitions.create(['border', 'background'])};
  
      &:hover {
        background: ${theme.colors.alpha.white[100]};
        border-color: ${theme.colors.primary.main};
      }
  `
);
const AvatarError = styled(Avatar)(
    ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);

const ButtonError = styled(Button)(
    ({ theme }) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);
interface Filters {
    role?: string;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (
    users,
    query,
    filters
) => {
    return users?.filter((user) => {
        let matches = true;

        if (query) {
            const properties = ['first_name', 'class_roll_no'];
            let containsQuery = false;

            properties.forEach((property) => {
                if (user[property]?.toLowerCase().includes(query.toLowerCase())) {
                    containsQuery = true;
                }
                if (user?.student_info[property]?.toLowerCase().includes(query.toLowerCase())) {
                    containsQuery = true;
                }
            });

            if (filters.role && user.role !== filters.role) {
                matches = false;
            }

            if (!containsQuery) {
                matches = false;
            }
        }

        Object.keys(filters).forEach((key) => {
            const value = filters[key];

            if (value && user[key] !== value) {
                matches = false;
            }
        });

        return matches;
    });
};

const applyPagination = (
    users: User[],
    page: number,
    limit: number
): User[] => {
    return users?.slice(page * limit, page * limit + limit);
};

const Results = () => {
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])
    const [selectedItems, setSelectedUsers] = useState([]);
    const { t }: { t: any } = useTranslation();
    const { showNotification } = useNotistick();

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [query, setQuery] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({
        role: null
    });

    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const [editSchool, setEditSchool] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [id, setId] = useState(null)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(null);



    const refetch = () => {
        axios.get('/api/teacher_recruitment')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        refetch()
        axios.get('/api/departments').then(res => setDepartments(res.data?.data?.map((i) => ({
            label: i.title,
            value: i.id
        }))))
    }, [])

    const handleCreateProjectClose = () => {
        setOpen(false)
        setEditSchool(null)
        refetch();
    }
    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };
    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };


    const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedUsers(event.target.checked ? users.map((user) => user.id) : []);
    };

    const handleSelectOneUser = (
        _event: ChangeEvent<HTMLInputElement>,
        userId: string
    ): void => {
        if (!selectedItems.includes(userId)) {
            setSelectedUsers((prevSelected) => [...prevSelected, userId]);
        } else {
            setSelectedUsers((prevSelected) =>
                prevSelected.filter((id) => id !== userId)
            );
        }
    };

    const filteredClasses = applyFilters(users, query, filters);
    const paginatedClasses = applyPagination(filteredClasses, page, limit);
    const selectedBulkActions = selectedItems.length > 0;
    const selectedSomeUsers =
        selectedItems.length > 0 && selectedItems.length < users.length;
    const selectedAllUsers = selectedItems.length === users.length;



    const closeConfirmDelete = () => {
        setOpenConfirmDelete(null);
    };

    const handleDeleteCompleted = () => {
        console.log(openConfirmDelete);

        axios.delete(`/api/teacher_recruitment/${openConfirmDelete}`)
            .then(res => {
                setOpenConfirmDelete(null);
                refetch();
                showNotification('teacher_recruitment request has been removed');
            })
            .catch(err => {
                setOpenConfirmDelete(null);
                showNotification('teacher_recruitment request deletion failed !', 'error');
            })
    };
    const handleConfirmDelete = (id) => {
        setOpenConfirmDelete(id)
    }
    const handleCreateProjectSuccess = (message) => {
        showNotification(message);

        setOpen(false);
    };
    const handleFormSubmit = async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
        try {
            const resume: any = [];
            Array.prototype.forEach.call(_values.resume, function (file) {
                resume.push(file);
            });
            const formData = new FormData();
            formData.append('first_name', _values.first_name);
            formData.append('middle_name', _values.middle_name);
            formData.append('last_name', _values.last_name);
            formData.append('national_id', _values.national_id);
            formData.append('department_id', _values.department_id);
            formData.append('phone', _values.phone);
            formData.append('gender', _values.gender);
            formData.append('blood_group', _values.blood_group);
            formData.append('religion', _values.religion);
            formData.append('date_of_birth', _values.date_of_birth);
            formData.append('present_address', _values.present_address);
            formData.append('permanent_address', _values.permanent_address);

            formData.append('username', _values.username);
            if (_values.password !== '') {
                formData.append('password', _values.password);
            }

            formData.append('email', _values.email);
            formData.append('resume', _values.resume);

            formData.append('photo', _values.photo);

            const successProcess = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess(message);
                setEditSchool(null);
                refetch();
            };
            const res = await axios({
                method: 'POST',
                url: '/api/teacher',
                data: formData,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=<calculated when request is sent>`
                }
            });
            // console.log({ res });
            if (res.data?.success) {
                successProcess(t('A new teacher has been created successfully'));
                axios.delete(`/api/teacher_recruitment/${id}`)
                    .then(res => {
                        setId(null);
                        refetch();
                        showNotification('teacher_recruitment request has been removed');
                    })
                    .catch(err => {
                        setId(null);
                        showNotification('teacher_recruitment request deletion failed !', 'error');
                    })

            }

            else {
                setId(null);
                throw new Error('created teacher failed');
            }
        }
        catch (err) {
            setId(null);
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };
    return (
        <>
            <Head>
                <title>Teacher recruitment - Management</title>
            </Head>

            <Dialog
                fullWidth
                maxWidth="lg"
                open={open}
                onClose={handleCreateProjectClose}
                scroll='body'
            >
                <Grid p={2}>
                    <Typography variant='h2' align='center' py={2}> Teacher recruitment Approval</Typography>
                    <Formik
                        initialValues={{
                            username: generateUsername(editSchool?.first_name) || '',
                            password: unique_password_generate(),
                            first_name: editSchool?.first_name || '',
                            middle_name: editSchool?.middle_name || '',
                            last_name: editSchool?.last_name || '',
                            gender: editSchool?.gender || '',
                            phone: editSchool?.phone || '',
                            blood_group: editSchool?.blood_group || '',
                            religion: editSchool?.religion || '',
                            date_of_birth: editSchool?.date_of_birth || '',
                            present_address: editSchool?.present_address || '',
                            permanent_address: editSchool?.permanent_address || '',
                            department_id: editSchool?.department_id,
                            national_id: editSchool?.national_id || '',
                            email: editSchool?.email || '',
                            resume: editSchool?.filePathQuery?.resume || '',
                            photo: editSchool?.filePathQuery?.photo || '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string()
                                .max(255)
                                .required(t('The name field is required')),
                            password: Yup.string().required(
                                t('The password field is required')
                            ),
                            first_name: Yup.string().required(
                                t('The first name field is required')
                            ),
                            gender: Yup.string().required(t('The gender field is required')),
                            date_of_birth: Yup.string().required(
                                t('The date of birth field is required')
                            ),
                            present_address: Yup.string().required(
                                t('The present address field is required')
                            ),
                            permanent_address: Yup.string().required(
                                t('The parmanent_address field is required')
                            ),
                            department_id: Yup.number().required(
                                t('The depardment field is required')
                            ),
                            national_id: Yup.number().required(
                                t('The national id field is required')
                            ),
                            resume: Yup.mixed().required(t('The resume field is required'))
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
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    dividers
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Grid container columnSpacing={1}>
                                        <Grid
                                            container
                                            sx={{
                                                background: `linear-gradient(to right bottom,${theme.colors.primary.main}, ${theme.colors.alpha.white[50]} )`,
                                                p: 1,
                                                color: 'white',
                                                mb: 1
                                            }}
                                        >
                                            Basic Information:
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('First Name')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                                xs={12}
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    error={Boolean(touched.first_name && errors.first_name)}
                                                    fullWidth
                                                    helperText={touched.first_name && errors.first_name}
                                                    name="first_name"
                                                    placeholder={t('first name here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.first_name}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Middle Name')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    name="middle_name"
                                                    placeholder={t('middle name here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.middle_name}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Last Name')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    name="last_name"
                                                    placeholder={t('last name here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.last_name}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('National Id')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    error={Boolean(
                                                        touched.national_id && errors.national_id
                                                    )}
                                                    fullWidth
                                                    helperText={touched.national_id && errors.national_id}
                                                    name="national_id"
                                                    placeholder={t('national id here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.national_id}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Department')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <Autocomplete
                                                    size="small"
                                                    disablePortal
                                                    value={
                                                        departments?.find(
                                                            (department) =>
                                                                department.value === Number(values.department_id)
                                                        ) || null
                                                    }
                                                    options={departments}
                                                    isOptionEqualToValue={(option: any, value: any) =>
                                                        option.value === value.value
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                '& fieldset': {
                                                                    borderRadius: '3px'
                                                                }
                                                            }}
                                                            size="small"
                                                            error={Boolean(
                                                                touched?.department_id && errors?.department_id
                                                            )}
                                                            fullWidth
                                                            helperText={
                                                                touched?.department_id && errors?.department_id
                                                            }
                                                            name="department_id"
                                                            {...params}
                                                            label={t('Select Department')}
                                                        />
                                                    )}
                                                    // @ts-ignore
                                                    onChange={(e, value: any) =>
                                                        setFieldValue('department_id', value?.value || 0)
                                                    }
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Phone Number')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    name="phone"
                                                    placeholder={t('phone number here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.phone}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Gender')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="demo-simple-select-helper-label">
                                                        Select Gender
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        id="demo-simple-select-helper"
                                                        value={values.gender}
                                                        name="gender"
                                                        label="Select Gender"
                                                        onChange={handleChange}
                                                        error={Boolean(touched.gender && errors.gender)}
                                                        onBlur={handleBlur}
                                                        sx={{
                                                            '& fieldset': {
                                                                borderRadius: '3px'
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value={'male'}>Male</MenuItem>
                                                        <MenuItem value={'female'}>Female</MenuItem>
                                                    </Select>
                                                    <FormHelperText sx={{ color: 'red' }}>
                                                        {touched.gender && errors.gender}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Blood Group')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="demo-simple-select-helper-label">
                                                        Select Blood Group
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        id="demo-simple-select-helper"
                                                        value={values.blood_group}
                                                        name="blood_group"
                                                        label="Select Blood Group"
                                                        onChange={handleChange}
                                                        sx={{
                                                            '& fieldset': {
                                                                borderRadius: '3px'
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value={'a+'}>A+</MenuItem>
                                                        <MenuItem value={'a-'}>A-</MenuItem>
                                                        <MenuItem value={'b+'}>B+</MenuItem>
                                                        <MenuItem value={'b-'}>B-</MenuItem>
                                                        <MenuItem value={'o+'}>O+</MenuItem>
                                                        <MenuItem value={'o-'}>O-</MenuItem>
                                                        <MenuItem value={'ab+'}>AB+</MenuItem>
                                                        <MenuItem value={'ab-'}>AB-</MenuItem>
                                                    </Select>
                                                    <FormHelperText>
                                                        {touched.gender && errors.gender}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Religion')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    value={values.religion}
                                                    size="small"
                                                    fullWidth
                                                    name="religion"
                                                    placeholder={t('provide religion here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    // value={values.resume.name}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Date Of Birth')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <MobileDatePicker
                                                    label="Provide birth date"
                                                    inputFormat='dd/MM/yyyy'
                                                    value={values.date_of_birth}
                                                    onChange={(n) => {
                                                        const value = dayjs(n);
                                                        if (n) {
                                                            setFieldValue('date_of_birth', value)
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        size='small'
                                                        sx={{
                                                            '& fieldset': {
                                                                borderRadius: '3px'
                                                            }
                                                        }}
                                                        fullWidth
                                                        {...params}
                                                        error={Boolean(
                                                            touched?.date_of_birth && errors?.date_of_birth
                                                        )}
                                                        helperText={
                                                            touched?.date_of_birth && errors?.date_of_birth
                                                        }
                                                    />}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={6}></Grid>

                                        <Grid item xs={12} md={6}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Present Address')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                    error={Boolean(
                                                        touched.present_address && errors.present_address
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.present_address && errors.present_address
                                                    }
                                                    name="present_address"
                                                    placeholder={t('present address here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.present_address}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Permanent Address')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                    error={Boolean(
                                                        touched.permanent_address && errors.permanent_address
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.permanent_address && errors.permanent_address
                                                    }
                                                    name="permanent_address"
                                                    placeholder={t('permanent address here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.permanent_address}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            container
                                            sx={{
                                                background: `linear-gradient(to right bottom,${theme.colors.primary.main}, ${theme.colors.alpha.white[50]} )`,
                                                p: 1,
                                                color: 'white',
                                                mb: 1
                                            }}
                                        >
                                            Academic Information:
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Username')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    error={Boolean(touched.username && errors.username)}
                                                    fullWidth
                                                    disabled
                                                    helperText={touched.username && errors.username}
                                                    name="username"
                                                    placeholder={t('Teacher username here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.username}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Passsword')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    disabled
                                                    error={Boolean(touched.password && errors.password)}
                                                    fullWidth
                                                    helperText={touched.password && errors.password}
                                                    name="password"
                                                    placeholder={t('Password here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.password}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(1)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Email')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <TextField
                                                    sx={{
                                                        '& fieldset': {
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    type="email"
                                                    name="email"
                                                    placeholder={t('provide email here...')}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.email}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(2)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Resume')}:*</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                            >
                                                <BoxUploadWrapper>
                                                    <TextField
                                                        type="file"
                                                        accessKey='application/pdf'
                                                        error={Boolean(touched.resume && errors.resume)}
                                                        fullWidth
                                                        helperText={touched.resume && errors.resume}
                                                        name="resume"
                                                        placeholder={t('Resume here...')}
                                                        onBlur={handleBlur}
                                                        onChange={(
                                                            event: React.ChangeEvent<HTMLInputElement>
                                                        ) => setFieldValue('resume', event.target?.files[0])}
                                                        variant="outlined"
                                                    />
                                                </BoxUploadWrapper>
                                                {editSchool?.filePathQuery?.resume && (
                                                    <>
                                                        <Grid sx={{ mt: 1 }}>{t('Current Resume:')}</Grid>
                                                        <Grid
                                                            sx={{
                                                                mt: 1,
                                                                p: 1,
                                                                border: 1,
                                                                borderRadius: 1,
                                                                borderColor: 'primary.main',
                                                                color: 'primary.main'
                                                            }}
                                                        >
                                                            <a
                                                                style={{ width: '50px' }}
                                                                href={`/api/get_file/${editSchool?.filePathQuery?.resume?.replace(/\\/g, '/')}`}
                                                                target='_blank'
                                                            >
                                                                {editSchool?.filePathQuery?.resume}
                                                            </a>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            container
                                            sx={{
                                                background: `linear-gradient(to right bottom,${theme.colors.primary.main}, ${theme.colors.alpha.white[50]} )`,
                                                p: 1,
                                                color: 'white',
                                                mb: 1
                                            }}
                                        >
                                            Other Information:
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid item>
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(2)}`,
                                                        pb: { xs: 1, md: 0 }
                                                    }}
                                                    alignSelf="center"
                                                >
                                                    <b>{t('Photo')}:</b>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(1)}`
                                                }}
                                                item
                                            >
                                                <BoxUploadWrapper
                                                    sx={{
                                                        position: 'relative'
                                                    }}
                                                >

                                                    <FileUploadFieldWrapper
                                                        htmlFor="photo"
                                                        label="Select photo:"
                                                        name="photo"
                                                        // @ts-ignore
                                                        value={values?.photo?.name || ''}
                                                        handleChangeFile={(e) => {
                                                            if (e.target?.files?.length) {
                                                                const photoUrl = URL.createObjectURL(e.target.files[0]);
                                                                setPhoto(photoUrl)
                                                                setFieldValue('photo', e.target.files[0])
                                                            }
                                                        }}
                                                        handleRemoveFile={(e) => {
                                                            setPhoto(null);
                                                            setFieldValue('photo', undefined)
                                                        }}
                                                    />
                                                </BoxUploadWrapper>
                                                {(photo || editSchool?.filePathQuery?.photo) && (
                                                    <>
                                                        <Grid sx={{ mt: 1 }}>{t('Uploaded Photo:')}</Grid>
                                                        <Grid
                                                            sx={{
                                                                mt: 1,
                                                                p: 1,
                                                                border: 1,
                                                                borderRadius: 1,
                                                                borderColor: 'primary.main',
                                                                color: 'primary.main'
                                                            }}
                                                            style={{ width: 'fit-content' }}
                                                        >
                                                            <Image src={photo ? `${photo}` : `/api/get_file/${editSchool?.filePathQuery?.photo?.replace(/\\/g, '/')}`}
                                                                height={150}
                                                                width={150}
                                                                alt='photo'
                                                                loading='lazy'
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </DialogContent>

                                <DialogActions
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Button color="secondary" onClick={handleCreateProjectClose}>
                                        {t('Cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        startIcon={
                                            isSubmitting ? <CircularProgress size="1rem" /> : null
                                        }
                                        //@ts-ignore
                                        disabled={Boolean(errors.submit) || isSubmitting}
                                        variant="contained"
                                    >
                                        {t('Approve')}
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </Grid>

            </Dialog>

            <Card sx={{ minHeight: 'calc(100vh - 215px)' }}>


                {!selectedBulkActions && (
                    <Box
                        p={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography component="span" variant="subtitle1">
                                {t('Showing')}:
                            </Typography>{' '}
                            <b>{paginatedClasses.length}</b> <b>{t('Teacher recruitment application')}</b>
                        </Box>
                        <TablePagination
                            component="div"
                            count={filteredClasses.length}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleLimitChange}
                            page={page}
                            rowsPerPage={limit}
                            rowsPerPageOptions={[5, 10, 15]}
                        />
                    </Box>
                )}
                <Divider />

                {paginatedClasses.length === 0 ? (
                    <>
                        <Typography
                            sx={{
                                py: 10
                            }}
                            variant="h3"
                            fontWeight="normal"
                            color="text.secondary"
                            align="center"
                        >
                            {t("We couldn't find any Teacher recruitment application")}
                        </Typography>
                    </>
                ) : (
                    <>
                        <TableContainer >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={'center'}>{t('Name')}</TableCell>
                                        <TableCell align={'center'}>{t('Resume')}</TableCell>
                                        <TableCell align="center">{t('Actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedClasses.map((i) => {
                                        console.log(i);

                                        return (
                                            <TableRow hover key={i.id} >

                                                <TableCell align={'center'}>
                                                    <Typography variant="h5">
                                                        {i?.teacher?.first_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align={'center'}>
                                                    <Typography variant="h5">
                                                        <a
                                                            style={{ width: '50px' }}
                                                            target="_blank"
                                                            href={i?.teacher?.filePathQuery?.resume ?
                                                                `/api/get_file/${i?.teacher?.filePathQuery?.resume?.replace(/\\/g, '/')}`
                                                                : ''}
                                                        >
                                                            {i?.teacher?.filePathQuery?.resume || ''}
                                                        </a>
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align={'center'} sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'auto auto auto auto'
                                                }}>

                                                    <Tooltip title={t('Approve')} arrow>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => {
                                                                setEditSchool(i?.teacher)
                                                                setId(i.id)
                                                                setOpen(true)
                                                            }}
                                                        >
                                                            <ApprovalIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title={t('Delete')} arrow>
                                                        <IconButton
                                                            onClick={() => handleConfirmDelete(i.id)}
                                                            color="primary"
                                                        >
                                                            <DeleteTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Card>

            <Footer />

            <DialogWrapper
                open={openConfirmDelete ? true : false}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={closeConfirmDelete}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={5}
                >
                    <AvatarError>
                        <CloseIcon />
                    </AvatarError>

                    <Typography
                        align="center"
                        sx={{
                            py: 4,
                            px: 6
                        }}
                        variant="h3"
                    >
                        {t('Are you sure you want to permanently delete this student')}
                        ?
                    </Typography>

                    <Box>
                        <Button
                            variant="text"
                            size="large"
                            sx={{
                                mx: 1
                            }}
                            onClick={closeConfirmDelete}
                        >
                            {t('Cancel')}
                        </Button>
                        <ButtonError
                            onClick={handleDeleteCompleted}
                            size="large"
                            sx={{
                                mx: 1,
                                px: 3
                            }}
                            variant="contained"
                        >
                            {t('Delete')}
                        </ButtonError>
                    </Box>
                </Box>
            </DialogWrapper>
        </>
    );
};


Results.getLayout = (page) => (
    <Authenticated name="student">
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Results;
