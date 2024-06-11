import { ChangeEvent, useState, ReactElement, Ref, forwardRef, FC } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  TableCell,
  Avatar,
  Box,
  Card,
  Slide,
  Divider,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  Button,
  Typography,
  Dialog,
  styled,
  TablePagination,
  Grid,
  Switch
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from 'src/models/user';
import { useTranslation } from 'react-i18next';
// import BulkActions from './../BulkActions';
import useNotistick from '@/hooks/useNotistick';
import dayjs from 'dayjs';
import axios from 'axios';
import Image from 'next/image';
import IdentityCard from '@/content/Management/Students/StudentIdCardDesign';
import { getFile } from '@/utils/utilitY-functions';
import { TableBodyCellWrapper, TableHeaderCellWrapper } from '@/components/Table/Table';
import { ButtonWrapper, SearchingButtonWrapper } from '@/components/ButtonWrapper';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const Transition = forwardRef(function Transition(props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (users, query, filters) => {
  return users?.filter((user) => {
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

const applyPagination = (users, page, limit) => {
  return users?.slice(page * limit, page * limit + limit);
};

const Results = ({ query, setQuery, selectedItems, setSelectedUsers, students, refetch, discount, idCard, fee }) => {
  // const [selectedItems, setSelectedUsers] = useState<string[]>([]);

  const { t } = useTranslation();
  const { showNotification } = useNotistick();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  // const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<{ role?: string }>({
    role: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const userIds = students.slice(startIndex, endIndex).map((user) => user.id);
    if (event.target.checked) {
      setSelectedUsers((prevSelected) => [...new Set([...prevSelected, ...userIds])]);
    } else {
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => !userIds.includes(id)));
    }
  };

  const handleSelectOneUser = (_event: ChangeEvent<HTMLInputElement>, userId: string): void => {
    if (!selectedItems.includes(userId)) {
      setSelectedUsers((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId));
    }
  };

  const filteredClasses = applyFilters(students, query, filters);
  const paginatedClasses = applyPagination(filteredClasses, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const selectedSomeUsers = selectedItems.length > 0 && selectedItems.length < paginatedClasses.length;
  const selectedAllUsers = paginatedClasses.every((student) => selectedItems.includes(student.id));

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoading(true);
      if (selectedItems.length === 0) {
        showNotification('Please select at least one item.', 'error');
        return;
      }
      const values = {
        student_ids: selectedItems
      };
      const res = await axios.patch(`/api/student/separate_students`, values);

      if (res?.data?.data?.count > 0) {
        setSelectedUsers((prevSelected) => []);
        refetch();
        showNotification('Some students have been successfully separated.', 'success');
      }
    } catch (error) {
      showNotification(error?.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ minHeight: 'calc(100vh - 410px)', borderRadius: 0 }}>
        {!selectedBulkActions && (
          <Box px={2} display="flex" alignItems="center" justifyContent="space-between">
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
              rowsPerPageOptions={[20, 50, 70]}
            />
          </Box>
        )}
        <Divider />

        {paginatedClasses.length === 0 ? (
          <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
            {t("We couldn't find any students matching your search criteria")}
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedAllUsers} indeterminate={selectedSomeUsers} onChange={handleSelectAllUsers} />
                  </TableCell>
                  <TableHeaderCellWrapper>{t('student name')}</TableHeaderCellWrapper>
                  <TableHeaderCellWrapper>{t('student id')}</TableHeaderCellWrapper>
                  <TableHeaderCellWrapper>{t('Class')}</TableHeaderCellWrapper>
                  <TableHeaderCellWrapper>{t('Class Roll')}</TableHeaderCellWrapper>
                  <TableHeaderCellWrapper>{t('Section')}</TableHeaderCellWrapper>
                  <TableHeaderCellWrapper>{t('Phone')}</TableHeaderCellWrapper>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClasses.map((i) => {
                  const isUserSelected = selectedItems.includes(i.id);
                  return (
                    <TableRow hover key={i.id} selected={isUserSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isUserSelected} onChange={(event) => handleSelectOneUser(event, i.id)} />
                      </TableCell>
                      <TableBodyCellWrapper>
                        {[i?.student_info?.first_name, i?.student_info?.middle_name, i?.student_info?.last_name].join(' ')}
                      </TableBodyCellWrapper>
                      <TableBodyCellWrapper>{i?.student_info?.student_id}</TableBodyCellWrapper>
                      <TableBodyCellWrapper>{i?.section?.class?.name}</TableBodyCellWrapper>
                      <TableBodyCellWrapper>{i?.class_roll_no}</TableBodyCellWrapper>
                      <TableBodyCellWrapper>{i?.section?.class?.has_section ? i?.section?.name : 'no section'}</TableBodyCellWrapper>
                      <TableBodyCellWrapper>
                        <a href={`tel:${i?.student_info?.phone}`}>{i?.student_info?.phone}</a>
                      </TableBodyCellWrapper>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
      <Grid mt={1}>
        <SearchingButtonWrapper isLoading={isLoading} disabled={isLoading} handleClick={handleClick}>
          Submit
        </SearchingButtonWrapper>
      </Grid>
    </>
  );
};

Results.propTypes = {
  students: PropTypes.array.isRequired
};

Results.defaultProps = {
  students: []
};

export default Results;
