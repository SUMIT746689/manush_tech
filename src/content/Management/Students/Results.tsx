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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import useNotistick from '@/hooks/useNotistick';
import NextLink from 'next/link';

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
  return users.filter((user) => {
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
  return users.slice(page * limit, page * limit + limit);
};

const Results = ({ users }) => {

  const [selectedItems, setSelectedUsers] = useState([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });
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

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);


  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    showNotification('The student has been removed');
  };
  useEffect(() => {
    console.log(selectedItems);

  }, [selectedItems])

  return (
    <>
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
                            {i?.student_info?.first_name}{i?.student_info?.middle_name ? " " + i?.student_info?.middle_name : ""}{i?.student_info?.last_name ? " " + i?.student_info?.last_name : ""}
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

                        {/*    /!* <Tooltip title={t('Delete')} arrow>*/}
                        {/*      <IconButton*/}
                        {/*        onClick={handleConfirmDelete}*/}
                        {/*        color="primary"*/}
                        {/*      >*/}
                        {/*        <DeleteTwoToneIcon fontSize="small" />*/}
                        {/*      </IconButton>*/}
                        {/*    </Tooltip> *!/*/}

                        {/*  </Typography>*/}
                        {/*</TableCell>*/}
                        <TableCell align={'center'}>
                          <Tooltip title={t('Edit')} arrow>
                            <IconButton
                              color="primary"
                            >
                              <NextLink href={`/students/${i.id}/edit`}><LaunchTwoToneIcon fontSize="small" /></NextLink>
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


Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
