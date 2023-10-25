import {
  FC,
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
  Tabs,
  TextField,
  Button,
  Typography,
  Dialog,
  styled,
  Chip,
  Modal,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Autocomplete
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyIcon from '@mui/icons-material/Key';
import Link from 'src/components/Link';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import { useAuth } from 'src/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import { fetchData } from '@/utils/post';
import { useSearchUsers } from '@/hooks/useSearchUsers';

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
  users: User[]
  reFetchData: Function
  setEditUser: Function
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
  users: User[],
  query: string,
  filters: Filters
): User[] => {
  return users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name', 'username'];
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

const Results = ({ users, roleOptions, reFetchData, setEditUser }) => {

  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const { user, superAdminLogInAsAdmin } = useAuth();


  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });
  const [allUsers, setAllUsers] = useState(users);
  const [searchToken, setSearchToken] = useState(null);


  const getNsetOptions = () => {
    axios.get(`/api/user?role=${searchToken}`)
      .then(res => setAllUsers(res.data))
      .catch(err => console.log(err))
  };

  useEffect(() => {
    if (searchToken) {
      getNsetOptions();
    } else {
      reFetchData()
    }
  }, [searchToken]);


  useEffect(() => {
    setAllUsers(users)
  }, [users])





  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedUsers(event.target.checked ? allUsers.map((user) => user.id) : []);
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

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = applyFilters(allUsers, query, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeUsers =
    selectedItems.length > 0 && selectedItems.length < allUsers.length;
  const selectedAllUsers = selectedItems.length === allUsers.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    showNotification('The user has been removed');
  };
  const [permissionModal, setPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  //change user active or disable 
  const handleUserEnabled = async (user) => {
    // console.log({user})
    const [err, response]: any = await fetchData(`/api/user/activition/${user.id}`, 'patch', { is_enabled: !user.is_enabled, role: user.user_role });
    if (response.message) reFetchData(true)
    console.log({ err, response });
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={permissionModal}
        onClose={() => {
          setPermissionModal(false);
        }}
        sx={{ paddingX: { xs: 3, md: 0 } }}
      >
        <Grid item container flexDirection={'column'} sx={{ p: 4 }}>
          <Grid display="flex" alignItems="center" sx={{ mb: { xs: 2, md: 4 } }} >
            <Avatar
              sx={{
                mr: 1
              }}
              src={selectedUser?.avatar}
            />
            <Box>
              <Link variant="h5" href="#">
                <Typography fontSize={20} fontWeight={'bold'}>{selectedUser?.username}</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item container display={'grid'} sx={{ gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 1, sm: 2 } }}>
            {user?.permissions?.map((i: any) => (
              <SinglePermission
                key={i.id}
                selectedUser={selectedUser}
                singlePermission={i}
                setAllUsers={setAllUsers}
              />
            ))}
          </Grid>
        </Grid>
      </Dialog>

      <Card sx={{ minHeight: 'calc(100vh - 330px) !important' }}>
        <Grid p={2} display={'grid'} gridTemplateColumns={'auto auto'} gap={4}>
          {/* {!selectedBulkActions && ( */}
          <TextField
            sx={{
              m: 0
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder={t('Search by name, email or username...')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Autocomplete
            size="small"
            id="multiple-limit-tags"
            options={roleOptions || []}
            value={searchToken}
            onChange={(e, v) => setSearchToken(v)}
            renderInput={(params) => <TextField
              sx={{
                [`& fieldset`]: {
                  borderRadius: 0.6,
                }
              }}
              {...params}
              label="Filter by role"
            />
            }
          />

          {/*  )} */}
          {/* {selectedBulkActions && <BulkActions />} */}
        </Grid>

        <Divider />
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>

        {paginatedUsers.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10,
                minHeight: '55vh'
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any users matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Username')}</TableCell>
                    <TableCell>{t('Role')}</TableCell>
                    <TableCell>{t('School name')}</TableCell>
                    <TableCell>{t('Log in as Admin')}</TableCell>
                    <TableCell>{t('Active Status')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => {


                    const isUserSelected = selectedItems.includes(user.id);
                    return (
                      <TableRow hover key={user.id} selected={isUserSelected}>
                        <TableCell>
                          <Typography variant="h5">{user?.username}</Typography>
                        </TableCell>
                        <TableCell>
                          {/* @ts-ignore */}
                          <Chip
                            label={user?.user_role?.title}
                            size="medium"
                            color={user.role_id ? 'primary' : 'error'}
                          />

                        </TableCell>
                        <TableCell>
                          {/* @ts-ignore */}
                          <Typography variant="h5">
                            {user?.school?.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {/* @ts-ignore */}
                          <Button
                            variant="contained"
                            onClick={async () => {
                              try {
                                // @ts-ignore
                                await superAdminLogInAsAdmin(user.id);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Log in
                          </Button>
                        </TableCell>

                        <TableCell>
                          {/* @ts-ignore */}
                          <Typography variant="h5" color={user?.is_enabled ? 'green' : 'red'}>
                            {/* {user?.is_enabled ? 'Enable' : 'Disable'} */}
                            <Switch checked={user?.is_enabled} onClick={() => handleUserEnabled(user)} />
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                color="primary"
                                sx={{ color: 'yellowgreen' }}
                                onClick={() => setEditUser(user)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {
                              !user.role_id && <Tooltip title={t('Reset Permission')} arrow>
                                <IconButton
                                  onClick={() => {
                                    try {
                                      axios.put(`/api/permission/attach-user`, {
                                        role_id: user.user_role.id,
                                        user_id: user.id
                                      })
                                        .then(() => {
                                          reFetchData()
                                        })
                                    } catch (err) {
                                      console.log(err);

                                    }

                                  }}
                                  sx={{ color: 'darkorange' }}
                                >
                                  <RestartAltIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            }
                            <Tooltip title={t('Permission')} arrow>
                              <IconButton
                                // href={'/management/users/single/' + user.id}
                                color="primary"
                                onClick={() => {

                                  axios
                                    .get(`/api/user/${user?.id}`)
                                    .then((res) => {
                                      console.log('selectedUser__', res.data);
                                      setSelectedUser(res.data);
                                      setPermissionModal(true);
                                    })
                                    .catch((err) => console.log(err));
                                }}
                              >
                                <KeyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={handleConfirmDelete}
                                sx={{ color: 'red' }}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
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
const SinglePermission = ({ setAllUsers, singlePermission, selectedUser }) => {
  const [checked, setChecked] = useState(
    selectedUser && selectedUser?.permissions?.length > 0
      ? selectedUser?.permissions.find((j) => j.id == singlePermission.id)
        ? true
        : false
      : false
  );

  const handlePermissionUpdate = (e) => {
    if (checked) {
      axios
        .put(`/api/permission/detach-user`, {
          permission_id: singlePermission.id,
          user_id: selectedUser.id
        })
        .then(() => {
          setChecked(false);
          axios.get('/api/user').then((res) => setAllUsers(res.data));
          // console.log("e.currentTarget.checked__", e.currentTarget.checked);
          console.log('e.target.checked__', e.target.checked);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(`/api/permission/attach-user`, {
          permission_id: singlePermission.id,
          user_id: selectedUser.id
        })
        .then(() => {
          axios.get('/api/user').then((res) => setAllUsers(res.data));
          setChecked(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box display={'flex'} justifyContent="space-between" p={1} borderRadius={0.4} sx={{ backgroundColor: 'lightGray', ":hover": { backgroundColor: 'darkGray' } }} key={singlePermission.id}>
      <Typography sx={{ my: 'auto', textTransform: 'capitalize', fontSize: { xs: 10, md: 15 } }}>{singlePermission?.name}</Typography>
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
