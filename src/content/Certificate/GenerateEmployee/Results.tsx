import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, TableCell, TableRow, Grid, Checkbox, Tooltip } from '@mui/material';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import { DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { fetchData } from '@/utils/post';
import { GenerateCertificateExport } from '@/components/Export/certificate';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import dayjs from 'dayjs';
import CsvExport from '@/components/Export/Csv';


interface ResultsProps {
  // sent_sms: Project[];
  roles: any;
  templates: any;
}

interface Filters {
  status?: ProjectStatus;
}


const applyFilters = (
  sessions: Project[],
  query: string,
  filters: Filters
): Project[] => {
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

const Results: FC<ResultsProps> = ({ roles, templates }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const [reportDatas, setReportDatas] = useState<any>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [selectedRole, setSelectedRole] = useState<number>();
  const [selectedTemplate, setSelectedTemplate] = useState<number>();
  const [employees, setemployees] = useState<any>([]);
  const [printDate, setPrintDate] = useState<any>(dayjs(Date.now()));


  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllPaginateschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      event.target.checked ? paginatedFees.map((project) => project.id) : []
    );
  };
  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      event.target.checked ? employees.map((project) => project.id) : []
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

  const filteredschools = applyFilters(employees, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);
  const selectedSomeEmployees = selectedItems.length > 0 && selectedItems.length < paginatedFees.length;
  const selectedAllPaginatedemployees = selectedItems.length === paginatedFees.length;
  const selectedAllemployees = selectedItems.length > 0 && selectedItems.length === employees.length;

  const handleRoleChange = (e) => {

    setSelectedRole(e.target.value);
    // const findcls = roles.find(cls => cls.id === e.target.value);

    // const allSection = [{ title: "SELECT ALL", value: 0 }];
    // allSection.push(...findcls?.sections?.map(section => ({ title: section.name, value: section.id })));
    // setSections(() => allSection);
  }

  const handleSearchClick = async () => {
    let url = `/api/user/role_wise_users?role_id=${selectedRole}`;
    // if (selectedSection > 0) url += `&section_id=${selectedSection}`;
    const [err, resemployees] = await fetchData(url, 'get', {});
    setemployees(() => err ? [] : resemployees);
  }
  const handleTemplateChange = (e) => setSelectedTemplate(e.target.value);

  const selectAllemployeesHandle = () => { setSelectedschools(() => employees.map(employee => employee.id) || []) }
  const handleDateChange = (e) => setPrintDate(dayjs(e));
  const export_data = () => {
    const filter_employee = employees.filter(std => selectedItems.includes(std.id));
    const findTemplate = templates.find(tmp => selectedTemplate === tmp.id);
    const finduser = roles.find(role => selectedRole === role.id);
    const customize_data = filter_employee.map((employ, index) => ({
      SL: index + 1,
      Certificate: findTemplate?.name,
      'Applicable User': finduser?.title,
      'Page Layout': findTemplate?.page_layout
    }));
    return customize_data;
  }

  return (
    <>

      <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr min-content' }, gap: { sm: 1 } }}>
        <Grid>
          <DynamicDropDownSelectWrapper value={selectedRole} label='Select Role' name='' handleChange={handleRoleChange} menuItems={roles?.map(role => ({ title: role.title, value: role.id }))} />
        </Grid>
        <Grid >
          <DynamicDropDownSelectWrapper value={selectedTemplate} label='Select Template' name='' handleChange={handleTemplateChange} menuItems={templates.map(tmplt => ({ title: tmplt.name, value: tmplt.id }))} />
        </Grid>
        <Grid item container justifyContent={"flex-end"} >
          <ButtonWrapper disabled={!selectedRole || !selectedTemplate} handleClick={handleSearchClick}>Search</ButtonWrapper>
        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 350px)',borderRadius:0.5 }}>

        <TableHeadWrapper
          title="employees"
          total={paginatedFees.length}
          count={filteredschools.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          children={<>
            <DatePickerWrapper label="Print Date" date={printDate} handleChange={handleDateChange} />
            <Grid item display="flex" gap={2}>
              {
                selectedItems.length > 0 && selectedTemplate && (
                  <>
                    <GenerateCertificateExport publicationDate={printDate} datas={employees.filter(std => selectedItems.includes(std.id))} template={templates.find(tmp => selectedTemplate === tmp.id)} />
                    <CsvExport exportData={export_data()} />
                  </>
                )
              }
            </Grid>
          </>}
          selectAllCheckbox={
            <Tooltip title={'Select All'} arrow>
              <Checkbox
              sx={{p:0}}
                checked={selectedAllemployees}
                onChange={handleSelectAllschools}
              />
            </Tooltip>
          }
        />
        <Divider />

        {paginatedFees.length === 0 ? (
          <TableEmptyWrapper title="no sent sms found" />
        )
          :
          (
            <>
              <TableContainerWrapper
                tableHead={
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllPaginatedemployees}
                        indeterminate={selectedSomeEmployees}
                        onChange={handleSelectAllPaginateschools}
                      />
                    </TableCell>
                    <TableCell>{t('ID')}</TableCell>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('Department')}</TableCell>
                    <TableCell>{t('Mobile No')}</TableCell>
                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((student) => {
                      const isschoolselected = selectedItems.includes(
                        student.id
                      );
                      return (
                        <TableRow
                          hover
                          key={student.id}
                          selected={isschoolselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, student.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {student.id}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {student.student_info?.first_name + (student.student_info?.middle_name || " ") + (student.student_info?.last_name || " ")}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {student.user_role?.title}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {student.phone}
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
  roles: PropTypes.array.isRequired
};

Results.defaultProps = {
  roles: []
};

export default Results;
