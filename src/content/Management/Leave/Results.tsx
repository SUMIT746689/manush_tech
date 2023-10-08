import {
  FC,
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect
} from 'react';

import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Dialog,
  Zoom,
  styled,
  Chip,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import ApprovalIcon from '@mui/icons-material/Approval';
import { useAuth } from '@/hooks/useAuth';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
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


interface ResultsProps {
  users: User[];
}

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
  return users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'code'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property]?.toLowerCase().includes(query.toLowerCase())) {
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
  return users.slice(page * limit, page * limit + limit);
};

const leave_type_options = ['sick', 'casual', 'maternity']
const status_options = ['pending', 'approved', 'declined']

const Results = ({ users, reFetchData }) => {

  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const { showNotification } = useNotistick();

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };



  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredClasses = applyFilters(users, query, filters);
  const paginatedClasses = applyPagination(filteredClasses, page, limit);



  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    // enqueueSnackbar(t('The class has been removed'), {
    //   variant: 'success',
    //   anchorOrigin: {
    //     vertical: 'top',
    //     horizontal: 'right'
    //   },
    //   TransitionComponent: Zoom
    // });
  };
  const handleCreateClassClose = () => {
    setOpen(false);
    setSelectedUser(null)
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {

      const res = await axios.patch(`/api/leave/${selectedUser.id}`, _values)
      showNotification(res.data.message)
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      reFetchData()
      handleCreateClassClose();

    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.message, 'error');
      setStatus({ success: false });
      //@ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };
  console.log({ selectedUser });

  return (
    <>
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
            {t('Leave Application')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to apply a new leave')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            from_date: selectedUser?.from_date ? dayjs(selectedUser?.from_date) : null,
            to_date: selectedUser?.to_date ? dayjs(selectedUser?.to_date) : null,
            Leave_type: selectedUser?.Leave_type,
            status: selectedUser?.status,
            remarks: undefined
          }}
          validationSchema={Yup.object().shape({
            from_date: Yup.date().required(t('The From date field is required')),
            to_date: Yup.date()
              .required(t('The To date field is required')),
            Leave_type: Yup.string()
              .required(t('Leave type field is required')),
            status: Yup.string()
              .required(t('Leave status field is required')),
            remarks: Yup.string()
              .max(255)
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
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Grid display={"grid"} gridTemplateColumns='1fr 1fr' pb={1} item gap={0.5}>
                        <Grid>
                          <MobileDatePicker
                            inputFormat='dd/MM/yyyy'
                            value={values.from_date}
                            label="From date"
                            onChange={(value) => setFieldValue("from_date", value, true)}
                            renderInput={
                              (params) => (
                                <TextField
                                  fullWidth
                                  size='small'
                                  error={Boolean(touched.from_date && errors.from_date)}
                                  helperText={touched.from_date && errors.from_date}
                                  name='from_date'
                                  sx={{
                                    [`& fieldset`]: {
                                      borderRadius: 0.6,
                                    }
                                  }}
                                  {...params}
                                />
                              )
                            }

                          />

                        </Grid>
                        <Grid>
                          <MobileDatePicker
                            label="To Date"
                            inputFormat='dd/MM/yyyy'
                            value={values.to_date}
                            onChange={(value) => setFieldValue("to_date", value, true)}
                            renderInput={
                              (params) =>
                                <TextField
                                  fullWidth
                                  size='small'
                                  name='to_date'
                                  sx={{
                                    [`& fieldset`]: {
                                      borderRadius: 0.6,
                                    }
                                  }}
                                  {...params}
                                />}

                          />
                        </Grid>
                      </Grid>

                    </Grid>
                    <AutoCompleteWrapper
                      minWidth="100%"
                      label={t('Leave type')}
                      placeholder={t('Type...')}
                      required
                      limitTags={2}
                      options={leave_type_options}
                      error={Boolean(touched.Leave_type && errors.Leave_type)}
                      helperText={touched.Leave_type && errors.Leave_type}
                      value={leave_type_options.find(i => i == values.Leave_type)}
                      handleChange={(e, v) => setFieldValue("Leave_type", v ? v : undefined)}
                    />

                    <Grid item xs={12} p={1}>
                      <Typography variant="h6">
                        Description : <span> {selectedUser?.description} </span>
                      </Typography>
                    </Grid>

                    <AutoCompleteWrapper
                      minWidth="100%"
                      label={t('Status')}
                      placeholder={t('Status...')}
                      required
                      limitTags={2}
                      options={status_options}
                      error={Boolean(touched.status && errors.status)}
                      helperText={touched.status && errors.status}
                      value={status_options.find(i => i == values.status)}
                      handleChange={(e, v) => setFieldValue("status", v ? v : undefined)}
                    />
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.remarks && errors.remarks)}
                        fullWidth
                        margin="normal"
                        helperText={touched.remarks && errors.remarks}
                        label={t('Remarks')}
                        name="remarks"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.remarks}
                        variant="outlined"
                        minRows={4}
                        maxRows={5}
                        multiline
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActionWrapper
                  titleFront="+"
                  title="Submit"
                  editData={undefined}
                  errors={errors}
                  handleCreateClassClose={handleCreateClassClose}
                  isSubmitting={isSubmitting}
                />

              </form>
            );
          }}
        </Formik>
      </Dialog>

      <Card sx={{ minHeight: 'calc(100vh - 330px) !important' }}>

        {paginatedClasses.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10,
                px: 4
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any class matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            {
              // @ts-ignore
              user?.role?.title === 'ADMIN' ?
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>{t('ID')}</TableCell>
                        <TableCell align='center'>{t('User Name')}</TableCell>
                        <TableCell align='center'>{t('Role')}</TableCell>
                        <TableCell align='center'>{t('Leave type')}</TableCell>
                        <TableCell align='center'>{t('Status')}</TableCell>
                        <TableCell align='center'>{t('Action')}</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedClasses.map((i) => {

                        return (
                          <TableRow hover key={i.id}>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {i?.id}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {i?.user?.username}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {i?.user?.role?.title}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {i?.Leave_type}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                <Chip
                                  label={i?.status}
                                  size="medium"
                                  color={i?.status == 'approved' ? 'primary' : 'error'}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                <Tooltip title={t('Approve')} arrow>
                                  <IconButton
                                    color="primary"
                                    onClick={() => {
                                      setSelectedUser(i)
                                      setOpen(true)
                                    }}
                                  >
                                    <ApprovalIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            </TableCell>



                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                :

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>{t('ID')}</TableCell>
                        <TableCell align='center'>{t('From Date')}</TableCell>
                        <TableCell align='center'>{t('To Date')}</TableCell>
                        <TableCell align="center">{t('Applied Date')}</TableCell>
                        <TableCell align='center'>{t('Status')}</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedClasses.map((i) => {

                        return (
                          <TableRow hover key={i.id}>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {i?.id}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {dayjs(i?.from_date).format('YYYY-MM-DD')}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {dayjs(i?.to_date).format('YYYY-MM-DD')}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                {dayjs(i?.created_at).format('YYYY-MM-DD')}
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant="h5">
                                <Chip
                                  label={i?.status}
                                  size="medium"
                                  color={i?.status == 'approved' ? 'primary' : 'error'}
                                />
                              </Typography>
                            </TableCell>

                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
            }

          </>
        )}
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
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
            {t('Are you sure you want to permanently delete this user account')}
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


Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
