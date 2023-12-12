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
import { TextFieldWrapper, UncontrolledTextFieldWrapper } from '@/components/TextFields';
import { formatNumber } from '@/utils/numberFormat';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import Image from "next/image"
import { useRouter } from 'next/navigation';
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
  sessions,
  setSessions,
  // setStudents,
  // selectedStudent,
  setPrintFees,
  filteredFees,
  setFilteredFees

}) => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter()
  const { showNotification } = useNotistick();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>('all');
  const [paginatedschools, setPaginatedSchool] = useState<any>([]);



  const handlePageChange = (_event: any, newPage: number): void => {

    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };
  useEffect(() => {
    // @ts-ignore
    if (router.query?.message) {
      // @ts-ignore
      router.query?.message == 'success' ? showNotification(router.query?.message) : showNotification(router.query?.message, 'error')
    }
    // @ts-ignore
  }, [router?.query])
  useEffect(() => {
    const filteredfeesdata = applyFilters(sessions?.fees || [], filter);
    setFilteredFees(filteredfeesdata);
    const paginatedschools = applyPagination(filteredfeesdata, page, limit);

    console.log(paginatedschools, page, limit);

    setPaginatedSchool(paginatedschools);
  }, [sessions, filter, page])


  const handlePayment = async ({
    fee_id,
    collected_amount,
    total_payable
  }) => {

    try {
      const data = {
        student_id: sessions.student_id,
        collected_by_user: user?.id,
        fee_id,
        collected_amount,
        total_payable
      }
      console.log("got__", data);

      const req = await axios.post('/api/bkash/create-payment', data)

      router.push(req.data.bkashURL)
    } catch (err) {
      showNotification(err?.response?.data?.message, 'error')
      console.log(err);

    }
  }



  return (
    <>
      <Card sx={{ p: 1, mb: 1, mx: 'auto', maxWidth: '800px', display: 'grid', gap: 1, gridTemplateColumns: { sm: '1fr 1fr 1fr 1fr' } }}>
        <UncontrolledTextFieldWrapper label="Section" value={sessions.name} />
        <UncontrolledTextFieldWrapper label="Class" value={sessions.class} />
        <UncontrolledTextFieldWrapper label="Section" value={sessions.section} />
      
          <FormControl  >
            <InputLabel size='small' sx={{ backgroundColor: 'white' }} id="demo-simple-select-label">Filter By</InputLabel>
            <Select
              fullWidth
              size="small"
              label="Filter By"

              sx={{
                [`& fieldset`]: {
                  borderRadius: 0.6
                },
                px: '10px',
                minWidth: '50px',
              }}

              value={filter}
              onChange={(e: any) => {
                setFilter(e.target.value);
              }}
            >
              <MenuItem value={'all'}>ALL</MenuItem>
              <MenuItem value={'paid'}>PAID</MenuItem>
              <MenuItem value={'paid late'}>PAID LATE</MenuItem>
              <MenuItem value={'partial paid'}>PARTIAL PAID</MenuItem>
              <MenuItem value={'unpaid'}>UNPAID</MenuItem>
            </Select>

          </FormControl>

       

      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 305px) !important' }}>
        <Box p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between">

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
                  <TableHead >
                    <TableRow>
                      <TableCell align="center" >
                        <Typography noWrap variant="h5">
                          {t('SL')}</Typography>
                      </TableCell>

                      <TableCell align="center"><Typography noWrap variant="h5">{t('Fee Title')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Fee Amount')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Status')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Due')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Last date')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Last payment date')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Total payable amount')}</Typography></TableCell>
                      <TableCell align="center"><Typography noWrap variant="h5">{t('Actions')}</Typography></TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedschools.map((fee, index) => {
                      return (
                        <TableRow
                          hover
                          key={fee.id}

                        >

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
                              {(fee?.amount.toFixed(2))}
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
                              {fee?.last_payment_date ? dayjs(fee?.last_payment_date).format('DD/MM/YYYY, h:mm a') : ''}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ p: 0.5 }} align="center">
                            <Typography noWrap variant="h5" sx={{ color: 'red' }}>
                              {fee?.total_payable_amt}
                            </Typography>
                          </TableCell>

                          <TableCell align="center" sx={{ p: 0.5 }}>
                            <Typography noWrap>
                              <AmountCollection
                                fee={fee}
                                handlePayment={handlePayment}

                              />
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
      </Card >


    </>
  );
};

const AmountCollection = ({ fee, handlePayment }) => {
  const [amount, setAmount] = useState(fee?.due)
  return (
    <Grid sx={{
      display: 'grid',
      gridTemplateColumns: '130px 0.8fr',
      gap: 1.5,
      pt: 0.8
    }}>
      <Grid >
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


      <Button sx={{
        borderRadius: 0.5,
        textAlign: 'center',
        px: 'auto', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
        height: 0.8,
        backgroundColor: amount && amount >= 10 && '#42a5f5',
      }}
        variant='contained'
        disabled={amount && amount >= 10 ? false : true}
        onClick={() => handlePayment({
          fee_id: fee.id,
          collected_amount: amount,
          total_payable: fee?.payableAmount
        })}>

        <Image src={'/BKash-Icon-Logo.wine.svg'} alt={'bkash'} width={35} height={35} />
        Pay
      </Button>
    </Grid>
  )
}
// StudentPayment.propTypes = {
//   sessions: PropTypes.array.isRequired
// };

// StudentPayment.defaultProps = {
//   sessions: []
// };

export default StudentPayment;
