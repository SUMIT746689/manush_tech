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
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import Image from 'next/image';
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
  schools: Project[];
  setTeachers: Function;
  editSchool: object;
  setEditSchool: Function;
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
  schools: Project[],
  query: string,
  filters: Filters
): Project[] => {
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

const applyPagination = (
  schools: Project[],
  page: number,
  limit: number
): Project[] => {
  return schools.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ schools, setTeachers, setEditSchool }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
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



  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredschools = applyFilters(schools, query, filters);
  const paginatedschools = applyPagination(filteredschools, page, limit);
  const selectedBulkActions = selectedItems.length > 0;


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
      const result: any = await axios.delete(`/api/teacher/${deleteSchoolId}`);
      console.log({ result });
      if (!result.data?.success) throw new Error('unsuccessful delete');
      setTeachers((teachers: any) =>
        teachers.filter((teacher) => teacher.id !== result.id)
      );
      setOpenConfirmDelete(false);
      showNotification('The schools has been deleted successfully');
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification('The school falied to delete ', 'error');
    }
  };

  const handleEdit = (data: object) => {
    console.log({ data });
    setEditSchool(data);
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 2
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
                placeholder={t('Search by teacher name, username or phone number...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>


      <Card
        sx={{ minHeight: 'calc(100vh - 438px) !important' }}
      >
        {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )}

        <Divider />

        {paginatedschools.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10,
                p: 4
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t(
                "We couldn't find any teacher matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <Box p={2}>
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
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllschools}
                          indeterminate={selectedSomeschools}
                          onChange={handleSelectAllschools}
                        />
                      </TableCell> */}
                    <TableCell align="center">{t('ID')}</TableCell>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('UserName')}</TableCell>
                    <TableCell>{t('Phone Number')}</TableCell>
                    <TableCell>{t('Photo')}</TableCell>
                    <TableCell>{t('School Name')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedschools.map((project) => {
                    const isschoolselected = selectedItems.includes(
                      project.id
                    );
                    let name = project.first_name;
                    if (project?.middle_name) {
                      name += project?.middle_name
                    }
                    if (project?.last_name) {
                      name += project?.last_name
                    }
                    return (
                      <TableRow
                        hover
                        key={project.id}
                        selected={isschoolselected}
                      >
                        {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell> */}
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {project.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {project.user?.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5" color="yellowgreen">
                            <a href={`tel:${project.phone}`}>{project.phone}</a>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {project.photo ? (
                              <Image
                                style={{ width: '50px' }}
                                alt="profile photo"
                                width={20}
                                height={20}
                                src={`/files/${project.photo}`}
                              />
                            ) : (
                              <Image
                                style={{ width: '50px' }}
                                alt="profile photo"
                                width={20}
                                height={20}
                                src={`/dumy_teacher.png`}
                              />
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {project.user?.school?.name}
                          </Typography>
                        </TableCell>

                        {/* <TableCell>
                            {project.tags?.map((value) => {
                              return (
                                <span key={value}>
                                  <Link href="#">{value}</Link>,{' '}
                                </span>
                              );
                            })}
                          </TableCell> */}
                        {/* <TableCell>
                            <Typography
                              noWrap
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {t('Due')}
                              <b>
                                {' '}
                                {formatDistance(
                                  project.startDate,
                                  project.dueDate,
                                  {
                                    addSuffix: true
                                  }
                                )}
                              </b>
                            </Typography>
                            <Typography noWrap color="text.secondary">
                              {t('Started')}:{' '}
                              {format(project.dueDate, 'MMMM dd yyyy')}
                            </Typography>
                          </TableCell> */}
                        {/* <TableCell>
                            <Box display="flex" justifyContent="flex-start">
                              {project.memberIds.length > 0 && (
                                <AvatarGroup max={4}>
                                  {project.memberIds.map((member) => (
                                    <Tooltip
                                      arrow
                                      placement="top"
                                      key={member.id}
                                      title={member.name}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 30,
                                          height: 30
                                        }}
                                        key={member.id}
                                        src={member.avatar}
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              )}
                            </Box>
                          </TableCell> */}
                        {/* <TableCell align="center">
                            <Box
                              sx={{
                                minWidth: 175
                              }}
                              display="flex"
                              alignItems="center"
                            >
                              <LinearProgress
                                sx={{
                                  flex: 1,
                                  mr: 1
                                }}
                                value={project.progress}
                                color="primary"
                                variant="determinate"
                              />
                              <Typography variant="subtitle1">
                                {project.progress}%
                              </Typography>
                            </Box>
                          </TableCell> */}
                        {/* <TableCell>
                            <Typography noWrap>
                              {getschoolstatusLabel(project.status)}
                            </Typography>
                          </TableCell> */}
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => handleEdit(project)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(project.id)
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
  schools: PropTypes.array.isRequired
};

Results.defaultProps = {
  schools: []
};

export default Results;
