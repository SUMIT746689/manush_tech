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
  lighten,
  styled,
  Grid
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
import { TableEmptyWrapper } from '@/components/TableWrapper';
import BulkActions from '@/components/BulkAction';
import { ClassAndSectionSelect } from '@/components/Attendence';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { useAuth } from '@/hooks/useAuth';

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

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.75)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);

interface ResultsProps {
  exams: [];
  teachers: [];
  datas: Project[];
  setEditData: Function;
  setDatas: (data: any) => void;
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
  datas: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return datas.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['title'];
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
  datas: Project[],
  page: number,
  limit: number
): Project[] => {
  return datas.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({
  exams,
  teachers,
  datas,
  setEditData,
  setDatas
}) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [selectedExam, setSelectedExam]: any = useState();
  const [selectedTeahcerId, setSelectedTeahcerId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

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

  const filteredschools = applyFilters(datas, query, filters);
  const paginatedDepartments = applyPagination(filteredschools, page, limit);
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
      const result = await axios.delete(`/api/datas/${deleteSchoolId}`);
      setOpenConfirmDelete(false);
      if (!result.data?.success) throw new Error('unsuccessful delete');
      showNotification('The datas has been deleted successfully');

    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification(err?.response?.data?.message, 'error');
    }
  };
  console.log({ exams })
  const handleSearchSeatPlans = () => {
    setIsLoading(true);
    let url = `/api/exam/teacher_exam_routines?exam_id=${selectedExam?.id}&`;
    // @ts-ignore
    if (auth?.user?.role?.title === "ADMIN") url += `teacher_id=${selectedTeahcerId}`;
    console.log({url})
    axios.get(url)
      .then(({ data }: { data: any }) => {
        console.log({ data });
        setDatas(() => data?.seatPlans || [])
      })
      .catch()
      .finally(() => {
        setIsLoading(false)
      })
  }
  console.log({ datas })
  return (
    <>
      <Grid display={"grid"} gridTemplateColumns={{ md: "1fr 1fr" }} gap={1} mb={1}>
        <Card sx={{ pt: 1, px: 1, maxWidth: 700, display: "grid", gridTemplateColumns: "1fr 100px", columnGap: 1 }}>
          {/* @ts-ignore */}
          <Grid item display="grid" gridTemplateColumns={auth?.user?.role?.title === "ADMIN" ? { sm: "1fr 1fr", xs: "1fr" } : "1fr"} columnGap={1}>
            <AutoCompleteWrapper
              minWidth="100%"
              label='Select Exam Term'
              placeholder='select a term of exam...'
              options={exams?.map((exam: any) => {
                return {
                  label: exam.title,
                  id: exam.id
                }
              })}
              value={selectedExam}
              handleChange={(e, v) => {
                console.log({ e, v });
                setSelectedExam(()=>v)
              }}
            />
            {
              // @ts-ignore
              auth?.user?.role?.title === "ADMIN" &&
              <AutoCompleteWrapper
                minWidth="100%"
                label='Select Teacher'
                placeholder='select a teacher...'
                options={teachers?.map((teacher: any) => {
                  return {
                    label: teacher.first_name,
                    id: teacher.id,
                    user_id: teacher.user_id
                  }
                })}
                value={selectedExam}
                handleChange={(e, v) => {
                  console.log({ e, v });  
                  setSelectedTeahcerId(v?.user_id || null)
                }}
              />
            }
          </Grid>
          <SearchingButtonWrapper disabled={isLoading || !selectedExam} isLoading={isLoading} handleClick={handleSearchSeatPlans}>
            Search
          </SearchingButtonWrapper>
        </Card>

        <Card sx={{ p: 1 }}>
          <TextField
            size='small'
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
            placeholder={t('Search by title...')}
            value={query}
            fullWidth
            variant="outlined"
          />
        </Card>
      </Grid>


      <Card sx={{ minHeight: 'calc(100vh - 393px) !important', borderRadius: 0.6 }}>
        {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )}
        {!selectedBulkActions && (
          <Box
            px={2}
            pt={0.5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography component="span" variant="subtitle1">
                {t('Showing')}:
              </Typography>{' '}
              <b>{paginatedDepartments.length}</b> <b>{t('exam routines')}</b>
            </Box>
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
        )}
        <Divider />

        {paginatedDepartments.length === 0 ? (
          <TableEmptyWrapper title="department" />
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{t('Exam Term')}</TableCell>
                    <TableCell align="center">{t('Class')}</TableCell>
                    <TableCell align="center">{t('Section')}</TableCell>
                    <TableCell align="center">{t('Subject')}</TableCell>
                    <TableCell align="center">{t('Room')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDepartments.map((department) => {
                    const isschoolselected = selectedItems.includes(
                      department.id
                    );
                    return (
                      <TableRow
                        hover
                        key={department?.id}
                        selected={isschoolselected}
                      >
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {department?.exam_details?.exam?.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {department?.exam_details?.exam?.section?.class?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {department?.exam_details?.exam?.section?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {department?.exam_details?.subject?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap variant="h5">
                            {department?.room?.name}
                          </Typography>
                        </TableCell>

                        {/* <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => setEditData(department)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(department.id)
                                }
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Box p={2}>
                <TablePagination
                  component="div"
                  count={filteredschools.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box> */}
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
  datas: PropTypes.array.isRequired
};

Results.defaultProps = {
  datas: []
};

export default Results;
