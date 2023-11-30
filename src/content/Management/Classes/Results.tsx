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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import { DebounceInput } from '@/components/DebounceInput';

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
  setEditClass: Function;
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

const Results: FC<ResultsProps> = ({ users, setEditClass }) => {

  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();


  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    role: null
  });


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
  const selectedBulkActions = selectedItems.length > 0;



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

  return (
    <>
      <Card sx={{ minHeight: 'calc(100vh - 330px) !important' }}>
        <Box p={2}>
          {!selectedBulkActions && (
            <DebounceInput
              debounceTimeout={1000}
              handleDebounce={(v) => setQuery(v)}
              label={'Search by name or class code...'}
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
            <b>{paginatedClasses.length}</b> <b>{t('Class')}</b>
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

        <Divider />

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
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>{t('class Id')}</TableCell>
                    <TableCell align='center'>{t('class name')}</TableCell>
                    <TableCell align='center'>{t('Class code')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedClasses.map((i) => {

                    const isUserSelected = selectedItems.includes(i.id);
                    return (
                      <TableRow hover key={i.id} selected={isUserSelected}>
                        <TableCell align='center'>
                          <Typography variant="h5">
                            {i?.id}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography variant="h5">
                            {i.name}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography variant="h5">
                            {i.code}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Typography noWrap sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() => setEditClass(i)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={handleConfirmDelete}
                                color="error"
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


Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
