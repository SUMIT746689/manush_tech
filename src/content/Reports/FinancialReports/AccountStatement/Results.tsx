import { FC, ChangeEvent, useState, ReactElement, Ref, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Card, Slide, Divider, TableCell, TableRow, Typography, Grid } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import SearchInputWrapper from '@/components/SearchInput';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import CsvExport from '@/components/Export/Csv';
import { PdfExport } from '@/components/Export/Pdf';


interface ResultsProps {
  title: string;
  datas: Project[];
  tableFooter?: any;
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
  console.log({ datas })
  return datas?.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['id'];
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
  datas: Project[],
  page: number,
  limit: number
): Project[] => {
  return datas.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ title, datas, tableFooter = null }) => {

  const { t }: { t: any } = useTranslation();

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

  const filteredschools = applyFilters(datas, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);


  const handleTableHead = (item: any) => {
    const a = []
    for (const [key, value] of Object.entries(item)) {
      a.push(<TableCell sx={{ p: 0.6 }}>{t(key)}</TableCell>)
    }
    return a;
  }

  const handleTableBody = (item: any) => {
    const a = []
    for (const [key, value] of Object.entries(item)) {
      a.push(<TableCell sx={{ p: 0.6 }}>
        <Typography noWrap variant="h5">
          {value}
        </Typography>
      </TableCell>)
    }
    return a;
  }

  
  return (
    <>
      <Card sx={{ minHeight: 'calc(100vh - 400px)', borderRadius: 0.6 }}>

        <TableHeadWrapper
          title={title}
          total={paginatedFees.length}
          count={filteredschools.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          children={<>
            <SearchInputWrapper
              placeholder="Search by id ..."
              handleQueryChange={handleQueryChange}
              query={query}
            />
            <Grid display="flex">
              {
                datas.length > 0 && <>
                  <PdfExport title={title} exportData={datas} tableFooter={tableFooter} />
                  <CsvExport exportData={datas} />
                </>
              }
            </Grid>

          </>
          }
        />

        <Divider />

        {paginatedFees.length === 0 ? (
          <TableEmptyWrapper title={title} />
        )
          :
          (
            <>
              <TableContainerWrapper
                tableHead={
                  <TableRow>
                    {handleTableHead(paginatedFees[0])}

                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((fee) =>
                    (
                      <TableRow
                        hover
                        key={fee.id}
                      >
                        {handleTableBody(fee)}
                      </TableRow>
                    )
                    )}
                  </>
                }
                tableFooter={tableFooter}

              />
            </>
          )}
      </Card>

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
