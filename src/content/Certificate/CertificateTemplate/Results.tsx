import { FC, ChangeEvent, useState, ReactElement, Ref, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  TableCell,
  TableRow,
  Typography,

} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import SearchInputWrapper from '@/components/SearchInput';
import BulkActions from '@/components/BulkAction';
import { DialogWrapper } from '@/components/DialogWrapper';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import Image from 'next/image';


interface ResultsProps {
  sessions: Project[];
  setEditData: Function;
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
  sessions: Project[],
  query: string,
  filters: Filters
): Project[] => {
  console.log({ sessions })
  return sessions?.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['id', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property]?.toString().toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

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
  sessions: Project[],
  page: number,
  limit: number
): Project[] => {
  return sessions.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({
  sessions,
  setEditData
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


  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      event.target.checked ? sessions.map((project) => project.id) : []
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

  const filteredschools = applyFilters(sessions, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeschools =
    selectedItems.length > 0 && selectedItems.length < sessions.length;
  const selectedAllschools = selectedItems.length === sessions.length;

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
      const result = await axios.delete(`/api/fees/${deleteSchoolId}`);
      console.log({ result });
      setOpenConfirmDelete(false);
      if (!result.data?.success) throw new Error('unsuccessful delete');
      showNotification('The fees has been deleted successfully');

    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification(err?.response?.data?.message, 'error');
    }
  };

  return (
    <>
      <SearchInputWrapper
        placeholder="Search by id or certificate name..."
        handleQueryChange={handleQueryChange}
        query={query}
      />

      <Card sx={{ minHeight: 'calc(100vh - 438px) !important' }}>
        {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )}
        {!selectedBulkActions && (
          <>
            <TableHeadWrapper
              title="certificate templates"
              total={paginatedFees.length}
              count={filteredschools.length}
              page={page}
              rowsPerPage={limit}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
            />
          </>
        )}
        <Divider />

        {paginatedFees.length === 0 ? (
          <TableEmptyWrapper title="email tamplates" />
        )
          :
          (
            <>
              <TableContainerWrapper
                tableHead={
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllschools}
                        indeterminate={selectedSomeschools}
                        onChange={handleSelectAllschools}
                      />
                    </TableCell>
                    <TableCell>{t('id')}</TableCell>
                    <TableCell>{t('certificate name')}</TableCell>
                    <TableCell>{t('applicable user')}</TableCell>
                    <TableCell>{t('page layout')}</TableCell>
                    <TableCell>{t('background_image')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((certificate) => {
                      const isschoolselected = selectedItems.includes(
                        certificate.id
                      );
                      return (
                        <TableRow
                          hover
                          key={certificate.id}
                          selected={isschoolselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, certificate.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {certificate.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {certificate.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {certificate.user_type}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {certificate.page_layout}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {/* @ts-ignore */}
                              <img src={`/api/get_file${certificate.background_url}`} className="w-fit h-10" alt="background_image" />
                              {/* <Image height={50} width={50} src={fee.background_url} /> */}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => setEditData(certificate)}
                                  color="primary"
                                >
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleConfirmDelete(fee.id)
                                  }
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip> */}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                }

              />
            </>
          )}
      </Card>


      <DialogWrapper
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
        Transition={Transition}
      />
    </>
  );
};

Results.propTypes = {
  sessions: PropTypes.array.isRequired
};

Results.defaultProps = {
  sessions: []
};

export default Results;
