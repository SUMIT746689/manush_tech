import { ChangeEvent, useState, ReactElement, Ref, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Checkbox, Grid, Slide, Divider, Tooltip, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TablePagination, TableContainer, TableRow, TextField, Button, Typography, Dialog, styled } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

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
  schools: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return schools.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['title'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property]?.toLowerCase().includes(query.toLowerCase())) {
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
  schools: Project[],
  page: number,
  limit: number
): Project[] => {
  return schools.slice(page * limit, page * limit + limit);
};

const Results = ({
  exams,
  // setTeachers,
  setEditExam
}) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const { showNotification } = useNotistick();


  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };



  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      event.target.checked ? exams.map((project) => project.id) : []
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

  const filteredExams = applyFilters(exams, query, filters);
  const paginatedExams = applyPagination(filteredExams, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeschools = selectedItems.length > 0 && selectedItems.length < exams.length;
  const selectedAllschools = selectedItems.length === exams.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeleteSchoolId(null);
  };

  const handleDeleteCompleted = async () => {
    try {
      const result: any = await axios.delete(`/api/teacher/${deleteSchoolId}`);
      console.log({ result });
      if (!result.data?.success) throw new Error('unsuccessful delete');
      setOpenConfirmDelete(false);
      showNotification('The exam has been deleted successfully');
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification('The school falied to delete ', 'error');
    }
  };

  const handleEdit = (data: object) => {
    setEditExam(data)
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 1
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={0.5}>
              <TextField
                sx={{ m: 0 }}
                size='small'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={t('Search by exam name...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 450px)' }}>
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
              <b>{paginatedExams.length}</b> <b>{t('exams')}</b>
            </Box>
            <TablePagination
              component="div"
              count={filteredExams.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Box>
        )}
        <Divider />

        {paginatedExams.length === 0 ? (
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
              {t(
                "We couldn't find any exam matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
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
                    <td>{t('ID')}</td>
                    <td>{t('Exam title')}</td>
                    <td>{t('Class')}</td>
                    <td>{t('Section')}</td>
                    <td>{t('Final percentage')}</td>
                    <td>{t('Subject list')}</td>
                    <td align="center">{t('Actions')}</td>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedExams.map((exam) => {
                    const isExamselected = selectedItems.includes(
                      exam.id
                    );


                    return (
                      <TableRow
                        hover
                        key={exam.id}
                        selected={isExamselected}
                      >
                        <td>
                          <Checkbox
                            checked={isExamselected}
                            onChange={(event) =>
                              handleSelectOneProject(event, exam.id)
                            }
                            value={isExamselected}
                          />
                        </td>
                        <td>
                          <Typography noWrap variant="h5" py={0}>
                            {exam.id}
                          </Typography>
                        </td>
                        <td>
                          <Typography noWrap variant="h5" py={0}>
                            {exam?.title}
                          </Typography>
                        </td>
                        <td>
                          <Typography noWrap variant="h5" py={0}>
                            {exam?.section?.class?.name}
                          </Typography>
                        </td>
                        <td>
                          <Typography noWrap variant="h5" py={0}>
                            {exam.section?.class?.has_section ? exam?.section?.name : '(This class has no section !)'}
                          </Typography>
                        </td>
                        <td>
                          <Typography noWrap variant="h5" py={0}>
                            {exam.final_percent ? exam?.final_percent : 'No percentage'}
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="h5" py={0}>
                            {exam?.exam_details?.map(i => i?.subject?.name).join(", ")}
                          </Typography>
                        </td>


                        <td align="center">
                          <Typography noWrap py={0}>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => handleEdit(exam)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleConfirmDelete(exam.id)
                                  }
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip> */}
                          </Typography>
                        </td>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
           
            {/* <Box p={2}>
                <TablePagination
                  component="div"
                  count={filteredExams.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box> */}
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

Results.propTypes = {
  schools: PropTypes.array.isRequired
};

Results.defaultProps = {
  schools: []
};

export default Results;