import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, TableCell, TableRow, Grid, Checkbox, Tooltip, IconButton, Modal } from '@mui/material';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import dayjs from 'dayjs';
import { DynamicDropDownSelectWrapper } from '@/components/DropDown';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { fetchData } from '@/utils/post';
import { GenerateCertificate, GenerateCertificateExport } from '@/components/Export/certificate';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import CsvExport from '@/components/Export/Csv';
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';

interface ResultsProps {
  student: any;
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

const StudentResults: FC<ResultsProps> = ({ templates, student }) => {
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
  const [showTemplate, setShowTemplate] = useState<boolean>(false);





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

  const filteredschools = applyFilters(templates, query, filters);
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

      <Modal open={showTemplate} onClose={() => setShowTemplate(false)}
        ria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" 
        >
        <div>aaa</div>
      </Modal>


      <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr min-content' }, gap: { sm: 1 } }}>
        <Grid>
          <UncontrolledTextFieldWrapper label="Name" value={student.student_info?.first_name + (student.student_info?.middle_name || " ") + (student.student_info?.last_name || " ")} />
        </Grid>
        <Grid>
          <UncontrolledTextFieldWrapper label="Class" value={student.section?.class?.name} />
          {/* <DynamicDropDownSelectWrapper value={selectedClass} label='Select Class' name='' handleChange={handleClassChange} menuItems={classes?.map(cls => ({ title: cls.name, value: cls.id }))} /> */}
        </Grid>
        <Grid >
          <UncontrolledTextFieldWrapper label="Section" value={student.section.class.has_section ? student.section?.name : ''} />
          {/* <DynamicDropDownSelectWrapper value={selectedSection} label='Select Section' name='' handleChange={handleSectionChange} menuItems={sections} /> */}
        </Grid>
        {/* <Grid >
          <DynamicDropDownSelectWrapper value={selectedTemplate} label='Select Template' name='' handleChange={handleTemplateChange} menuItems={templates.map(tmplt => ({ title: tmplt.name, value: tmplt.id }))} />
        </Grid>
        <Grid item container justifyContent={"flex-end"} >
          <ButtonWrapper disabled={!selectedTemplate } handleClick={handleSearchClick}>Search</ButtonWrapper>
        </Grid> */}
      </Card>

      <Card sx={{ minHeight: 'calc(100vh - 350px)' }}>

        <TableHeadWrapper
          title="templates"
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
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllschools}
                        indeterminate={selectedSomeschools}
                        onChange={handleSelectAllschools}
                      />
                    </TableCell> */}
                    <TableCell>{t('ID')}</TableCell>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('Background Image')}</TableCell>
                    <TableCell>{t('Actions')}</TableCell>

                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((template) => {
                      const isschoolselected = selectedItems.includes(
                        template.id
                      );
                      return (
                        <TableRow
                          hover
                          key={template.id}
                          selected={isschoolselected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, student.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell> */}
                          <TableCell sx={{ py: 1 }}>
                            {template.id}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {template.name}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {<img src={template.background_url} className=' h-10' alt='background_image' />}
                          </TableCell>
                          <TableCell>
                            <Tooltip title={t('Show')} arrow>
                              <IconButton
                                onClick={() => { }
                                  // handleConfirmDelete(fee.id)
                                }
                                color="primary"
                              >
                                <GenerateCertificate _for='student' publicationDate={printDate} datas={[student]} template={template} />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title={t('Download')} arrow>
                                <IconButton
                                  onClick={() =>{}}
                                  color="primary"
                                > */}
                            <GenerateCertificateExport _for='student' publicationDate={printDate} datas={[student]} template={template} />
                            {/* </IconButton>
                              </Tooltip> */}
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

export default StudentResults;
