import {
  FC,
  ChangeEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef
} from 'react';

import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
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
  TextField,
  Button,
  Typography,
  Dialog,
  styled,
  Grid
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { DebounceInput } from '@/components/DebounceInput';
import { accessNestedProperty } from '@/utils/utilitY-functions';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { TableBodyCellWrapper, TableHeaderCellWrapper } from '@/components/Table/Table';

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
  setEditSection: Function;
  reFetchData: Function
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

const applyFilters = (users, query, filters) => {
  return users.filter((user) => {
    let matches = true;
    if (query) {
      const properties = ['name', 'class.name'];
      let containsQuery = false;

      for (const property of properties) {
        const queryString = accessNestedProperty(user, property.split('.'))
        if (queryString?.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      }

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

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ setEditSection, users, reFetchData }) => {
  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });
  const { showNotification } = useNotistick();
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
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

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredClasses = applyFilters(users, query, filters);
  const paginatedClasses = applyPagination(filteredClasses, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeUsers =
    selectedItems.length > 0 && selectedItems.length < users.length;
  const selectedAllUsers = selectedItems.length === users.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(true);
    setDeleteId(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    axios.delete(`/api/section/${deleteId}`)
      .then(res => {
        reFetchData();
        showNotification("successfully deleted")
      })
      .catch(err => {
        handleShowErrMsg(err, showNotification)
      })
    setOpenConfirmDelete(false);
  };

  return (
    <>
      <Card sx={{ minHeight: 'calc(100vh - 330px) !important' }}>
        <Box p={2}>
          {!selectedBulkActions && (

            <DebounceInput
              debounceTimeout={500}
              handleDebounce={(v) => setQuery(v)}
              value={searchValue}
              handleChange={(v) => setSearchValue(v.target?.value)}
              label={'Search by name, classname or group name...'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
            />
          )}
          {selectedBulkActions && <BulkActions />}
        </Box>

        <Divider />

        {paginatedClasses.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10,
                px: 3
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any sections matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableHeaderCellWrapper >{t('Batch Id')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper >{t('Batch name')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper >{t('class Name')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper >{t('Group Name')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper >{t('section teacher name')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper >{t('Actions')}</TableHeaderCellWrapper>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedClasses.map((i) => {
                    const isUserSelected = selectedItems.includes(i.id);
                    return (
                      <TableRow hover key={i.id} selected={isUserSelected}>
                        <TableBodyCellWrapper>{i?.id}</TableBodyCellWrapper>
                        <TableBodyCellWrapper>{i?.name}</TableBodyCellWrapper>
                        <TableBodyCellWrapper>{i?.class.name}</TableBodyCellWrapper>
                        <TableBodyCellWrapper>{i?.groups?.map(group => group.title).join(', ')}</TableBodyCellWrapper>
                        <TableBodyCellWrapper>{i?.class_teacher?.user?.username}</TableBodyCellWrapper>

                        <TableBodyCellWrapper align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() => setEditSection(i)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => handleConfirmDelete(i?.id)}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableBodyCellWrapper>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
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
            {t('Are you sure you want to permanently delete this section')}?
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
