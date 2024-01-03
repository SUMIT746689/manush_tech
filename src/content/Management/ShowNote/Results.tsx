import { FC, ChangeEvent, useState, ReactElement, Ref, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Box, Card, Checkbox, Grid, Slide, Divider, Tooltip, IconButton,
  InputAdornment, Table, TableBody, TableHead, TablePagination,
  TableContainer, TableRow, TextField, Button, Typography, Dialog, styled
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import useNotistick from '@/hooks/useNotistick';
import { ClassAndSectionSelect } from '@/components/Attendence';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import axios from 'axios';
import { DateRangePickerWrapper } from '@/components/DatePickerWrapper';
import { customizeDate } from '@/utils/customizeDate';
import { TableCellWrapper, TableRowWrapper } from '@/components/Table/Table';

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
  classes: any[];
  notes: any[];
  setNotes: (value: any) => void;
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

const Results: FC<ResultsProps> = ({ classes, notes, setNotes }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({ status: null });

  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedItems(
      event.target.checked ? notes.map((project) => project.id) : []
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

  const filteredGrades = applyFilters(notes, query, filters);
  const paginatedNotes = applyPagination(filteredGrades, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomesGrades =
    selectedItems.length > 0 && selectedItems.length < notes.length;
  const selectedAllGrades = selectedItems.length === notes.length;
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

  const handleSearching = async () => {
    setIsLoading(true)
    try {
      const { id: section_id } = selectedSection;
      const result:any = await axios.get(`/api/notes?get_type=all&section_id=${section_id}&start_date=${startDate}&end_date=${endDate}`);
      const { data } = result;
      // console.log({result})
      setNotes(() => data || [])
    }
    catch (err) {
      showNotification("request failed", "error")
    }
    finally {
      setIsLoading(false)
    }
  }

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
  // console.log({ classes })
  // console.log({ selectedClass, selectedSection })
  return (
    <>
      <Card sx={{ m: 1, pt: 1, px: 1, display: 'grid', gridTemplateColumns: { md: "2fr 2fr 1fr" }, columnGap: 1, maxWidth: 1200, mx: 'auto' }}>
        <DateRangePickerWrapper
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <ClassAndSectionSelect
          flag={true}
          classes={classes}
          selectedDate={undefined}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
        <SearchingButtonWrapper disabled={!startDate || !endDate || !selectedSection} handleClick={handleSearching} isLoading={isLoading} >
          Search
        </SearchingButtonWrapper>
      </Card>
      {/* <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
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
                placeholder={t('Search by grade name...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card> */}


      <Card sx={{ minHeight: 'calc(100vh - 450px) !important', borderRadius: 0.5, p: 0.5 }}>

        {!selectedBulkActions && (
          <Box
            px={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderRadius={0}
          >
            <Box>
              <Typography component="span" variant="subtitle1">
                {t('Showing')}:
              </Typography>{' '}
              <b>{paginatedNotes.length}</b> <b>{t('notes')}</b>
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
        {/* <Divider /> */}

        {paginatedNotes.length === 0 ? (
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
                "We couldn't find any matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table size="small" sx={{ py: 1 }}>
                <TableHead>
                  <TableRow >
                    {/* <TableCellWrapper padding="checkbox">
                      <Checkbox
                        checked={selectedAllGrades}
                        indeterminate={selectedSomesGrades}
                        onChange={handleSelectAllschools}
                      />
                    </TableCellWrapper> */}

                    <TableCellWrapper>{t('Id')}</TableCellWrapper>
                    <TableCellWrapper>{t('Teacher')}</TableCellWrapper>
                    <TableCellWrapper>{t('Subject')}</TableCellWrapper>
                    <TableCellWrapper>{t('Date')}</TableCellWrapper>
                    <TableCellWrapper>{t('Class Note')}</TableCellWrapper>
                    {/* <TableCellWrapper>{t('Grade')}</TableCellWrapper> */}
                    {/* <TableCellWrapper align="center">{t('Actions')}</TableCellWrapper> */}

                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedNotes.map((note) => {
                    const isschoolselected = selectedItems.includes(
                      note.id
                    );
                    return (
                    
                      
                      <TableRowWrapper
                        
                        key={note.id}
                        selected={isschoolselected}
                      >
                        {/* <TableCellWrapper padding="checkbox">
                          <Checkbox
                            checked={isschoolselected}
                            onChange={(event) =>
                              handleSelectOneProject(event, note.id)
                            }
                            value={isschoolselected}
                          />
                        </TableCellWrapper> */}

                        <TableCellWrapper>
                          {note?.id || ''}
                        </TableCellWrapper>

                        <TableCellWrapper>
                          {note?.period?.teacher?.first_name || ''}
                        </TableCellWrapper>

                        <TableCellWrapper>
                          {note?.subject?.name || ''}
                        </TableCellWrapper>

                        <TableCellWrapper>
                          {customizeDate(note?.date)}
                        </TableCellWrapper>

                        <TableCellWrapper>
                          {note?.note}
                        </TableCellWrapper>

                        {/* <TableCellWrapper align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => setEditGrade(note)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(note.id)
                                }
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCellWrapper> */}
                      </TableRowWrapper>
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
  classes: PropTypes.array.isRequired
};

Results.defaultProps = {
  classes: []
};

export default Results;
