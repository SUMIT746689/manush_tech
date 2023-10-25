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
  Avatar, Autocomplete, Box, Card, Checkbox, Grid, Slide, Divider, Tooltip, IconButton, Table, TableBody, TableCell, TableHead, TablePagination, TableContainer, TableRow, TextField, Button, Typography, Dialog, styled, InputLabel, Select, MenuItem, FormControl
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
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';
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

const StudentPayment = ({
  data,
  sessions,
  setSessions,
  setStudents,
  selectedStudent,
  setPrintFees,
  setFilteredFees

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
      event.target.checked ? data?.fees?.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    projectId: string
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedschools((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedschools((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
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
    const filteredfeesdata = applyFilters(data?.fees || [], filter);
    setFilteredFees(filteredfeesdata);
    const paginatedschools = applyPagination(filteredfeesdata, page, limit);

    console.log(paginatedschools, page, limit);

    setPaginatedSchool(paginatedschools);
  }, [data, filter, page])

  const selectedBulkActions = selectedItems?.length > 0;
  const selectedSomeschools =
    // @ts-ignore
    selectedItems?.length > 0 && selectedItems?.length < data?.fees?.length;
  // @ts-ignore
  const selectedAllschools = selectedItems?.length === data?.fees?.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const [sections, setSections] = useState(null);
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
          //  console.log("students__",res.data);

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
      console.log({ result });
      setOpenConfirmDelete(false);
      if (!result.data?.success) throw new Error('unsuccessful delete');
      showNotification('The sessions has been deleted successfully');
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification('The school falied to delete ', 'error');
    }
  };

  const handleCollection = (student_id, fee_id, fee, amount, payment_method) => {
    axios.post('/api/student_payment_collect', {
      student_id: student_id,
      collected_by_user: user?.id,
      fee_id: fee_id,
      payment_method: payment_method,
      collected_amount: amount
    })
      .then((res) => {
        console.log({ res });
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
    let payment = { totalAmount: 0, paid: 0, remaining: 0 };

    const filterPayment = fees.reduce((prev, curr) => {
      prev.totalAmount += curr.amount;
      if (curr.status === 'paid') prev.paid += curr.amount;
      else prev.remaining += curr.amount;
      return prev;
    }, payment);

    return (
      <TableRow>
        <TableCell>Total : {filterPayment?.totalAmount}</TableCell>
        <TableCell>Paid : {filterPayment?.paid}</TableCell>
        <TableCell>Remaining : {filterPayment?.remaining}</TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Card sx={{ px: 1, pt: 1, mb: 1, mx: 'auto', maxWidth: '800px', display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr 1fr' }}>
        <UncontrolledTextFieldWrapper label="Section" value={data.name} />
        <UncontrolledTextFieldWrapper label="Class" value={data.class} />
        <UncontrolledTextFieldWrapper label="Section" value={data.section} />
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 405px) !important' }}>
        {/* {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )} */}
        
        <Divider />

        {
          paginatedschools.length === 0 ? (
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
                <Table size='small'>
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

                      {/* <TableCell align="center">{t('Actions')}</TableCell> */}
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
                        console.log(today, "  ", last_date);

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
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project?.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              { formatNumber(project?.amount.toFixed(1))}
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
                                  : { color: 'red' }
                            }
                          >
                            <Typography noWrap variant="h5">
                              {/* @ts-ignore */}
                              {project?.status.toUpperCase()}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography noWrap variant="h5">
                              {formatNumber(due)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography noWrap variant="h5">
                              {
                                project?.status !== 'unpaid' ? dayjs(project?.last_payment_date).format(
                                  'MMMM D, YYYY h:mm A'
                                ) : ''}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography noWrap variant="h5" sx={changeColor}>
                              {(today <= last_date || project?.status === 'paid late') ? due : `${Number(project?.amount).toFixed(2)} + ${Number(project?.late_fee).toFixed(2)} = ${formatNumber(project?.amount + project?.late_fee)}`}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography noWrap>
                              {/* <AmountCollection
                                project={project}
                                handleCollection={handleCollection}
                                student_id={selectedStudent?.id}
                              /> */}

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

const AmountCollection = ({ project, student_id, handleCollection }) => {
  const { t }: { t: any } = useTranslation();
  const [amount, setAmount] = useState(null);
  const [payment_method, setPayment_method] = useState('cash');

  return (
    <Grid container sx={{
      display: 'flex',
      gap: 1,
      justifyContent: 'center'
    }}>
      <Grid item sx={{
        minWidth: '130px'
      }}>
        <Autocomplete

          // getOptionLabel={(option) => option.name}
          options={['cash', 'online']}
          value={payment_method}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              label={t('pay via')}
              placeholder={t('Select payment_method...')}
            />
          )}
          onChange={(e, value) => {
            console.log(value);
            setPayment_method(value)
          }}
        />

      </Grid>
      <Grid item>
        <TextField
          sx={{
            width: '100px'
          }}
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)
            //   {
            //   if(e.target.value && Number(e.target.value) > 0){
            //     console.log(Number(e.target.value));

            //     setAmount(Number(e.target.value))
            //   }

            // } 
          }
          label="Amount"
          type="number"
        />
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          disabled={amount && payment_method && Number(amount) > 0 ? false : true}
          onClick={() => {
            handleCollection(student_id, project.id, project, amount, payment_method);
            setPayment_method(null)
            setAmount(null);
          }}
        >
          Collect
        </Button>
      </Grid>
    </Grid>
  );
};

// StudentPayment.propTypes = {
//   sessions: PropTypes.array.isRequired
// };

// StudentPayment.defaultProps = {
//   sessions: []
// };

export default StudentPayment;
