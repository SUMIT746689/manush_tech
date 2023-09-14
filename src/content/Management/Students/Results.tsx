import {
  ChangeEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
} from 'react';

import PropTypes from 'prop-types';
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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import useNotistick from '@/hooks/useNotistick';
import NextLink from 'next/link';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DiscountIcon from '@mui/icons-material/Discount';
import VisibilityIcon from '@mui/icons-material/Visibility';

import axios from 'axios';

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

const Results = ({ users, refetch, discount }) => {

  const [selectedItems, setSelectedUsers] = useState([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });

  const [discountModal, setDiscountModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  ;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(null);


  const closeConfirmDelete = () => {
    setOpenConfirmDelete(null);
  };

  const handleDeleteCompleted = () => {
    console.log(openConfirmDelete);

    axios.delete(`/api/student/${openConfirmDelete}`)
      .then(res => {
        setOpenConfirmDelete(null);
        refetch();
        showNotification('The student has been removed');
      })
      .catch(err => {
        setOpenConfirmDelete(null);
        showNotification('Student deletion failed !', 'error');
      })
  };
  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(id)
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={discountModal}
        onClose={() => {
          refetch()
          setDiscountModal(false);
        }}
        sx={{ paddingX: { xs: 3, md: 0 } }}
      >
        <Grid item container flexDirection={'column'} sx={{ p: 4 }}>
          <Grid display="flex" alignItems="center" sx={{ mb: { xs: 2, md: 4 } }} >
            <Avatar
              sx={{
                mr: 1
              }}
              src={selectedStudent?.avatar}
            />
            <Box>

              <Typography fontSize={20} fontWeight={'bold'}>{selectedStudent?.username}</Typography>

            </Box>
          </Grid>

          <Grid item container display={'grid'} sx={{ gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 1, sm: 2 } }}>
            {discount?.map((i: any) => (
              <SinglePermission
                key={i.id}
                selectedUser={selectedStudent}
                singleDiscount={i}
              />
            ))}
          </Grid>
        </Grid>
      </Dialog>
      <Card sx={{ minHeight: 'calc(100vh - 410px)' }}>

        {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )}
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
              <b>{paginatedClasses.length}</b> <b>{t('students')}</b>
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
              {t("We couldn't find any students matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllUsers}
                        indeterminate={selectedSomeUsers}
                        onChange={handleSelectAllUsers}
                      />
                    </TableCell>
                    <TableCell>{t('student name')}</TableCell>
                    <TableCell>{t('Class')}</TableCell>
                    <TableCell >{t('class Roll')}</TableCell>
                    <TableCell >{t('Section')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedClasses.map((i) => {
                    const isUserSelected = selectedItems.includes(i.id);
                    return (
                      <TableRow hover key={i.id} selected={isUserSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isUserSelected}
                            onChange={(event) =>
                              handleSelectOneUser(event, i.id)
                            }
                            value={isUserSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {[i?.student_info?.first_name,i?.student_info?.middle_name,i?.student_info?.last_name].join(' ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {i?.section?.class?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {i?.class_roll_no}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {i?.section?.class?.has_section ? i?.section?.name : 'no section'}
                          </Typography>
                        </TableCell>
                        {/*<TableCell align="center">*/}
                        {/*  <Typography noWrap>*/}
                        {/*    /!* <Tooltip title={t('Edit')} arrow>*/}
                        {/*      <IconButton*/}
                        {/*        color="primary"*/}
                        {/*      >*/}
                        {/*        <LaunchTwoToneIcon fontSize="small" />*/}
                        {/*      </IconButton>*/}
                        {/*    </Tooltip> *!/*/}



                        {/*  </Typography>*/}
                        {/*</TableCell>*/}
                        <TableCell align={'center'} sx={{
                          display: 'grid',
                          gridTemplateColumns: 'auto auto auto auto'
                        }}>
                          <Tooltip title={t('View Profile')} arrow>
                            <IconButton
                              color="primary"

                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={t('Edit')} arrow>
                            <IconButton
                              color="primary"
                            >
                              <NextLink href={`/students/${i.id}/edit`}><LaunchTwoToneIcon fontSize="small" /></NextLink>
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={t('Discount')} arrow>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedStudent(i)
                                setDiscountModal(true)
                              }}
                            >
                              <DiscountIcon fontSize="small" />
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

const SinglePermission = ({   singleDiscount, selectedUser }) => {

  const [checked, setChecked] = useState(
    selectedUser && selectedUser?.discount?.length > 0
      ? selectedUser?.discount.find((j) => j.id == singleDiscount.id)
        ? true
        : false
      : false
  );

  const handlePermissionUpdate = (e) => {
    if (checked) {
      axios
        .put(`/api/discount/detach`, {
          discount_id: singleDiscount.id,
          student_id: selectedUser.id
        })
        .then(() => {
          setChecked(false);
          
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(`/api/discount/attach`, {
          discount_id: singleDiscount.id,
          student_id: selectedUser.id
        })
        .then(() => {
          setChecked(true);
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box display={'flex'} justifyContent="space-between" p={1} borderRadius={0.4} sx={{ backgroundColor: 'lightGray', ":hover": { backgroundColor: 'darkGray' } }} key={singleDiscount.id}>
      <Typography sx={{ my: 'auto', textTransform: 'capitalize', fontSize: { xs: 10, md: 15 } }}>
        {singleDiscount?.label}
      </Typography>
      <Switch sx={{ my: 'auto' }} checked={checked} onChange={handlePermissionUpdate} />
    </Box>
  );
};


Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
