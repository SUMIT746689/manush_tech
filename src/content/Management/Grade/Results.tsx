import {
  FC,
  ChangeEvent,
  MouseEvent,
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
  TextField,
  Button,
  Typography,
  Dialog,
  styled
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
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
  grade: Project[];
  editGrade: object;
  setEditGrade: Function;
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


const applyFilters = (
  rooms: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return rooms.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && project.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (
  rooms: Project[],
  page: number,
  limit: number
): Project[] => {
  return rooms.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ grade, setEditGrade,editGrade }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedItems(
      event.target.checked ? grade.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    projectId: string
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedItems((prevSelected) => [...prevSelected, projectId]);
    } else {
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

  const filteredGrades = applyFilters(grade, query, filters);
  const paginatedGrades = applyPagination(filteredGrades, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomesGrades =
    selectedItems.length > 0 && selectedItems.length < grade.length;
  const selectedAllGrades = selectedItems.length === grade.length;
  ;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const handleConfirmDelete = (id: string) => {
    setDeleteSchoolId(id);
    setOpenConfirmDelete(true);
  };
  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeleteSchoolId(null);
  };
  console.log({ deleteSchoolId });

  const handleDeleteCompleted = async () => {
    // try {
    //   const result = await axios.delete(`/api/rooms/${deleteSchoolId}`);
    //   console.log({ result });
    //   setOpenConfirmDelete(false);
    //   if (!result.data?.success) throw new Error('unsuccessful delete');
    //   if (!result.data?.success) throw new Error('unsuccessful delete');
    //   showNotification('The rooms has been deleted successfully');
    // } catch (err) {
    //   setOpenConfirmDelete(false);
    //   showNotification('The school falied to delete ','error');
    // }
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
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
                placeholder={t('Search by grade name...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ minHeight: 'calc(100vh - 450px) !important' }}>
       
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
              <b>{paginatedGrades.length}</b> <b>{t('grades')}</b>
            </Box>
            <TablePagination
              component="div"
              count={filteredGrades.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Box>
        )}
        <Divider />

        {paginatedGrades.length === 0 ? (
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
                "We couldn't find any rooms matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllGrades}
                        indeterminate={selectedSomesGrades}
                        onChange={handleSelectAllschools}
                      />
                    </TableCell>

                    <TableCell>{t('Lower mark')}</TableCell>
                    <TableCell>{t('Upper mark')}</TableCell>
                    <TableCell>{t('Point')}</TableCell>
                    <TableCell>{t('Grade')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedGrades.map((singleGrade) => {
                    const isschoolselected = selectedItems.includes(
                      singleGrade.id
                    );
                    return (
                      <TableRow
                        hover
                        key={singleGrade.id}
                        selected={isschoolselected}
                      >
                        <TableCell padding="checkbox">  
                          <Checkbox
                            checked={isschoolselected}
                            onChange={(event) =>
                              handleSelectOneProject(event, singleGrade.id)
                            }
                            value={isschoolselected}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography noWrap variant="h5">
                            {singleGrade?.lower_mark}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography noWrap variant="h5">
                            {singleGrade?.upper_mark}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography noWrap variant="h5">
                            {singleGrade?.point}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography noWrap variant="h5">
                            {singleGrade?.grade}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => setEditGrade(singleGrade)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(singleGrade.id)
                                }
                                color="primary"
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

Results.propTypes = {
  grade: PropTypes.array.isRequired
};

Results.defaultProps = {
  grade: []
};

export default Results;
