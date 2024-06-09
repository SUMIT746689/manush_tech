import React, { FC, ChangeEvent, useState, ReactElement, Ref, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
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
// import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import Image from 'next/image';
import useNotistick from '@/hooks/useNotistick';
import { TableEmptyWrapper } from '@/components/TableWrapper';
import { getFile } from '@/utils/utilitY-functions';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { TableBodyCellWrapper, TableHeaderCellWrapper } from '@/components/Table/Table';
import Add from '../AddTeacherFeesAdd/Add';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);
const ActionStyle: object = {
  height: '15px',
  width: '15px',
  padding: 0.5
};

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
  schools: Project[];
  setTeachers: Function;
  editSchool: object;
  setEditSchool: Function;
  reFetchData: Function;
}

interface Filters {
  status?: ProjectStatus;
}

const Transition = forwardRef(function Transition(props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (schools: Project[], query: string, filters: Filters): Project[] => {
  return schools.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['first_name', 'username', 'phone'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property]?.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
        if (project?.user[property]?.toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (schools: Project[], page: number, limit: number): Project[] => {
  return schools.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ schools, setTeachers, setEditSchool, reFetchData }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  useEffect(() => {
    reFetchData();
  }, [teacherId]);

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

  const filteredschools = applyFilters(schools, query, filters);
  const paginatedschools = applyPagination(filteredschools, page, limit);

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

  const handleDeleteCompleted = async () => {
    try {
      const result = await axios.delete(`/api/teacher/${deleteSchoolId}`);
      setOpenConfirmDelete(false);
      showNotification(result.data.message);
      reFetchData();
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification(err?.response?.data?.message, 'error');
    }
  };

  const handleSubjectRemove = async (e, id) => {
    try {
      const res = await axios.patch('/api/teacher/teacher_fees', {
        id: id,
        deleted_at: new Date()
      });

      console.log('Hello response ');
      console.log(res);

      if (res) {
        reFetchData();
        showNotification(`Teacher fees deleted successfully!`, 'success');
      }
    } catch (err) {
      // showNotification(`${err}`, 'error');
    }
  };

  return (
    <>
      {teacherId && <Add reFetchData isOpen={true} setTeacherId={setTeacherId} teacherId={teacherId} schoolId={schoolId} />}
      <Card
        sx={{
          p: 1,
          mb: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={0.5}>
              <TextField
                size="small"
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
                placeholder={t('Search by teacher name, username or phone number...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 412px) !important' }}>
        <Divider />

        {paginatedschools.length === 0 ? (
          <TableEmptyWrapper title="Teacher" />
        ) : (
          <>
            <Box px={2}>
              <TablePagination
                component="div"
                count={filteredschools.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
            <Divider />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableHeaderCellWrapper align="center">{t('ID')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper>{t('Name')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper>{t('Selected Subjects')}</TableHeaderCellWrapper>
                    <TableHeaderCellWrapper align="center">{t('Actions')}</TableHeaderCellWrapper>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedschools.map((i) => {
                    return (
                      <TableRow hover key={i.id}>
                        <TableBodyCellWrapper align="center">
                          <Grid py={0.5}>{i.id}</Grid>
                        </TableBodyCellWrapper>
                        <TableBodyCellWrapper>{[i?.first_name, i?.middle_name, i?.last_name].join(' ')}</TableBodyCellWrapper>
                        <TableBodyCellWrapper>
                          <Grid display="flex" gap={0.5}>
                            {i?.teacherSalaries?.map((list) => (
                              <Grid key={list.id} sx={{ border: '1px solid gray', borderRadius: 0.25, px: 0.5, py: 0.25 }}>
                                {list.subject.name}{' '}
                                <button onClick={(e) => handleSubjectRemove(e, list?.id)}>
                                  <ClearIcon sx={{ cursor: 'pointer', fontSize: 13, ':hover': { bgcolor: 'red', color: 'white' } }} />
                                </button>
                              </Grid>
                            ))}
                          </Grid>
                        </TableBodyCellWrapper>
                        <TableBodyCellWrapper align="center">
                          <Tooltip title={t('Add Fee')} arrow>
                            <IconButton
                              color="primary"
                              sx={ActionStyle}
                              // @ts-ignore
                              onClick={() => {
                                setTeacherId(parseInt(i?.id));
                                setSchoolId(i?.school_id);
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </TableBodyCellWrapper>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>

      <DialogWrapper open={openConfirmDelete} maxWidth="sm" fullWidth TransitionComponent={Transition} keepMounted onClose={closeConfirmDelete}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={5}>
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
