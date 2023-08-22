import {
  FC,
  ChangeEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useContext
} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  styled,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { useAuth } from '@/hooks/useAuth';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import dayjs from 'dayjs';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { TextFieldWrapper } from '@/components/TextFields';
import { formatNumber } from '@/utils/numberFormat';

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
  classes: any;
  sessions: Project[];
  setSessions: Function;
  students: [object?];
  setStudents: Function;
  selectedStudent: any | null;
  setSelectedStudent: Function;
  setPrintFees: Function;
  filteredFees: any
  setFilteredFees: Function
}

interface Filters {
  status?: ProjectStatus;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (sessions, filter) => {
  return sessions.filter((project) => {
    let matches = true;

    if (filter === 'all') return matches;
    else if (filter) if (project.status !== filter) matches = false;

    return matches;
  });
};

const applyPagination = (sessions, page, limit) => {
  return sessions.slice(page * limit, page * limit + limit);
};

const Results = ({
  classes,
  sessions,
  setSessions,
  students,
  setStudents,
  selectedStudent,
  setSelectedStudent,
  setPrintFees,
  filteredFees,
  setFilteredFees,
  setSelectedFees

}) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);

  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filter, setFilter] = useState<string>('all');
  const [paginatedschools, setPaginatedSchool] = useState<any>([]);

  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user: { school: { currency } } = {} } = {} = useAuth();

  const handleStudentPaymentCollect = () => {
    if (selectedStudent) {
      axios
        // @ts-ignore
        .get(`/api/student_payment_collect/${selectedStudent.id}`)
        .then((res) => {
          if (res.data?.success) setSessions(res.data.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  useEffect(() => {
    if (selectedStudent) handleStudentPaymentCollect();
  }, [selectedStudent]);

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      // @ts-ignore
      event.target.checked ? sessions?.fees?.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    projectId: string,
    project: any,
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedFees((prevSelected) => [...prevSelected, project]);
      setSelectedschools((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedFees((prevSelected) => prevSelected.filter(({ id }) => id !== projectId));
      setSelectedschools((prevSelected) => prevSelected.filter((id) => id !== projectId));
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };
  // @ts-ignore
  useEffect(() => {
    const filteredfeesdata = applyFilters(sessions?.fees || [], filter);
    setFilteredFees(filteredfeesdata);
    const paginatedschools = applyPagination(filteredfeesdata, page, limit);
    setPaginatedSchool(paginatedschools);
  }, [sessions, filter, page])

  const selectedBulkActions = selectedItems.length > 0;
  // @ts-ignore
  const selectedSomeschools = selectedItems.length > 0 && selectedItems.length < sessions?.fees?.length;
  // @ts-ignore
  const selectedAllschools = selectedItems.length === sessions?.fees?.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    //  axios.get(`/api/student`).then((res) => setStudents(res.data));

    if (selectedSection && academicYear && user) {
      axios
        .get(
          `/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection.id}&school_id=${user?.school_id}`
        )
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedSection, academicYear, user]);

  const handleConfirmDelete = (id: string) => {
    setDeleteSchoolId(id);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeleteSchoolId(null);
  };

  const handleDeleteCompleted = async () => {
    try {
      const result = await axios.delete(`/api/sessions/${deleteSchoolId}`);
      setOpenConfirmDelete(false);
      if (!result.data?.success) throw new Error('unsuccessful delete');
      showNotification('The sessions has been deleted successfully');
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification('The school falied to delete ', 'error');
    }
  };

  const handleCollection = (student_id, fee_id, fee, amount, payment_method, transID) => {
    axios.post('/api/student_payment_collect', {
      student_id: student_id,
      collected_by_user: user?.id,
      fee_id: fee_id,
      payment_method: payment_method,
      collected_amount: amount,
      transID: transID
    })
      .then((res) => {

        if (res.data.err) throw new Error(res.data.err);
        setPrintFees((prev) => [...prev, fee]);
        handleStudentPaymentCollect();
        showNotification('The payment has been collected successfully');
      })
      .catch((err) => {
        console.error({ err });
        showNotification(err.response?.data?.err, 'error');
      });
  };

  const handlePaymentStatus = (fees) => {
    let payment = { paid: 0, remaining: 0, due: 0 };

    const filterPayment = fees.reduce((prev, curr) => {
      const last_date = dayjs(curr.last_date).valueOf()
      const today = curr.last_payment_date ? dayjs(curr.last_payment_date).valueOf() : 0;

      if (curr?.status !== 'paid' && curr?.status !== 'paid late') {
        prev.due += (curr?.amount + (curr.late_fee ? curr.late_fee : 0) - (curr.paidAmount ? curr.paidAmount : ((curr?.status == 'unpaid') ? 0 : curr?.amount)));
        if (today < last_date) prev.due -= (curr.late_fee ? curr.late_fee : 0);
      }

      if (curr?.status === 'paid') prev.paid += curr.amount || 0;
      else if (curr?.status === 'partial paid') prev.paid += curr.paidAmount;

      return prev;
    }, payment);

    return (
      <TableRow>
        <TableCell>Total : {formatNumber(filterPayment?.paid + filterPayment?.due)} {currency}</TableCell>
        <TableCell>Paid : {formatNumber(filterPayment?.paid)} {currency}</TableCell>
        <TableCell>Remaining : {formatNumber(filterPayment?.due)} {currency}</TableCell>
      </TableRow>
    );
  };
  const handleClassSelect = (event, newValue) => {
    setSelectedClass(newValue);
    if (newValue) {
      const targetClassSections = classes.find((i) => i.id == newValue.id);
      setSections(
        targetClassSections?.sections?.map((i) => {
          return {
            label: i.name,
            id: i.id
          };
        })
      );
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        });
      } else {
        setSelectedSection(null);
      }
    }
    else {
      setSections([])
      setStudents([])
      setSelectedSection(null);
      setSelectedStudent(null);
    }
  };
  return (
    <>
      <Card
        sx={{
          pt: 1, px: 1, mb: 1, width: '100%'
        }}
      >
        <Grid container display={"grid"} gridTemplateColumns={{ sm: "1fr 1fr 1fr" }} columnGap={1}>
          <AutoCompleteWrapper
            options={classes?.map((i) => {
              return {
                label: i.name,
                id: i.id,
                has_section: i.has_section
              };
            })}
            value={undefined}
            label="Select Class"
            placeholder="select a class"
            handleChange={handleClassSelect}
          />

          <AutoCompleteWrapper
            options={sections}
            value={selectedSection}
            label="select section"
            placeholder="section"
            handleChange={(e, v) => {
              setSelectedSection(v);
              setSelectedStudent(null);
              setStudents(() => [])
            }}
          />

          <AutoCompleteWrapper
            value={selectedStudent}
            options={students}
            label="Select Roll"
            placeholder={"select a roll"}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            getOptionLabel={(option) => option.class_roll_no}
            // @ts-ignore
            handleChange={(e: any, value: any) => { setSelectedStudent(value) }}
          />
        </Grid>
      </Card >

      {selectedStudent &&
        <Card
          sx={{
            pt: 1, px: 1, mb: 1, width: '100%'
          }}
        >
          <Grid container display="grid" gridTemplateColumns={{ sm: "1fr 1fr" }} >
            <Grid container display="grid" gridTemplateColumns="1fr 1fr">
              <Grid
                container
                item
                // xs={4}
                // sm={6}
                // md={3}
                direction="row"
                justifyContent="space-between"
                sx={{ p: 1 }}
              >
                {selectedStudent && (
                  <>
                    {selectedStudent?.student_photo ? (
                      <img
                        style={{ width: '50px' }}
                        src={`/images/${selectedStudent.student_photo}`}
                      />
                    ) : (
                      <img
                        style={{ width: '50px', objectFit: 'contain' }}
                        src={`/dumy_teacher.png`}
                      />
                    )}
                  </>
                )}
              </Grid>
              <Grid sx={{ p: 1 }}>
                {
                  // @ts-ignore
                  selectedStudent?.student_info && (
                    <Grid direction={'column'} container>
                      <span>
                        Name:{' '}
                        {[selectedStudent?.student_info?.first_name, selectedStudent?.student_info?.middle_name, selectedStudent?.student_info?.last_name].join(' ')}
                      </span>
                      <span>Id: {selectedStudent?.id}</span>
                      <span>Roll: {selectedStudent?.class_roll_no}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>

            <Grid
              item
              direction={'row'}
              sx={{ p: 1, mx: 'auto' }}
            >
              {sessions?.fees?.length > 0 && handlePaymentStatus(sessions.fees)}
            </Grid>
          </Grid>
        </Card>
      }
      <Card sx={{ minHeight: 'calc(100vh - 405px) !important' }}>

        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid  >
            <FormControl sx={{ pr: 1 }} >
              <InputLabel size='small' sx={{ backgroundColor: 'white' }} id="demo-simple-select-label">Filter By</InputLabel>
              <Select
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                label="Filter By"

                sx={{
                  [`& fieldset`]: {
                    borderRadius: 0.6
                  },
                  px: '10px',
                  minWidth: '50px'
                }}

                value={filter}
                onChange={(e: any) => {
                  setFilter(e.target.value);
                }}
              >
                <MenuItem value={'all'}>ALL</MenuItem>
                <MenuItem value={'paid'}>PAID</MenuItem>
                <MenuItem value={'partial paid'}>PARTIAL PAID</MenuItem>
                <MenuItem value={'unpaid'}>UNPAID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Box>
            <Typography component="span" variant="subtitle1">
              {t('Showing')}:
            </Typography>{' '}
            <b>{paginatedschools.length}</b> <b>{t('fees')}</b>
          </Box>
          <TablePagination
            component="div"
            count={filteredFees.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>

        <Divider />

        {paginatedschools.length === 0 ? (
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
              {t(
                "We couldn't find any students fees matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllschools}
                        indeterminate={selectedSomeschools}
                        onChange={handleSelectAllschools}
                      />
                    </TableCell>
                    <TableCell>{t('Fee Title')}</TableCell>
                    <TableCell>{t('Pay Amount')}</TableCell>
                    <TableCell>{t('Status')}</TableCell>
                    <TableCell>{t('Due')}</TableCell>
                    <TableCell>{t('Last payment date')}</TableCell>
                    <TableCell>{t('Total payable amount')}</TableCell>

                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedschools.map((project) => {

                    const last_date = dayjs(project.last_date).valueOf()
                    const today = project.last_payment_date ? dayjs(project.last_payment_date).valueOf() : 0;
                    const changeColor = today > last_date ? {
                      color: 'red'
                    } : {}
                    const isschoolselected = selectedItems.includes(project.id);

                    let due;
                    if (project?.status == 'paid' || project?.status === 'paid late') {
                      due = 0
                    } else {
                      due = (project?.amount + (project.late_fee ? project.late_fee : 0) -
                        (project.paidAmount ? project.paidAmount : ((project?.status == 'unpaid') ? 0 : project?.amount))).toFixed(1)

                      if (today < last_date) {
                        due -= (project.late_fee ? project.late_fee : 0)
                      }
                    }


                    return (
                      <TableRow
                        hover
                        key={project.id}
                        selected={isschoolselected}
                      >
                        <TableCell padding="checkbox" sx={{ p: 0.5 }}>
                          <Checkbox
                            checked={isschoolselected}
                            onChange={(event) =>
                              handleSelectOneProject(event, project.id, project)
                            }
                            value={isschoolselected}
                          />
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          <Typography noWrap variant="h5">
                            {project?.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          <Typography noWrap variant="h5">
                            {formatNumber(project?.amount.toFixed(1))}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={
                            // @ts-ignore
                            (project?.status === 'paid' || project?.status === 'paid late')
                              ? { color: 'green' }
                              : // @ts-ignore
                              project?.status === 'partial paid'
                                ? { color: 'blue' }
                                : { color: 'red' }, { p: 0.5 }
                          }
                        >
                          <Typography noWrap variant="h5">
                            {/* @ts-ignore */}
                            {project?.status.toUpperCase()}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ p: 0.5 }}>
                          <Typography noWrap variant="h5">
                            {formatNumber(due)}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ p: 0.5 }}>
                          <Typography noWrap variant="h5">
                            {
                              project?.status !== 'unpaid' ? dayjs(project?.last_payment_date).format(
                                'MMMM D, YYYY h:mm A'
                              ) : ''}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ p: 0.5 }}>
                          <Typography noWrap variant="h5" sx={changeColor}>
                            {(today <= last_date || project?.status === 'paid late') ? "" : `${Number(project?.amount).toFixed(1)} + ${Number(project?.late_fee).toFixed(1)} = ${(Number(project?.amount) + Number(project?.late_fee)).toFixed(2)}`}
                          </Typography>
                        </TableCell>

                        <TableCell align="center" sx={{ p: 0.5 }}>
                          <Typography noWrap>
                            <AmountCollection
                              due={due}
                              project={project}
                              handleCollection={handleCollection}
                              student_id={selectedStudent?.id}
                            />
                            {/* <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    setEditData({
                                      student_id: sessions.id,
                                      ...project
                                    })
                                  }
                                  color="primary"
                                >
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip> */}

                            {/* <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => handleConfirmDelete(project.id)}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
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
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this project')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
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

const AmountCollection = ({ due, project, student_id, handleCollection }) => {
  const { t }: { t: any } = useTranslation();
  const [amount, setAmount] = useState(due);
  const [payment_method, setPayment_method] = useState('Cash');
  const [transID, setTransID] = useState(null)
  return (
    <Grid container
      sx={{
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        columnGap: 1,
        justifyContent: 'center',
      }}
    >
      <Grid item sx={{
        minWidth: '130px',
        p: 1
      }}>
        <AutoCompleteWrapper
          label={t('pay via')}
          placeholder={t('Select payment_method...')}
          // getOptionLabel={(option) => option.name}
          options={['Cash', 'Bkash', 'Nagad', 'Rocket', 'Upay', 'Trustpay', 'UCash', 'Card']}
          value={payment_method}
          // renderInput={(params) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     variant="outlined"
          //     label={t('pay via')}
          //     placeholder={t('Select payment_method...')}
          //   />
          // )}
          handleChange={(e, value) => {
            console.log(value);
            if (value == 'Cash') {
              setTransID(null)
            }
            setPayment_method(value)
          }}
        />

      </Grid>
      {
        payment_method && payment_method !== 'Cash' && <Grid item sx={{
          minWidth: '130px',
          p: 1
        }}>
          <TextFieldWrapper
            label="trans ID"
            name=""
            value={transID}
            touched={undefined}
            errors={undefined}
            handleChange={(e) => setTransID(e.target.value)}
            handleBlur={undefined}
            required={payment_method !== 'Cash' ? true : false}
          // type
          />

        </Grid>
      }
      <Grid item minWidth={120} p={1} >
        <TextFieldWrapper
          label="Amount"
          name=""
          type="number"
          touched={undefined}
          errors={undefined}
          value={amount || ''}
          handleChange={(e) => setAmount(e.target.value)}
          handleBlur={undefined}
        />
      </Grid>

      <Grid item pt={0.8}>
        <Button
          variant="contained"
          disabled={amount && payment_method && Number(amount) > 0 && (payment_method !== 'Cash' && transID || payment_method == 'Cash' && !transID) ? false : true}
          onClick={() => {
            handleCollection(student_id, project.id, project, amount, payment_method, transID);
            setPayment_method(null);
            setAmount(() => null);
          }}
          sx={{ borderRadius: 0.5 }}
        >
          Collect
        </Button>
      </Grid>
    </Grid>
  );
};

Results.propTypes = {
  sessions: PropTypes.array.isRequired
};

Results.defaultProps = {
  sessions: []
};

export default Results;
