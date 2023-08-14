import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, TableCell, TableRow, Grid, Checkbox } from '@mui/material';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import dayjs from 'dayjs';
import { DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { fetchData } from '@/utils/post';
import { GenerateCertificateExport } from '@/components/Export/certificate';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import CsvExport from '@/components/Export/Csv';


interface ResultsProps {
  // sent_sms: Project[];
  classes: any;
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
  console.log({ sessions })
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

const Results: FC<ResultsProps> = ({ classes, templates }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [selectedClass, setSelectedClass] = useState<number>();
  const [sections, setSections] = useState<any>([{ title: "SELECT ALL", value: 0 }]);
  const [selectedSection, setSelectedSection] = useState<number>();
  const [selectedTemplate, setSelectedTemplate] = useState<number>();
  const [students, setStudents] = useState<any>([]);
  const [printDate, setPrintDate] = useState<any>(dayjs(Date.now()));


  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllschools = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedschools(
      event.target.checked ? paginatedFees.map((project) => project.id) : []
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

  const filteredschools = applyFilters(students, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeschools = selectedItems.length > 0 && selectedItems.length < paginatedFees.length;
  const selectedAllschools = selectedItems.length === paginatedFees.length;

  const handleClassChange = (e) => {

    setSelectedClass(e.target.value);
    const findcls = classes.find(cls => cls.id === e.target.value);

    const allSection = [{ title: "SELECT ALL", value: 0 }];
    allSection.push(...findcls?.sections?.map(section => ({ title: section.name, value: section.id })));
    setSections(() => allSection);
  }

  const handleSectionChange = (e) => setSelectedSection(e.target.value);
  const handleSearchClick = async () => {
    let url = `/api/student?class_id=${selectedClass}`;
    if (selectedSection > 0) url += `&section_id=${selectedSection}`;
    const [err, resstudents] = await fetchData(url, 'get', {});
    setStudents(() => err ? [] : resstudents)
  }

  const handleTemplateChange = (e) => {
    console.log({ e: e.target.value });
    setSelectedTemplate(e.target.value)
  }

  const handleDateChange = (e) => setPrintDate(dayjs(e));
  const export_data = () => {
    const filter_students = students.filter(std => selectedItems.includes(std.id));
    const findTemplate = templates.find(tmp => selectedTemplate === tmp.id);
    const customize_data = filter_students.map((student, index) => ({
      SL: index + 1,
      Certificate: findTemplate?.name,
      'Applicable User': 'student',
      'Name': student.student_info?.first_name + (student.student_info?.middle_name || " ") + (student.student_info?.last_name || " "),
      'Registration No.': student.class_registration_no,
      'Roll No.': student.class_registration_no,
      'Page Layout': findTemplate?.page_layout
    }));
    return customize_data;
  }

  return (
    <>
      <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr min-content' }, gap: { sm: 1 } }}>
        <Grid>
          <DynamicDropDownSelectWrapper value={selectedClass} label='Select Class' name='' handleChange={handleClassChange} menuItems={classes?.map(cls => ({ title: cls.name, value: cls.id }))} />
        </Grid>
        <Grid >
          <DynamicDropDownSelectWrapper value={selectedSection} label='Select Section' name='' handleChange={handleSectionChange} menuItems={sections} />
        </Grid>
        <Grid >
          <DynamicDropDownSelectWrapper value={selectedTemplate} label='Select Template' name='' handleChange={handleTemplateChange} menuItems={templates.map(tmplt => ({ title: tmplt.name, value: tmplt.id }))} />
        </Grid>
        <Grid item container justifyContent={"flex-end"} >
          <ButtonWrapper disabled={!selectedClass || !selectedTemplate || !(selectedSection >= 0)} handleClick={handleSearchClick}>Search</ButtonWrapper>
        </Grid>
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 350px)' }}>

        <TableHeadWrapper
          title="students"
          total={paginatedFees.length}
          count={filteredschools.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          children={<>
            <DatePickerWrapper label="Print Date" date={printDate} handleChange={handleDateChange} />
            <Grid item display="flex" gap={2}>
              {selectedBulkActions && (
                selectedItems.length > 0 && selectedTemplate && (
                  <>
                    <GenerateCertificateExport publicationDate={printDate} datas={students.filter(std => selectedItems.includes(std.id))} template={templates.find(tmp => selectedTemplate === tmp.id)} />
                    <CsvExport exportData={export_data()} />
                  </>
                )
              )}

            </Grid>
          </>}
        />

        <Divider />

        {paginatedFees.length === 0 ? (
          <TableEmptyWrapper title="students" />
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
                    <TableCell>{t('ID')}</TableCell>
                    <TableCell>{t('Student Name')}</TableCell>
                    <TableCell>{t('Category')}</TableCell>
                    <TableCell>{t('Registration No')}</TableCell>
                    <TableCell>{t('Roll No')}</TableCell>
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
                            Student
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {student.class_registration_no}
                          </TableCell >
                          <TableCell sx={{ py: 1 }}>
                            {student.class_roll_no}
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
  classes: PropTypes.array.isRequired
};

Results.defaultProps = {
  classes: []
};

export default Results;
