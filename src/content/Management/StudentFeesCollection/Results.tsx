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
import fee from 'pages/api/fee';
import Image from 'next/image';
import { getFile } from '@/utils/utilitY-functions';

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

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const filterFees = (fees, filter) => {
  if (filter === 'all') return fees;
  return fees.filter((fee) => (fee['status'] === filter ? true : false));
};

const applyPagination = (sessions, page, limit) => {
  return sessions.slice(page * limit, page * limit + limit);
};

const Results = ({
  classes,
  sessions,
  setSessions,
  selectedStudent,
  setSelectedStudent,
  setPrintFees,
  filteredFees,
  setFilteredFees,
  setSelectedFees,
  accounts,
  accountsOption
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [students, setStudents] = useState<[object?]>([]);

  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filter, setFilter] = useState<string>('all');
  const [paginatedfees, setPaginatedfees] = useState<any>([]);
  const [sentSms, setSentSms] = useState<number[]>([]);

  const { user } = useAuth();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  // const { user: { school: { currency } } = {} } = {} = useAuth();
  const { school } = user || {};
  const { currency } = school || {};
  const handleStudentPaymentCollect = () => {
    if (selectedStudent && academicYear) {
      axios
        .get(
          `/api/student_payment_collect/${selectedStudent.id}?academic_year_id=${academicYear?.id}`
        )
        .then((res) => {
          if (res.data?.success) {
            setSessions(
              res.data.data?.fees?.map((fee, index) => {
                const last_payment_date =
                  fee?.status !== 'unpaid' ? fee?.last_payment_date : '';
                const last_date = new Date(fee.last_date);
                const today = new Date();
                const status_color = { p: 0.5 };
                let due,
                  total_payable_amt,
                  payableAmount = 0;

                if (fee?.status == 'paid' || fee?.status === 'paid late') {
                  due = 0;
                  total_payable_amt = '';
                } else {
                  const late_fee = fee.late_fee ? fee.late_fee : 0;
                  if (late_fee && today > last_date) {
                    payableAmount = Number(fee?.amount) + Number(fee?.late_fee);
                    total_payable_amt = `${Number(fee?.amount).toFixed(
                      1
                    )} + ${Number(fee?.late_fee).toFixed(
                      1
                    )} = ${payableAmount.toFixed(2)}`;
                  } else {
                    total_payable_amt = '';
                  }

                  due =
                    fee?.amount +
                    late_fee -
                    (fee.paidAmount
                      ? fee.paidAmount
                      : fee?.status == 'unpaid'
                      ? 0
                      : fee?.amount);

                  if (today < last_date) {
                    due -= late_fee;
                  }
                }

                if (fee?.status === 'paid' || fee?.status === 'paid late') {
                  status_color['color'] = 'green';
                } else if (fee?.status === 'partial paid') {
                  status_color['color'] = 'blue';
                } else {
                  status_color['color'] = 'red';
                }

                fee['last_payment_date'] = last_payment_date;
                fee['due'] = due;
                fee['total_payable_amt'] = total_payable_amt;
                fee['payableAmount'] = payableAmount;
                fee['status_color'] = status_color;
                fee['sl'] = index + 1;
                return fee;
              })
            );
          }
        })
        .catch((err) => {
          //  console.log(err.message);
        });
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      handleStudentPaymentCollect();
    }
  }, [selectedStudent]);

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.checked) {
      const temp = sessions?.map((project) => project.id);
      setSelectedFees(sessions);
      setSelectedItems(temp);
    } else {
      setSelectedFees([]);
      setSelectedItems([]);
    }
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    projectId: string,
    project: any
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedFees((prevSelected) => [...prevSelected, project]);
      setSelectedItems((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedFees((prevSelected) =>
        prevSelected.filter(({ id }) => id !== projectId)
      );
      setSelectedItems((prevSelected) =>
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

  useEffect(() => {
    const filterFees_ = filterFees(sessions || [], filter);
    setFilteredFees(() => filterFees_ || []);

    const paginatedschools = applyPagination(filterFees_ || [], page, limit);
    setPaginatedfees(paginatedschools);
  }, [sessions, filter, page, limit]);

  // @ts-ignore
  const selectedSomeschools =
    selectedItems.length > 0 && selectedItems.length < sessions?.length;
  // @ts-ignore
  const selectedAllschools = selectedItems.length === sessions?.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    if (selectedSection && academicYear && user) {
      axios
        .get(
          `/api/student/student-list?academic_year_id=${academicYear?.id}&section_id=${selectedSection.id}`
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

  const handleCollection = ({
    fee,
    amount,
    selectedAccount,
    selectedGateway,
    transID
  }) => {
    axios
      .post('/api/student_payment_collect', {
        student_id: selectedStudent.id,
        collected_by_user: user?.id,
        fee_id: fee.id,
        account_id: selectedAccount?.id,
        payment_method_id: selectedGateway?.id,
        collected_amount: amount,
        transID: transID,
        total_payable: fee?.payableAmount,
        sent_sms: !!sentSms.find((id) => id === fee.id)
      })
      .then((res) => {
        // console.log("res.data__", res.data);
        // setPrintFees([])
        if (res.data.err) throw new Error(res.data.err);
        setPrintFees([
          {
            fee_id: fee.id,
            paidAmount: amount,
            tracking_number: res.data?.tracking_number,
            created_at: res.data?.created_at,
            last_payment_date: res.data?.last_payment_date,
            account: res.data?.account_name,
            transID: res.data?.transID,
            payment_method: res.data?.payment_method,
            status: res.data?.status
          }
        ]);
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
      const last_date = new Date(curr.last_date);
      const today = new Date();

      if (curr?.status !== 'paid' && curr?.status !== 'paid late') {
        prev.due +=
          curr?.amount +
          (curr.late_fee ? curr.late_fee : 0) -
          (curr.paidAmount
            ? curr.paidAmount
            : curr?.status == 'unpaid'
            ? 0
            : curr?.amount);
        if (today < last_date) prev.due -= curr.late_fee ? curr.late_fee : 0;
      }

      if (curr?.status === 'paid') prev.paid += curr.amount || 0;
      else if (curr?.status === 'partial paid') prev.paid += curr.paidAmount;

      return prev;
    }, payment);

    return (
      <TableRow>
        <TableCell>
          Total : {formatNumber(filterPayment?.paid + filterPayment?.due)}{' '}
          {currency}
        </TableCell>
        <TableCell>
          Paid : {formatNumber(filterPayment?.paid)} {currency}
        </TableCell>
        <TableCell>
          Remaining : {formatNumber(filterPayment?.due)} {currency}
        </TableCell>
      </TableRow>
    );
  };

  const handleClassSelect = (event, newValue) => {
    setSessions([]);
    setSelectedFees([]);
    setSelectedItems([]);

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
    } else {
      setSections([]);
      setStudents([]);
      setSelectedSection(null);
      setSelectedStudent(null);
    }
  };

  // const handleSentSms = (fee_id: any) => {
  //   setSentSms((values) => {
  //     const findSentSmsIds = values.find((id) => id === fee_id)
  //     if (!findSentSmsIds) return [...values, fee_id]
  //     return values.filter((id) => id !== fee_id)
  //   })
  //   // showNotification("not implemented", "error");
  // }

  return (
    <>
      <Card
        sx={{
          pt: 1,
          px: 1,
          mb: 1,
          width: '100%'
        }}
      >
        <Grid
          container
          display={'grid'}
          gridTemplateColumns={{ sm: '1fr 1fr 1fr' }}
          columnGap={1}
        >
          <AutoCompleteWrapper
            options={
              classes?.map((i) => {
                return {
                  label: i.name,
                  id: i.id,
                  has_section: i.has_section
                };
              }) || []
            }
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
              setStudents(() => []);
              setSessions([]);
              setSelectedStudent(null);
              setSelectedFees([]);
              setSelectedItems([]);
            }}
          />

          <AutoCompleteWrapper
            value={selectedStudent}
            options={students}
            label="Select Roll"
            placeholder={'select a roll'}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            getOptionLabel={(option) =>
              `${option.class_roll_no}  (${option.student_info.first_name})`
            }
            // @ts-ignore
            handleChange={(e: any, value: any) => {
              setSelectedStudent(value);
              setSelectedFees([]);
              setSelectedItems([]);
            }}
          />
        </Grid>
      </Card>

      {selectedStudent && (
        <Card
          sx={{
            pt: 1,
            px: 1,
            mb: 1,
            width: '100%'
          }}
        >
          <Grid
            container
            display="grid"
            gridTemplateColumns={{ sm: '1fr 1fr' }}
          >
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
                  <Image
                    src={
                      selectedStudent?.student_photo
                        ? getFile(selectedStudent?.student_photo)
                        : `/dumy_teacher.png`
                    }
                    height={100}
                    width={100}
                    alt="student photo"
                    loading="lazy"
                    style={{
                      borderRadius: '15px'
                    }}
                  />
                )}
              </Grid>
              <Grid sx={{ p: 1 }}>
                {
                  // @ts-ignore
                  selectedStudent?.student_info && (
                    <Grid direction={'column'} container>
                      <span>
                        Name:{' '}
                        {[
                          selectedStudent?.student_info?.first_name,
                          selectedStudent?.student_info?.middle_name,
                          selectedStudent?.student_info?.last_name
                        ].join(' ')}
                      </span>
                      <span>Id: {selectedStudent?.id}</span>
                      <span>Roll: {selectedStudent?.class_roll_no}</span>
                      <span>
                        <a href={`tel:${selectedStudent?.student_info?.phone}`}>
                          Number: {selectedStudent?.student_info?.phone}
                        </a>
                      </span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>

            <Grid item direction={'row'} sx={{ p: 1, mx: 'auto' }}>
              {sessions?.length > 0 && handlePaymentStatus(sessions)}
            </Grid>
          </Grid>
        </Card>
      )}

      <Card sx={{ minHeight: 'calc(100vh - 358px) !important' }}>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid>
            <FormControl sx={{ pr: 1 }}>
              <InputLabel
                size="small"
                sx={{ backgroundColor: 'white' }}
                id="demo-simple-select-label"
              >
                Filter By
              </InputLabel>
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
            <b>{paginatedfees.length}</b> <b>{t('fees')}</b>
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

        {paginatedfees.length === 0 ? (
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
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      checked={selectedAllschools}
                      indeterminate={selectedSomeschools}
                      onChange={handleSelectAllschools}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('SL')}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Fee Title')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Fee Amount')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Status')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Due')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Last date')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Last payment date')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Total payable amount')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      {t('Actions')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedfees.map((fee, index) => {
                  const isschoolselected = selectedItems.includes(fee.id);
                  // console.log('fee__', fee);

                  return (
                    <TableRow hover key={fee.id} selected={isschoolselected}>
                      <TableCell padding="checkbox" sx={{ p: 0.5 }}>
                        <Checkbox
                          checked={isschoolselected}
                          onChange={(event) =>
                            handleSelectOneProject(event, fee.id, fee)
                          }
                          value={isschoolselected}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {fee?.sl}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {fee?.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {fee?.amount.toFixed(2)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={fee?.status_color} align="center">
                        <Typography noWrap variant="h5">
                          {fee?.status?.toUpperCase()}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {formatNumber(fee?.due)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {dayjs(fee?.last_date).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5">
                          {fee?.last_payment_date
                            ? dayjs(fee?.last_payment_date).format(
                                'DD/MM/YYYY, h:mm a'
                              )
                            : ''}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Typography noWrap variant="h5" sx={{ color: 'red' }}>
                          {fee?.total_payable_amt}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography noWrap display="flex" my="auto">
                          {/* <Grid color="darkblue" my="auto" pr={1} >
                            <Checkbox checked={!!sentSms.find(id => id === fee.id)} onClick={() => handleSentSms(fee.id)} />
                            Sent Sms
                          </Grid> */}
                          <Grid pt={1}>
                            <AmountCollection
                              accounts={accounts}
                              accountsOption={accountsOption}
                              due={fee?.due}
                              fee={fee}
                              handleCollection={handleCollection}
                            />
                          </Grid>

                          {/* <Button onClick={handleSentSms} variant='outlined' size='small' sx={{ borderRadius: 0.5, fontSize: 13, px: 4, py: 0.8, my: 'auto' }} >
                            Sent Sms
                          </Button> */}

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

const AmountCollection = ({
  due,
  fee,
  handleCollection,
  accounts,
  accountsOption
}) => {
  const { t }: { t: any } = useTranslation();
  const [amount, setAmount] = useState(due);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [transID, setTransID] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [gatewayOption, setGatewayOption] = useState([]);

  return (
    <Grid
      container
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        columnGap: 1,
        justifyContent: 'center'
      }}
    >
      <Grid
        item
        sx={{
          display: 'grid',
          gridTemplateColumns: '130px 130px',
          gap: 1
          // p: 1,
        }}
      >
        <AutoCompleteWrapper
          label={t('Account')}
          placeholder={t('Select account...')}
          // getOptionLabel={(option) => option.name}
          options={accountsOption}
          value={selectedAccount}
          handleChange={(e, v) => {
            if (v) {
              const temp = accounts
                ?.find((i) => i.id === v?.id)
                ?.payment_method?.map((j) => ({
                  label: j.title,
                  id: j.id
                }));
              //  console.log(temp);
              setGatewayOption(temp);
            } else {
              setGatewayOption([]);
            }
            setSelectedAccount(v);
            setSelectedGateway(null);
          }}
        />
        <AutoCompleteWrapper
          label={t('Pay via')}
          placeholder={t('Select Pay via...')}
          options={gatewayOption}
          value={selectedGateway}
          handleChange={(e, value) => {
            console.log(value);
            if (value == 'Cash') {
              setTransID(null);
            }
            setSelectedGateway(value);
          }}
        />
      </Grid>
      {selectedGateway && selectedAccount?.label?.toLowerCase() !== 'cash' && (
        <Grid
          item
          sx={{
            minWidth: '130px'
            // p: 1
          }}
        >
          <TextFieldWrapper
            label="trans ID"
            name=""
            value={transID}
            touched={undefined}
            errors={undefined}
            handleChange={(e) => setTransID(e.target.value)}
            handleBlur={undefined}
            required={selectedGateway !== 'Cash' ? true : false}
            // type
          />
        </Grid>
      )}
      <Grid
        item
        minWidth={120}
        // p={1}
      >
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

      <Grid
        item
        // pt={0.8}
      >
        <Button
          variant="contained"
          disabled={
            amount &&
            selectedGateway &&
            Number(amount) > 0 &&
            ((selectedAccount?.label?.toLowerCase() !== 'cash' && transID) ||
              (selectedAccount?.label?.toLowerCase() === 'cash' && !transID))
              ? false
              : true
          }
          onClick={() => {
            handleCollection({
              fee,
              amount,
              selectedAccount,
              selectedGateway,
              transID
            });
            setSelectedAccount(null);
            setSelectedGateway(null);
            setTransID(null);
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
