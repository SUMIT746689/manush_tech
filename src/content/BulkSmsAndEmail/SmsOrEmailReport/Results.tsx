import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Divider, TableCell, TableRow, Grid } from '@mui/material';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import BulkActions from '@/components/BulkAction';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import dayjs from 'dayjs';
import { DropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { fetchData } from '@/utils/post';


interface ResultsProps {
  // sent_sms: Project[];
}

interface Filters {
  status?: ProjectStatus;
}


const applyFilters = (sessions, query, filters) => {
  return sessions?.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['title', 'id', 'amount'];
      let containsQuery = false;

      // properties.forEach((property) => {
      //   if (project[property]?.toString().toLowerCase().includes(query.toLowerCase())) {
      //     containsQuery = true;
      //   }
      // });

      // if (filters.status && project.status !== filters.status) {
      //   matches = false;
      // }

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
  sent_sms: Project[],
  page: number,
  limit: number
): Project[] => {
  return sent_sms.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const [reportDatas, setReportDatas] = useState<any>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [type, setType] = useState<string>("SMS");
  const [compaignType, setCompaignType] = useState<string>("SELECT ALL");


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

  const filteredschools = applyFilters(reportDatas, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeschools =
    selectedItems.length > 0 && selectedItems.length < reportDatas.length;
  const selectedAllschools = selectedItems.length === reportDatas.length;

  const handleChange = (e) => {
    setType(e.target.value)
    setReportDatas([])
  }
  const handleCompaignChange = (e) => {

    setCompaignType(e.target.value)
  }
  const handleSearchClick = async () => {
    const url = type === 'SMS' ? '/api/sent_sms' : '/api/sent_email';
    const [err, res] = await fetchData(url, 'get', {});
    if (res?.success) setReportDatas(res.data);
    else setReportDatas([]);
  }
  return (
    <>
      <Card sx={{ maxWidth: 700, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: 'auto auto min-content' }, gap: { sm: 1 } }}>
        <Grid>
          <DropDownSelectWrapper value={type} label={'Type'} handleChange={handleChange} menuItems={['SMS', 'EMAIL']} />
        </Grid>
        <Grid >
          <DropDownSelectWrapper value={compaignType} label={'Campaign Type'} handleChange={handleCompaignChange} menuItems={['SELECT ALL']} />
        </Grid>
        <Grid item container justifyContent={"flex-end"} >
          {/* <DropDownSelectWrapper value={'sss'} label={'Campaign Type'} handleChange={handleChange} menuItems={['a', 'b', 'v']} /> */}
          <ButtonWrapper handleClick={handleSearchClick}>Search</ButtonWrapper>
        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 350px)' }}>
        {selectedBulkActions && (
          <Box p={2}>
            <BulkActions />
          </Box>
        )}
        {!selectedBulkActions && (
          <>
            <TableHeadWrapper
              title="reports"
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
          <TableEmptyWrapper title={`no ${type} report found`} />
        )
          :
          (
            <>
              <TableContainerWrapper
                tableHead={
                  <TableRow>
                    <TableCell>{t('ID')}</TableCell>
                    {
                      type === 'SMS' ?
                        <TableCell>{t('sms gateway')}</TableCell>
                        :
                        <TableCell>{t('email subject')}</TableCell>
                    }
                    <TableCell>{t('Recipient type')}</TableCell>
                    <TableCell>{t('recipient count')}</TableCell>
                    <TableCell>{t('created at')}</TableCell>
                    {/* <TableCell align="center">{t('Actions')}</TableCell> */}
                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((fee) => {
                      const isschoolselected = selectedItems.includes(
                        fee.id
                      );
                      return (
                        <TableRow
                          hover
                          key={fee.id}
                          selected={isschoolselected}
                        >
                          <TableCell sx={{ py: 1 }}>
                            {fee.id}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {
                              type === 'SMS' ?
                                fee?.smsGateway?.title
                                :
                                 fee.subject 
                            }
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {fee.recipient_type}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {fee.recipient_count}
                          </TableCell >
                          <TableCell sx={{ py: 1 }}>
                            {dayjs(fee.created_at).format('DD-MM-YYYY HH:mm')}
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

    </>
  );
};

Results.propTypes = {
  sent_sms: PropTypes.array.isRequired
};

Results.defaultProps = {
  sent_sms: []
};

export default Results;
